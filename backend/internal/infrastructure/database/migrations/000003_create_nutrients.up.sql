CREATE TABLE IF NOT EXISTS nutrients (
    id bigserial PRIMARY KEY,
    name varchar(50) NOT NULL UNIQUE,
    unit varchar(10) NOT NULL
);