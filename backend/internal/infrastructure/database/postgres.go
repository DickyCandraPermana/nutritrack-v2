package infrastructure

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPostgresPool(connString string) *pgxpool.Pool {
	poolConfig, err := pgxpool.ParseConfig(connString)
	if err != nil {
		log.Fatalf("Gagal parsing config DB: %v\n", err)
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), poolConfig)
	if err != nil {
		log.Fatalf("Gagal koneksi ke DB: %v\n", err)
	}

	fmt.Print("Berhasil koneksi ke PostgreSQL")
	return pool
}
