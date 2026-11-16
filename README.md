# AI HighJump & Sports Pro Dashboard (Next.js + TypeScript + Supabase)

Proyek ini dibangun untuk memenuhi persyaratan **Ujian Akhir Semester (UAS)** dengan memanfaatkan teknologi modern:
- **Framework**: Next.js 14+ (App Router) & React 18
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS & Shadcn UI design patterns
- **Backend as a Service (BaaS)**: Supabase (Auth & PostgreSQL Database)
- **Deployment**: Vercel

---

## 🚀 Fitur Utama & Kepatuhan Rubrik UAS

1. **Konfigurasi Supabase Client** (`src/lib/supabase.ts`):
   - Menggunakan environment variables `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari `.env.local`.
   - Strongly-typed dengan model database (`src/types/database.types.ts`).

2. **Sistem Autentikasi (Supabase Auth)** (`src/components/auth/AuthModal.tsx` & `src/context/AuthContext.tsx`):
   - Formulir Login & Register dengan validasi lengkap.
   - Menggunakan `supabase.auth.signInWithPassword` dan `supabase.auth.signUp`.
   - Menyimpan dan memantau status sesi aktif secara otomatis (`onAuthStateChange`).
   - Fitur Logout yang membersihkan sesi.

3. **Integrasi Database Cloud (CRUD)**:
   - **Workout Logger** (`src/components/dashboard/WorkoutLogger.tsx`): Menyimpan dan menghapus data sesi latihan yang otomatis menyertakan `user_id` pengguna yang login.
   - **Nutrition Tracker** (`src/components/dashboard/NutritionTracker.tsx`): Menyimpan data makanan dan kalkulasi makronutrien TDEE dengan `user_id`.
   - **Real-time Leaderboard** (`src/components/dashboard/Leaderboard.tsx`): Mengambil data papan peringkat dari tabel `leaderboard` secara live/real-time menggunakan Supabase Realtime channel.
   - **Progress Chart** (`src/components/dashboard/ProgressChart.tsx`): Grafik progres performa dinamis yang tersinkronisasi secara real-time.

4. **Keamanan & Penanganan Error**:
   - Blok `try-catch` terstruktur di setiap interaksi API & Database.
   - Notifikasi Toast informatif (`sonner`) untuk status berhasil, gagal, maupun peringatan.
   - Skema keamanan database Row Level Security (RLS) di `supabase_schema.sql`.

---

## 🛠️ Langkah Menjalankan Proyek

### 1. Eksekusi Skema Database di Supabase
1. Buka dashboard Supabase Anda di [supabase.com](https://supabase.com).
2. Masuk ke menu **SQL Editor**.
3. Buka file [`supabase_schema.sql`](./supabase_schema.sql), salin seluruh kodenya, lalu tempel dan klik **Run**.
4. Semua tabel (`profiles`, `workouts`, `nutrition_logs`, `leaderboard`, `jump_metrics`), RLS policies, dan Realtime publication akan otomatis terbuat.

### 2. Jalankan Secara Lokal
```bash
# Install dependencies
npm install

# Jalankan server development
npm run dev
```
Buka browser di `http://localhost:3000`.

### 3. Deploy ke Vercel
1. Hubungkan repository GitHub ini ke Vercel di [vercel.com/new](https://vercel.com/new).
2. Tambahkan **Environment Variables** di pengaturan Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon / Publishable key project Supabase Anda
3. Klik **Deploy**!
