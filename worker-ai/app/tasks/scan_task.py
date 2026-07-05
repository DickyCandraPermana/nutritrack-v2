import os
import requests
from app.core.celery_app import app
from app.services.ocr_engine import extract_nutrition

BACKEND_WEBHOOK_URL = os.getenv('BACKEND_WEBHOOK_URL', 'http://localhost:3000/scans/webhook')

@app.task(name="app.tasks.scan_task.process_ocr")
def process_ocr(task_id, image_url):
    print(f"Starting OCR task {task_id} for image {image_url}")
    
    try:
        # Call Gemini AI
        nutrition_data = extract_nutrition(image_url)
        print(f"Extraction successful: {nutrition_data}")
        
        payload = {
            "task_id": str(task_id),
            "status": "COMPLETED",
            "nutrition_data": nutrition_data
        }
    except Exception as e:
        print(f"OCR failed for task {task_id}: {str(e)}")
        payload = {
            "task_id": str(task_id),
            "status": "FAILED",
            "error_message": str(e)
        }
    
    try:
        response = requests.post(BACKEND_WEBHOOK_URL, json=payload)
        response.raise_for_status()
        print(f"Successfully sent webhook for task {task_id}")
    except Exception as e:
        print(f"Failed to send webhook for task {task_id}: {str(e)}")
        # Raise exception so Celery marks task as failed if webhook fails
        raise e
        
    return payload
