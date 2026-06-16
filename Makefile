MIGRATIONS_PATH = ./internal/infrastructure/database/migrations
MIGRATE_ADDR = 

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