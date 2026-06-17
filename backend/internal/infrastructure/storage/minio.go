package infrastructure

import (
	"context"
	"fmt"
	"log"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func NewMinioClient(endpoint, accessKey, secretKey, bucketName string) *minio.Client {
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: false,
	})
	if err != nil {
		log.Fatalf("Gagal inisialisasi MinIO: %v\n", err)
	}

	ctx := context.Background()
	exists, err := minioClient.BucketExists(ctx, bucketName)
	if err != nil {
		log.Fatalf("Error cek bucket: %v\n", err)
	}
	if !exists {
		err = minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			log.Fatalf("Gagal membuat bucket %s: %v\n", bucketName, err)
		}
		fmt.Printf("📦 Bucket '%s' berhasil dibuat\n", bucketName)
	}

	fmt.Println("✅ Berhasil koneksi ke MinIO")
	return minioClient
}
