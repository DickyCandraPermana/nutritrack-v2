package config

import "os"

type Config struct {
	Addr           string
	DBUrl          string
	MinioEndpoint  string
	MinioAccessKey string
	MinioSecretKey string
	MinioBucket    string
	RabbitMQUrl    string
	RabbitMQQueue  string
}

func Load() *Config {
	return &Config{
		Addr:           getEnv("ADDR", ":8080"),
		DBUrl:          getEnv("DB_URL", "postgres://thearinazs:MonsterBoom_124701@localhost:5434/nutritrack"),
		MinioEndpoint:  getEnv("MINIO_ENDPOINT", "localhost:9000"),
		MinioAccessKey: getEnv("MINIO_ACCESS_KEY", "minio-nutritrack"),
		MinioSecretKey: getEnv("MINIO_SECRET_KEY", "minionutritrackpassword"),
		MinioBucket:    getEnv("MINIO_BUCKET", "nutritrack-images"),
		RabbitMQUrl:    getEnv("RABBITMQ_URL", "amqp://admin:secretpassword@localhost:5672/"),
		RabbitMQQueue:  getEnv("RABBITMQ_QUEUE", "ocr_tasks"),
	}
}

func getEnv(key, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultVal
}
