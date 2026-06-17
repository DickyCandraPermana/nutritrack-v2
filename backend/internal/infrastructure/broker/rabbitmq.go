package infrastructure

import (
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

func NewRabbitMQConnection(amqpURL, queueName string) (*amqp.Connection, *amqp.Channel) {
	conn, err := amqp.Dial(amqpURL)
	if err != nil {
		log.Fatalf("Gagal koneksi ke RabbitMQ: %v\n", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Gagal membuka channel RabbitMQ: %v\n", err)
	}

	// Deklarasi Queue
	_, err = ch.QueueDeclare(
		queueName,
		true,  // durable (tahan restart)
		false, // auto-delete
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		log.Fatalf("Gagal deklarasi queue %s: %v\n", queueName, err)
	}

	fmt.Println("✅ Berhasil koneksi ke RabbitMQ & Queue siap")
	return conn, ch
}
