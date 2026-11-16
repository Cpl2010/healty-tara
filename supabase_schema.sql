-- ==============================================================================
-- SKEMA DATABASE SUPABASE: AI HighJump & Sports Pro Dashboard
-- Untuk Ujian Akhir Semester (UAS)
-- Stack: Next.js + TypeScript + Supabase Auth & PostgreSQL Database
-- ==============================================================================

-- 1. TABEL PROFIL PENGGUNA (PROFILES)
-- Terhubung otomatis dengan auth.users milik Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    athlete_category TEXT DEFAULT 'High Jump Pro',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABEL SESI LATIHAN (WORKOUTS)
-- Menyimpan catatan sesi latihan dengan user_id
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_type TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    calories_burned INTEGER NOT NULL,
    notes TEXT DEFAULT '-',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABEL JURNAL NUTRISI (NUTRITION_LOGS)
-- Menyimpan makanan & makronutrien atlet per user
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_time TEXT NOT NULL,
    food_name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein_g INTEGER NOT NULL,
    carbs_g INTEGER NOT NULL,
    fat_g INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABEL PAPAN PERINGKAT ATLET (LEADERBOARD)
-- Terbuka untuk dibaca publik atlet, update dengan realtime
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    athlete_name TEXT NOT NULL,
    region TEXT NOT NULL,
    club TEXT,
    best_height_m NUMERIC(4, 2) NOT NULL,
    vertical_jump_cm NUMERIC(4, 1) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABEL METRIK & PEMINDAIAN LOMPATAN (JUMP_METRICS)
CREATE TABLE IF NOT EXISTS public.jump_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vertical_leap_cm NUMERIC(4, 1) NOT NULL,
    takeoff_angle_deg NUMERIC(4, 1) NOT NULL,
    approach_speed_ms NUMERIC(4, 1) NOT NULL,
    ai_recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- KEAMANAN: ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jump_metrics ENABLE ROW LEVEL SECURITY;

-- Policy Profiles: Pengguna hanya dapat membaca dan mengubah profil miliknya sendiri
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy Workouts: Pengguna hanya dapat mengelola data latihan miliknya
CREATE POLICY "Users can view own workouts"
    ON public.workouts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
    ON public.workouts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
    ON public.workouts FOR DELETE
    USING (auth.uid() = user_id);

-- Policy Nutrition Logs: Pengguna hanya dapat mengelola jurnal makanannya
CREATE POLICY "Users can view own nutrition logs"
    ON public.nutrition_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition logs"
    ON public.nutrition_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition logs"
    ON public.nutrition_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Policy Leaderboard: Dapat dilihat oleh semua pengunjung (publik)
CREATE POLICY "Anyone can view leaderboard"
    ON public.leaderboard FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert/update leaderboard"
    ON public.leaderboard FOR ALL
    USING (auth.role() = 'authenticated');

-- Policy Jump Metrics: Pengguna dapat membaca & menyimpan metrik miliknya
CREATE POLICY "Users can view own jump metrics"
    ON public.jump_metrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jump metrics"
    ON public.jump_metrics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- REALTIME PUBLICATION
-- Mengaktifkan fitur Real-Time pada tabel Supabase
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.workouts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.nutrition_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jump_metrics;

-- ==============================================================================
-- SEED DATA AWAL (Contoh Data untuk Demo UAS)
-- ==============================================================================
INSERT INTO public.leaderboard (athlete_name, region, club, best_height_m, vertical_jump_cm)
VALUES 
    ('Raihan Pratama', 'DKI Jakarta', 'Klub Atletik Nasional', 2.12, 81.0),
    ('Dimas Alamsyah', 'Jawa Barat', 'PPLP Jawa Barat', 2.08, 79.5),
    ('Bima Sakti', 'Jawa Timur', 'PASI Jawa Timur', 2.05, 77.0),
    ('Alif Firmansyah', 'DI Yogyakarta', 'Klub Cendrawasih', 2.01, 75.2)
ON CONFLICT DO NOTHING;
