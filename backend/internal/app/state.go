package app

import (
	"github.com/minio/minio-go/v7"
	amqp "github.com/rabbitmq/amqp091-go"
	"nutritrack.com/backend/internal/config"
	"nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type State struct {
	Config   *config.Config
	Queries  *sqlc.Queries
	Minio    *minio.Client
	RabbitMQ *amqp.Channel
}
