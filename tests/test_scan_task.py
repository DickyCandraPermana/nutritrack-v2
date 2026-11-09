import uuid
from unittest.mock import MagicMock, patch
import pytest
import requests

from app.tasks.scan_task import BACKEND_WEBHOOK_URL, process_ocr


@pytest.fixture
def mock_extract_nutrition():
    with patch("app.tasks.scan_task.extract_nutrition") as mock:
        yield mock


@pytest.fixture
def mock_requests_post():
    with patch("app.tasks.scan_task.requests.post") as mock:
        mock_response = MagicMock(spec=requests.Response)
        mock_response.status_code = 200
        mock_response.raise_for_status.return_value = None
        mock.return_value = mock_response
        yield mock


class TestProcessOcrHappyPath:
    """Tests for successful OCR processing and webhook notification."""

    def test_process_ocr_success(self, mock_extract_nutrition, mock_requests_post):
        task_id = "test-task-123"
        image_url = "https://example.com/nutrition_label.jpg"
        expected_nutrition = {
            "calories": 250,
            "fat": "5g",
            "carbohydrates": "40g",
            "protein": "10g",
        }

        mock_extract_nutrition.return_value = expected_nutrition

        result = process_ocr(task_id, image_url)

        # Assertions on external calls
        mock_extract_nutrition.assert_called_once_with(image_url)
        mock_requests_post.assert_called_once_with(
            BACKEND_WEBHOOK_URL,
            json={
                "task_id": task_id,
                "status": "COMPLETED",
                "nutrition_data": expected_nutrition,
            },
        )
        mock_requests_post.return_value.raise_for_status.assert_called_once()

        # Assert returned payload
        assert result == {
            "task_id": task_id,
            "status": "COMPLETED",
            "nutrition_data": expected_nutrition,
        }

    def test_process_ocr_converts_numeric_and_uuid_task_id_to_str(
        self, mock_extract_nutrition, mock_requests_post
    ):
        raw_task_id = 98765
        image_url = "https://example.com/label.png"
        mock_extract_nutrition.return_value = {}

        result = process_ocr(raw_task_id, image_url)
        assert result["task_id"] == "98765"

        uuid_task_id = uuid.uuid4()
        result_uuid = process_ocr(uuid_task_id, image_url)
        assert result_uuid["task_id"] == str(uuid_task_id)


class TestProcessOcrExtractionFailures:
    """Tests handling of failures during the OCR extraction phase."""

    def test_process_ocr_handles_extraction_generic_exception(
        self, mock_extract_nutrition, mock_requests_post
    ):
        task_id = "failed-task-1"
        image_url = "https://example.com/unreadable.jpg"
        error_message = "Gemini AI model timeout"
        mock_extract_nutrition.side_effect = Exception(error_message)

        result = process_ocr(task_id, image_url)

        # Extraction was attempted
        mock_extract_nutrition.assert_called_once_with(image_url)

        # Webhook was called reporting failure
        expected_payload = {
            "task_id": task_id,
            "status": "FAILED",
            "error_message": error_message,
        }
        mock_requests_post.assert_called_once_with(
            BACKEND_WEBHOOK_URL,
            json=expected_payload,
        )

        # The function returns the failed payload if webhook succeeds
        assert result == expected_payload

    def test_process_ocr_handles_extraction_value_error(
        self, mock_extract_nutrition, mock_requests_post
    ):
        task_id = "failed-task-2"
        image_url = "https://example.com/corrupt.jpg"
        mock_extract_nutrition.side_effect = ValueError("Invalid image content")

        result = process_ocr(task_id, image_url)

        assert result["status"] == "FAILED"
        assert result["error_message"] == "Invalid image content"
        mock_requests_post.assert_called_once()


class TestProcessOcrWebhookFailures:
    """Tests handling of errors when delivering the webhook."""

    def test_webhook_connection_error_raises_exception(
        self, mock_extract_nutrition, mock_requests_post
    ):
        task_id = "webhook-fail-task"
        image_url = "https://example.com/image.jpg"
        mock_extract_nutrition.return_value = {"calories": 100}
        mock_requests_post.side_effect = requests.exceptions.ConnectionError("Connection refused")

        with pytest.raises(requests.exceptions.ConnectionError) as exc_info:
            process_ocr(task_id, image_url)

        assert "Connection refused" in str(exc_info.value)

    def test_webhook_http_error_raises_exception(
        self, mock_extract_nutrition, mock_requests_post
    ):
        task_id = "webhook-500-task"
        image_url = "https://example.com/image.jpg"
        mock_extract_nutrition.return_value = {"calories": 100}

        http_error = requests.exceptions.HTTPError("500 Server Error")
        mock_requests_post.return_value.raise_for_status.side_effect = http_error

        with pytest.raises(requests.exceptions.HTTPError) as exc_info:
            process_ocr(task_id, image_url)

        assert "500 Server Error" in str(exc_info.value)

    def test_webhook_failure_after_ocr_failure_raises_exception(
        self, mock_extract_nutrition, mock_requests_post
    ):
        task_id = "both-fail-task"
        image_url = "https://example.com/bad.jpg"
        mock_extract_nutrition.side_effect = RuntimeError("OCR crashed")
        mock_requests_post.side_effect = requests.exceptions.Timeout("Webhook timed out")

        with pytest.raises(requests.exceptions.Timeout) as exc_info:
            process_ocr(task_id, image_url)

        assert "Webhook timed out" in str(exc_info.value)
        # Ensure webhook was called with failed status payload before raising
        mock_requests_post.assert_called_once_with(
            BACKEND_WEBHOOK_URL,
            json={
                "task_id": task_id,
                "status": "FAILED",
                "error_message": "OCR crashed",
            },
        )
