# Stage 1: Build the Go binary
FROM golang:alpine AS builder

WORKDIR /app

# ENV CGO_ENABLED=0 is recommended for static binaries
ENV CGO_ENABLED=0 GOOS=linux

# Copy module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the application
RUN go build -o bin/api cmd/api/main.go

# Stage 2: Create a minimal image
FROM alpine:latest

WORKDIR /app

# Install CA certificates for TLS
RUN apk --no-cache add ca-certificates tzdata

# Copy the binary from the builder stage
COPY --from=builder /app/bin/api /app/bin/api

# Expose the API port
EXPOSE 8080

# Command to run the application
CMD ["/app/bin/api"]
