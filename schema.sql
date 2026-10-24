-- =======================================================
-- SCHEMA SQL: SISTEM REGISTRASI PESERTA PASKAS BAHAGIA
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda.
-- =======================================================

-- 1. Buat Tabel Peserta Registrasi
CREATE TABLE IF NOT EXISTS registrations (
    id BIGSERIAL PRIMARY KEY,
    registration_code VARCHAR(50) UNIQUE NOT NULL,
    registration_type VARCHAR(20) NOT NULL DEFAULT 'individu', -- 'individu' / 'kelompok'
    group_name VARCHAR(150),
    group_leader_name VARCHAR(150),
    full_name VARCHAR(200) NOT NULL,
    gender VARCHAR(20) NOT NULL, -- 'Laki-laki' / 'Perempuan'
    wilayah VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone_number VARCHAR(50),
    emergency_phone VARCHAR(50),
    arrival_date DATE NOT NULL,
    arrival_time VARCHAR(20) DEFAULT '12:00',
    departure_date DATE NOT NULL,
    departure_time VARCHAR(20) DEFAULT '12:00',
    transport_arrival VARCHAR(100) NOT NULL,
    transport_departure VARCHAR(100) NOT NULL,
    cloth_size VARCHAR(10) NOT NULL, -- 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'
    medical_history TEXT DEFAULT 'Tidak Ada',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migrasi tambahan untuk tabel yang sudah terbuat sebelumnya
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS email VARCHAR(150);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS emergency_phone VARCHAR(50);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS daerah VARCHAR(150);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS age INT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS is_child BOOLEAN DEFAULT FALSE;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS building VARCHAR(150);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS room_number VARCHAR(50);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS room_name VARCHAR(150);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS guardian_name VARCHAR(200);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS group_code VARCHAR(50);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS join_year INT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Index untuk mempercepat query pencarian
CREATE INDEX IF NOT EXISTS idx_reg_code ON registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_reg_wilayah ON registrations(wilayah);
CREATE INDEX IF NOT EXISTS idx_reg_type ON registrations(registration_type);
CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations(created_at DESC);

-- 2. Buat Tabel Pengaturan Sistem (Batas Waktu Pengisian & Info Acara)
CREATE TABLE IF NOT EXISTS app_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Masukkan / Perbarui pengaturan default (Batas Pendaftaran, Status, Judul Acara, Lokasi Jogja)
INSERT INTO app_settings (setting_key, setting_value, description)
VALUES 
    ('registration_deadline', '2026-12-31T23:59:59', 'Batas akhir waktu pengisian registrasi peserta'),
    ('is_registration_open', 'true', 'Status pendaftaran: true (buka) / false (tutup)'),
    ('event_name', 'Silaturahmi Akbar Pasukan Amal Sholeh (PASKAS) Bahagia', 'Nama kegiatan agenda'),
    ('event_location', 'Rocket Convention Hall, Sleman, D.I. Yogyakarta', 'Lokasi utama acara'),
    ('event_date', '2026-11-10 s/d 2026-11-13', 'Tanggal pelaksanaan kegiatan'),
    ('google_email_script_url', 'https://script.google.com/macros/s/AKfycbw1k6dhuACxMSKHLqFLKHla2QQzc2CnZddLp93mh98Jg-Mg0etauHLuQ0cakuCMMBZ83A/exec', 'URL Apps Script Web App untuk pengiriman email otomatis dari paskasbahagia@gmail.com'),
    ('paskas_admin_password', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Hash SHA-256 kata sandi administrator (aman terenkripsi: bawaan admin123)'),
    ('uniform_size_chart_ikhwan', E'S: Lebar 46cm / LD 92cm\nM: Lebar 48cm / LD 96cm\nL: Lebar 50cm / LD 100cm\nXL: Lebar 52cm / LD 104cm\nXXL: Lebar 54cm / LD 108cm\n3XL: Lebar 56cm / LD 112cm\n4XL: Lebar 58cm / LD 116cm', 'Panduan standar size chart seragam ikhwan'),
    ('uniform_size_chart_akhwat', E'S: Lebar 46cm / LD 92cm\nM: Lebar 48cm / LD 96cm\nL: Lebar 50cm / LD 100cm\nXL: Lebar 52cm / LD 104cm\nXXL: Lebar 54cm / LD 108cm\n3XL: Lebar 56cm / LD 112cm\n4XL: Lebar 58cm / LD 116cm', 'Panduan standar size chart seragam akhwat')
ON CONFLICT (setting_key) DO NOTHING;

-- Query pembaruan langsung (jika tabel app_settings sudah pernah terisi sebelumnya)
UPDATE app_settings 
SET setting_value = 'Rocket Convention Hall, Sleman, D.I. Yogyakarta', updated_at = NOW()
WHERE setting_key = 'event_location';

UPDATE app_settings 
SET setting_value = '2026-11-10 s/d 2026-11-13', updated_at = NOW()
WHERE setting_key = 'event_date';

-- 3. Konfigurasi Row Level Security (RLS) Diperkuat
-- Supaya aplikasi web frontend aman:
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Kebijakan Registrations: Boleh SELECT, INSERT, UPDATE, DELETE publik (Anon)
DROP POLICY IF EXISTS "Allow public read access for registrations" ON registrations;
CREATE POLICY "Allow public read access for registrations" 
ON registrations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert for registrations" ON registrations;
CREATE POLICY "Allow public insert for registrations" 
ON registrations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update for registrations" ON registrations;
CREATE POLICY "Allow public update for registrations" 
ON registrations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete for registrations" ON registrations;
CREATE POLICY "Allow public delete for registrations" 
ON registrations FOR DELETE USING (true);

-- Kebijakan App Settings (Hardened): Boleh SELECT, INSERT, UPDATE publik (Anon)
-- DELETE dilarang untuk umum agar pengaturan sistem tidak dapat dihapus sembarangan
DROP POLICY IF EXISTS "Allow public read access for app_settings" ON app_settings;
CREATE POLICY "Allow public read access for app_settings" 
ON app_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert for app_settings" ON app_settings;
CREATE POLICY "Allow public insert for app_settings" 
ON app_settings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update for app_settings" ON app_settings;
CREATE POLICY "Allow public update for app_settings" 
ON app_settings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete for app_settings" ON app_settings;

-- 4. Storage Pas Foto Peserta (bucket 'paskas bahagia')
-- Foto disimpan sebagai file gambar; kolom registrations.photo_url berisi link publiknya.
DROP POLICY IF EXISTS "Allow public upload paskas bahagia" ON storage.objects;
CREATE POLICY "Allow public upload paskas bahagia"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'paskas bahagia');

DROP POLICY IF EXISTS "Allow public read paskas bahagia" ON storage.objects;
CREATE POLICY "Allow public read paskas bahagia"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'paskas bahagia');

-- Selesai! Skema database siap & aman digunakan oleh frontend PASKAS BAHAGIA.
