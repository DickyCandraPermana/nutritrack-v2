import json
import pytest
from unittest.mock import MagicMock, patch
import requests

try:
    import app.services.ocr_engine as ocr_module
    from app.services.ocr_engine import extract_nutrition
except ImportError:
    import sys
    from pathlib import Path
    worker_ai_path = Path(__file__).resolve().parent.parent / "worker-ai"
    if str(worker_ai_path) not in sys.path:
        sys.path.insert(0, str(worker_ai_path))
    import app.services.ocr_engine as ocr_module
    from app.services.ocr_engine import extract_nutrition


@pytest.fixture(autouse=True)
def set_api_key(monkeypatch):
    """Ensure GEMINI_API_KEY is configured for tests by default."""
    monkeypatch.setattr(ocr_module, "GEMINI_API_KEY", "mock-api-key")


@pytest.fixture
def mock_image_response():
    """Returns a mock successful requests.Response for image download."""
    mock_resp = MagicMock(spec=requests.Response)
    mock_resp.status_code = 200
    mock_resp.content = b"\x89PNG\r\n\x1a\nfake_image_bytes"
    mock_resp.headers = {"Content-Type": "image/png"}
    mock_resp.raise_for_status.return_value = None
    return mock_resp


def test_extract_nutrition_missing_api_key(monkeypatch):
    """Test ValueError is raised when GEMINI_API_KEY is not set or empty."""
    monkeypatch.setattr(ocr_module, "GEMINI_API_KEY", None)
    with pytest.raises(ValueError, match="GEMINI_API_KEY is not set"):
        extract_nutrition("https://example.com/food.jpg")

    monkeypatch.setattr(ocr_module, "GEMINI_API_KEY", "")
    with pytest.raises(ValueError, match="GEMINI_API_KEY is not set"):
        extract_nutrition("https://example.com/food.jpg")


def test_extract_nutrition_image_download_failure():
    """Test exception is raised when requests.get fails or raises HTTPError."""
    target_url = "https://example.com/nonexistent.jpg"
    with patch("app.services.ocr_engine.requests.get") as mock_get:
        mock_get.side_effect = requests.exceptions.HTTPError("404 Client Error")

        with pytest.raises(Exception) as exc_info:
            extract_nutrition(target_url)

        assert f"Failed to download image from {target_url}" in str(exc_info.value)
        assert "404 Client Error" in str(exc_info.value)


def test_extract_nutrition_happy_path(mock_image_response):
    """Test successful image processing and nutrition extraction with raw JSON."""
    raw_payload = {
        "name": "Grilled Chicken Salad",
        "calories": 350.5,
        "protein": 32.0,
        "carbs": 12.5,
        "fat": 18.0,
    }

    mock_gemini_result = MagicMock()
    mock_gemini_result.text = json.dumps(raw_payload)

    with patch("app.services.ocr_engine.requests.get", return_value=mock_image_response), \
         patch("app.services.ocr_engine.genai.GenerativeModel") as mock_model_cls:
        
        mock_model_instance = MagicMock()
        mock_model_instance.generate_content.return_value = mock_gemini_result
        mock_model_cls.return_value = mock_model_instance

        result = extract_nutrition("https://example.com/salad.png")

        mock_model_cls.assert_called_once_with("gemini-1.5-flash")
        mock_model_instance.generate_content.assert_called_once()
        call_args = mock_model_instance.generate_content.call_args[0][0]
        assert call_args[0] == {
            "mime_type": "image/png",
            "data": b"\x89PNG\r\n\x1a\nfake_image_bytes",
        }

        assert result == {
            "name": "Grilled Chicken Salad",
            "calories": 350.5,
            "protein": 32.0,
            "carbs": 12.5,
            "fat": 18.0,
        }


@pytest.mark.parametrize(
    "gemini_text_output",
    [
        '