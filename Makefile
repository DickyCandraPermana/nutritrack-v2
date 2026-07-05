MIGRATIONS_PATH = ./internal/infrastructure/database/migrations
MIGRATE_ADDR = 

# ==============================================================================
# Setup
# ==============================================================================

.PHONY: setup
setup: frontend-install worker-install backend-tidy
	@echo "Setup complete! All dependencies have been installed."

# ==============================================================================
# Database / Infrastructure (Docker Compose)
# ==============================================================================

.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down

.PHONY: logs
logs:
	docker-compose logs -f

# ==============================================================================
# Local Development (All Services)
# ==============================================================================

.PHONY: dev
dev:
	@$(MAKE) -j3 backend-dev frontend-dev worker-dev

# ==============================================================================
# Backend (Go)
# ==============================================================================

.PHONY: backend-dev
backend-dev:
	@cd backend; \
	air

.PHONY: backend-build
backend-build:
	@cd backend; \
	go build -o bin/api cmd/api/main.go

.PHONY: backend-tidy
backend-tidy:
	@cd backend; \
	go mod tidy

.PHONY: sqlc-generate
sqlc-generate:
	@cd backend; \
	sqlc generate

.PHONY: migrate-create
migration:
	@cd backend; \
	migrate create -seq -ext sql -dir $(MIGRATIONS_PATH) $(filter-out $@, $(MAKECMDGOALS))

.PHONY: migrate-up
migrate-up:
	@cd backend; \
	migrate -path=$(MIGRATIONS_PATH) -database=$(DB_MIGRATOR_ADDR) up

.PHONY: migrate-down
migrate-down:
	@cd backend; \
	migrate -path=$(MIGRATIONS_PATH) -database=$(DB_MIGRATOR_ADDR) down $(filter-out $@, $(MAKECMDGOALS))

.PHONY: migrate-force
migrate-force:
	@cd backend; \
	migrate -path=$(MIGRATIONS_PATH) -database=$(DB_MIGRATOR_ADDR) force $(filter-out $@, $(MAKECMDGOALS))

# ==============================================================================
# Frontend (React/Vite)
# ==============================================================================

.PHONY: frontend-install
frontend-install:
	@cd frontend; \
	pnpm install

.PHONY: frontend-dev
frontend-dev:
	@cd frontend; \
	pnpm dev

.PHONY: frontend-build
frontend-build:
	@cd frontend; \
	pnpm build

# ==============================================================================
# Worker AI (Python/Celery)
# ==============================================================================

.PHONY: worker-install
worker-install:
	@cd worker-ai; \
	venv\Scripts\pip install -r requirements.txt

.PHONY: worker-dev
worker-dev:
	@cd worker-ai; \
	venv\Scripts\celery -A app.core.celery_app worker --loglevel=info --pool=solo