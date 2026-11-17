"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Flame, PlusCircle, Loader2 } from "lucide-react";

export function QuickWorkoutCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [workoutType, setWorkoutType] = useState("Lompat Tinggi & Plyometric");
  const [duration, setDuration] = useState("45");
  const [calories, setCalories] = useState("350");
  const [notes, setNotes] = useState("");

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedDuration = Number(duration);
    const parsedCalories = Number(calories);

    // Validasi data angka
    if (
      isNaN(parsedDuration) ||
      parsedDuration <= 0 ||
      isNaN(parsedCalories) ||
      parsedCalories < 0
    ) {
      toast.error("Durasi dan kalori harus berupa angka yang valid!");
      return;
    }

    setLoading(true);

    try {
      // 1. Ambil user yang sedang aktif
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Sesi login kedaluwarsa. Silakan masuk kembali.");
      }

      // 2. Masukkan data ke tabel workouts di Supabase
      const { error } = await supabase.from("workouts").insert([
        {
          user_id: user.id,
          workout_type: workoutType,
          duration_minutes: parsedDuration,
          calories_burned: parsedCalories,
          notes: notes.trim() || "Sesi latihan harian via Dashboard",
        },
      ]);

      if (error) throw error;

      // 3. Notifikasi Sukses dengan Sonner
      toast.success(
        "Sesi latihan berhasil dicatat! 🔥 Kalori dasbor diperbarui."
      );

      // 4. Reset form & refresh data server secara mulus
      setNotes("");
      router.refresh();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan yang tidak diketahui.";
      toast.error(`Gagal menyimpan latihan: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-950/50 border border-amber-800/50 rounded-xl text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Catat Sesi Latihan Cepat
            </h3>
            <p className="text-xs text-slate-400">
              Input langsung terakumulasi ke Total Kalori & Sesi Latihan
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 rounded-full font-medium">
          Supabase Connected
        </span>
      </div>

      <form onSubmit={handleQuickSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Jenis Latihan */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Jenis Sesi
            </label>
            <select
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="Lompat Tinggi & Plyometric">
                Lompat Tinggi & Plyometric
              </option>
              <option value="Strength Training">Strength Training (Gym)</option>
              <option value="Cardio & Approach Speed">
                Cardio & Approach Speed
              </option>
              <option value="Futsal / Basket">Futsal / Basket</option>
            </select>
          </div>

          {/* Durasi */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Durasi (Menit)
            </label>
            <input
              type="number"
              min="1"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Kalori Terbakar */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Kalori Terbakar (kcal)
            </label>
            <input
              type="number"
              min="0"
              required
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Catatan Singkat */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Catatan Performa (Opsional)
          </label>
          <input
            type="text"
            placeholder="Contoh: Konsistensi sudut take-off meningkat di lompatan terakhir."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Tombol Simpan Aksi Cepat */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-semibold py-3 px-4 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-950/50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Menyimpan ke Database...</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Simpan Sesi Latihan Sekarang</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default QuickWorkoutCard;
