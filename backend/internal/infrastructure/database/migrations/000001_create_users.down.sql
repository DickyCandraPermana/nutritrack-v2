-- 1. Hapus Trigger dari tabel users terlebih dahulu
DROP TRIGGER IF EXISTS set_timestamp_users ON users;

-- 2. Hapus Tabel (otomatis menghapus semua INDEX yang menempel pada tabel ini)
DROP TABLE IF EXISTS users;

-- 3. Hapus Trigger Function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 4. Hapus Tipe Data ENUM
DROP TYPE IF EXISTS user_role;

-- 5. Hapus Ekstensi (Opsional)
DROP EXTENSION IF EXISTS citext;
DROP EXTENSION IF EXISTS pgcrypto;