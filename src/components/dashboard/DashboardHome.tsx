"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Workout } from "@/types/database.types";
import {
  Award,
  Sparkles,
  Plus,
  ArrowUpCircle,
  Flame,
  Activity,
  Heart,
  Bot,
  AlertCircle,
  CheckCircle,
  Dumbbell,
  Footprints,
} from "lucide-react";

interface DashboardHomeProps {
  onNavigate: (tab: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [heartRate, setHeartRate] = useState(128);

  const athleteName = user?.user_metadata?.full_name || (user?.email ? user.email.split("@")[0] : "Raihan Pratama");

  useEffect(() => {
    // Ambil sesi latihan terbaru jika user login
    if (user) {
      supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(2)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setRecentWorkouts(data as Workout[]);
          }
        });
    }

    // Interval simulasi detak jantung live
    const interval = setInterval(() => {
      setHeartRate(Math.floor(Math.random() * (136 - 124 + 1)) + 124);
    }, 4000);

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-slate-900 p-6 md:p-8 border border-indigo-500/30 glow-effect">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <Award className="w-3.5 h-3.5" /> Atlet High Jump Pro & Multi-Sport
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Selamat Datang Kembali, <span className="text-indigo-400">{athleteName}</span>!
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              AI Analytics mendeteksi peningkatan tinggi lompatan vertikal sebesar +4.2cm bulan ini.
              Pertahankan teknik take-off Anda!
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate("ai-jump")}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Analisis AI Jump
            </button>
            <button
              onClick={() => onNavigate("workout")}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-medium text-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Catat Sesi
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 bg-slate-900/70 border border-slate-800 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Vertical Jump</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              78.5 <span className="text-sm font-normal text-indigo-400">cm</span>
            </h3>
            <span className="inline-flex items-center text-xs text-emerald-400 mt-1 font-semibold">
              +2.1 cm minggu ini
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <ArrowUpCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-slate-900/70 border border-slate-800 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Kalori Terbakar</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              2,450 <span className="text-sm font-normal text-amber-400">kcal</span>
            </h3>
            <span className="inline-flex items-center text-xs text-amber-400 mt-1 font-semibold">
              Target: 2,600
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-slate-900/70 border border-slate-800 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Recovery Score</p>
            <h3 className="text-2xl font-bold text-white mt-1">92%</h3>
            <span className="inline-flex items-center text-xs text-emerald-400 mt-1 font-semibold">
              Optimal untuk Latihan
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-slate-900/70 border border-slate-800 backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Detak Jantung Rata-rata</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {heartRate} <span className="text-sm font-normal text-rose-400">BPM</span>
            </h3>
            <span className="inline-flex items-center text-xs text-rose-400 mt-1 font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block mr-1" /> Live Sync
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Coach Insights */}
          <div className="rounded-2xl p-6 bg-slate-900/70 border border-indigo-500/30 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Coach & High Jump Insights</h3>
                  <p className="text-xs text-slate-400">Analisis otomatis berbasis sesi latihan</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold">
                Real-time AI
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div className="text-sm text-slate-300">
                <strong className="text-white">Sudut Take-off:</strong> Sudut tumpuan kaki kiri Anda tercatat di{" "}
                <span className="text-amber-400 font-semibold">58°</span>. Untuk target lompatan 2.15m, optimalkan sudut
                ke kisaran <span className="text-emerald-400 font-semibold">63° - 65°</span>.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <div className="text-sm text-slate-300">
                <strong className="text-white">Kecepatan Awalan (Approach Speed):</strong> Kecepatan lari lengkung kurva
                sudah sangat baik (7.4 m/s). Pertahankan momentum saat transisi ke plant step.
              </div>
            </div>
          </div>

          {/* Riwayat Sesi Latihan Terbaru */}
          <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Riwayat Sesi Latihan Terbaru</h3>
              <button
                onClick={() => onNavigate("workout")}
                className="text-xs text-indigo-400 hover:underline font-semibold"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {recentWorkouts.length > 0 ? (
                recentWorkouts.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{w.workout_type}</h4>
                        <p className="text-xs text-slate-400">
                          {w.duration_minutes} Menit • {w.calories_burned} kcal
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      Tersimpan di Cloud
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">High Jump Technique & Plyometrics</h4>
                        <p className="text-xs text-slate-400">12 Set • 45 Menit • 420 kcal</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      Selesai
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Footprints className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Outdoor Sprint & Curve Run GPS</h4>
                        <p className="text-xs text-slate-400">5.2 km • 32 Menit • 380 kcal</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      Selesai
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Komposisi Tubuh */}
        <div className="space-y-6">
          <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold text-white">Komposisi Tubuh Atlet</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Berat Badan</span>
                  <span className="font-semibold text-white">71.2 kg (-0.8 kg)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "72%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Persentase Lemak Tubuh (% Body Fat)</span>
                  <span className="font-semibold text-white">10.4% (Ideal)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2">
                  <div className="bg-violet-500 h-2 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Massa Otot (Muscle Mass)</span>
                  <span className="font-semibold text-white">59.8 kg</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
