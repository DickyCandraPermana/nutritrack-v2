import os
from celery import Celery

RABBITMQ_URL = os.getenv('RABBITMQ_URL', 'amqp://admin:secretpassword@localhost:5672/')

app = Celery(
    'nutritrack_worker',
    broker=RABBITMQ_URL,
    include=['app.tasks.scan_task']
)

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Jakarta',
    enable_utc=True,
    task_protocol=1, # Use Protocol v1 so Go can easily publish JSON
    task_default_queue='ocr_tasks'
)
