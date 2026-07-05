CREATE TABLE IF NOT EXISTS nutrients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(50) NOT NULL UNIQUE,
    unit varchar(10) NOT NULL
);
