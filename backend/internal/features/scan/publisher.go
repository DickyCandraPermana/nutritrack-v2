package scan

import (
	"context"
	"encoding/json"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Publisher interface {
	PublishOCRTask(ctx context.Context, taskID, imageURL string) error
}

type publisher struct {
	ch        *amqp.Channel
	queueName string
}

func NewPublisher(ch *amqp.Channel, queueName string) Publisher {
	return &publisher{ch: ch, queueName: queueName}
}

func (p *publisher) PublishOCRTask(ctx context.Context, taskID, imageURL string) error {
	payload := map[string]interface{}{
		"id":     taskID,
		"task":   "app.tasks.scan_task.process_ocr",
		"args":   []interface{}{taskID, imageURL},
		"kwargs": map[string]interface{}{},
	}
	body, _ := json.Marshal(payload)

	return p.ch.PublishWithContext(ctx,
		"",          // exchange
		p.queueName, // routing key
		false,       // mandatory
		false,       // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		})
}
