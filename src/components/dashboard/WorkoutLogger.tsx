"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Workout } from "@/types";
import { toast } from "sonner";
import { Dumbbell, Plus, Trash2, Loader2, Play, Square, MapPin } from "lucide-react";

interface WorkoutLoggerProps {
  onOpenAuth?: () => void;
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Form states
  const [workoutType, setWorkoutType] = useState("High Jump Technique");
  const [duration, setDuration] = useState("45");
  const [calories, setCalories] = useState("380");
  const [notes, setNotes] = useState("");

  // GPS Simulation state
  const [isGpsRunning, setIsGpsRunning] = useState(false);
  const [gpsDistance, setGpsDistance] = useState(4.8);

  // 1. Fetch data latihan dari Supabase untuk user aktif
  const fetchWorkouts = async () => {
    if (!user) {
      setWorkouts([]);
      return;
    }

    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error [fetchWorkouts]:", error);
        toast.error(`Gagal memuat sesi latihan: ${error.message}`);
      } else if (data) {
        setWorkouts(data as Workout[]);
      }
    } catch (err: any) {
      console.error("Catch Error [fetchWorkouts]:", err);
      toast.error("Terjadi masalah jaringan saat mengambil data latihan.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();

    // Setup Realtime subscription untuk tabel workouts milik user
    if (user) {
      const channel = supabase
        .channel(`realtime-workouts-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "workouts",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchWorkouts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  // 2. Simpan sesi latihan baru ke Supabase
  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.info("Silakan login terlebih dahulu untuk menyimpan data ke database cloud Supabase.");
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setLoading(true);
    try {
      const newWorkoutPayload = {
        user_id: user.id, // Menyertakan user_id dari sesi login aktif
        workout_type: workoutType,
        duration_minutes: parseInt(duration, 10) || 0,
        calories_burned: parseInt(calories, 10) || 0,
        notes: notes.trim() || "-",
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("workouts")
        .insert([newWorkoutPayload])
        .select();

      if (error) {
        throw error;
      }

      toast.success("Sesi latihan berhasil disimpan ke database Supabase!");
      setNotes("");
      if (data && data.length > 0) {
        setWorkouts((prev) => [data[0] as Workout, ...prev]);
      }
    } catch (err: any) {
      console.error("Gagal menyimpan workout:", err);
      toast.error(`Gagal menyimpan sesi: ${err.message || "Kesalahan database"}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Hapus sesi latihan dari Supabase
  const handleDeleteWorkout = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      toast.info("Sesi latihan telah dihapus dari cloud.");
    } catch (err: any) {
      console.error("Gagal menghapus workout:", err);
      toast.error(`Gagal menghapus: ${err.message}`);
    }
  };

  // GPS Simulation Toggle
  const toggleGps = () => {
    setIsGpsRunning((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Pelacakan GPS dimulai.");
      } else {
        toast.info("Pelacakan GPS dihentikan & disimpan.");
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-indigo-400" /> Pelacakan Aktivitas & Latihan (Supabase Connected)
          </h2>
          <p className="text-xs text-slate-400">
            {user
              ? `Terhubung dengan akun: ${user.email} (Data tersimpan di tabel workouts)`
              : "Mode Tamu. Masuk untuk menyimpan data latihan ke cloud database."}
          </p>
        </div>

        {!user && (
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            Masuk untuk Simpan Data
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logger Form */}
        <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" /> Sesi Cepat Logger
          </h3>
          <form onSubmit={handleWorkoutSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Jenis Olahraga / Aktivitas
              </label>
              <select
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="High Jump Technique">High Jump (Lompat Tinggi)</option>
                <option value="Plyometrics & Bounds">Plyometrics & Bounds</option>
                <option value="Strength & Weightlifting">Strength & Weightlifting</option>
                <option value="Outdoor Sprint / Track">Outdoor Sprint / Track</option>
                <option value="Core & Flexibility">Core & Flexibility</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Estimasi Kalori
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Catatan Set / Repetisi / Beban
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Bar 2.05m berhasil, Clean & Jerk 80kg"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan ke Supabase...
                </>
              ) : (
                "Simpan Latihan"
              )}
            </button>
          </form>
        </div>

        {/* GPS Tracker Simulator */}
        <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" /> Simulasi Rute GPS & Outdoor Tracker
            </h3>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                isGpsRunning
                  ? "bg-emerald-500/20 text-emerald-400 animate-pulse"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {isGpsRunning ? "GPS Active: Merekam Rute" : "GPS: Siaga"}
            </span>
          </div>

          <div className="relative w-full h-56 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
            <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 400 200">
              <path
                d="M 50 100 C 50 40, 350 40, 350 100 C 350 160, 50 160, 50 100"
                fill="none"
                stroke="#334155"
                strokeWidth="8"
                strokeDasharray="4 4"
              />
              <path
                d="M 50 100 C 50 40, 350 40, 350 100 C 350 160, 50 160, 50 100"
                fill="none"
                stroke="#6366f1"
                strokeWidth="4"
              />
              <circle cx="200" cy="40" r="6" fill="#10b981" className={isGpsRunning ? "animate-ping" : ""} />
              <circle cx="200" cy="40" r="5" fill="#10b981" />
            </svg>

            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs flex gap-4">
              <div>Jarak: <strong className="text-white">{gpsDistance} km</strong></div>
              <div>Kecepatan Avg: <strong className="text-white">12.4 km/h</strong></div>
              <div>Pace: <strong className="text-white">4&apos;50&quot; /km</strong></div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={toggleGps}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all text-white ${
                isGpsRunning ? "bg-rose-600 hover:bg-rose-500" : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              {isGpsRunning ? (
                <>
                  <Square className="w-4 h-4" /> Berhentikan GPS
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Mulai Lacak GPS
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsGpsRunning(false);
                setGpsDistance(0);
                toast.info("Status GPS direset.");
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Sesi Tersimpan di Supabase */}
      <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white">
            Daftar Sesi Latihan Tersimpan (Supabase Real-Time)
          </h3>
          {fetching && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3 rounded-l-lg">Jenis Olahraga</th>
                <th className="p-3">Durasi</th>
                <th className="p-3">Kalori</th>
                <th className="p-3">Catatan Detail</th>
                <th className="p-3 rounded-r-lg text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {workouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-xs text-slate-500">
                    {user
                      ? "Belum ada sesi latihan tersimpan di database. Silakan catat sesi di atas!"
                      : "Login untuk melihat dan menyimpan riwayat latihan Anda di database cloud."}
                  </td>
                </tr>
              ) : (
                workouts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-indigo-400" />
                      {item.workout_type}
                    </td>
                    <td className="p-3">{item.duration_minutes} Menit</td>
                    <td className="p-3 text-amber-400">{item.calories_burned} kcal</td>
                    <td className="p-3 text-slate-400 text-xs">{item.notes || "-"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteWorkout(item.id)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Hapus sesi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
