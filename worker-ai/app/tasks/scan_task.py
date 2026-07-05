import os
import time
import requests
from app.core.celery_app import app

BACKEND_WEBHOOK_URL = os.getenv('BACKEND_WEBHOOK_URL', 'http://localhost:8080/api/v1/scans/webhook')

@app.task(name="app.tasks.scan_task.process_ocr")
def process_ocr(task_id, image_url):
    print(f"Starting OCR task {task_id} for image {image_url}")
    
    # Simulate AI processing time
    time.sleep(3)
    
    # Mock AI result
    payload = {
        "task_id": str(task_id),
        "status": "COMPLETED",
        "nutrition_data": {
            "calories": 250.0,
            "protein": 12.5,
            "fat": 5.0,
            "carbs": 35.0
        }
    }
    
    try:
        response = requests.post(BACKEND_WEBHOOK_URL, json=payload)
        response.raise_for_status()
        print(f"Successfully sent webhook for task {task_id}")
    except Exception as e:
        print(f"Failed to send webhook for task {task_id}: {str(e)}")
        # We raise the exception so Celery marks the task as failed
        raise e
        
    return payload
