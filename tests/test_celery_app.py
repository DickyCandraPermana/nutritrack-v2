import importlib
import os
import sys
from unittest.mock import patch
import pytest
from celery import Celery

# Ensure worker-ai directory is in sys.path if not already present
worker_ai_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "worker-ai"))
if worker_ai_path not in sys.path:
    sys.path.insert(0, worker_ai_path)

import app.core.celery_app as celery_module


@pytest.fixture(autouse=True)
def restore_celery_module():
    """Ensure celery_module is reset to default environment after each test."""
    yield
    # Restore default environment variable and reload
    os.environ.pop("RABBITMQ_URL", None)
    importlib.reload(celery_module)


def test_celery_app_instance():
    """Test that app is an instance of Celery with the expected name."""
    assert isinstance(celery_module.app, Celery)
    assert celery_module.app.main == "nutritrack_worker"


def test_celery_app_includes():
    """Test that the expected task modules are registered in the include list."""
    expected_task = "app.tasks.scan_task"
    assert expected_task in celery_module.app.conf.include


def test_celery_app_configurations():
    """Test Celery configuration settings."""
    conf = celery_module.app.conf

    assert conf.task_serializer == "json"
    assert conf.accept_content == ["json"]
    assert conf.result_serializer == "json"
    assert conf.timezone == "Asia/Jakarta"
    assert conf.enable_utc is True
    assert conf.task_protocol == 1
    assert conf.task_default_queue == "ocr_tasks"


def test_default_rabbitmq_url(monkeypatch):
    """Test default broker URL fallback when RABBITMQ_URL is not set."""
    monkeypatch.delenv("RABBITMQ_URL", raising=False)
    reloaded_module = importlib.reload(celery_module)

    expected_default_url = "amqp://admin:secretpassword@localhost:5672/"
    assert reloaded_module.RABBITMQ_URL == expected_default_url
    assert reloaded_module.app.conf.broker_url == expected_default_url


def test_custom_rabbitmq_url(monkeypatch):
    """Test custom broker URL loaded when RABBITMQ_URL is set."""
    custom_url = "amqp://testuser:testpass@rabbitmq.internal:5672/vhost"
    monkeypatch.setenv("RABBITMQ_URL", custom_url)
    reloaded_module = importlib.reload(celery_module)

    assert reloaded_module.RABBITMQ_URL == custom_url
    assert reloaded_module.app.conf.broker_url == custom_url


def test_celery_initialization_parameters(monkeypatch):
    """Test that Celery constructor is called with correct keyword arguments."""
    with patch("celery.Celery") as mock_celery:
        monkeypatch.setenv("RABBITMQ_URL", "amqp://mocked:5672/")
        importlib.reload(celery_module)

        mock_celery.assert_called_once_with(
            "nutritrack_worker",
            broker="amqp://mocked:5672/",
            include=["app.tasks.scan_task"],
        )
