"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Sparkles, Scan, Loader2, Video, BarChart3, CheckCircle2 } from "lucide-react";

export const AiJumpVision: React.FC = () => {
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<{
    leap: string;
    angle: string;
    speed: string;
    recommendation: string;
  } | null>(null);

  const runScan = async () => {
    setScanning(true);
    setResults(null);
    toast.info("Memulai simulasi AI Computer Vision scan...");

    setTimeout(async () => {
      const leapVal = (78 + Math.random() * 5).toFixed(1);
      const angleVal = (62 + Math.random() * 4).toFixed(1);
      const speedVal = (7.2 + Math.random() * 0.8).toFixed(1);
      const reco = `Analisis AI Selesai: Sudut take-off ${angleVal}° sudah berada di zona optimal lompatan elit. Pertahankan kecepatan awalan ${speedVal} m/s pada tikungan kurva terakhir.`;

      const newResults = {
        leap: leapVal,
        angle: angleVal,
        speed: speedVal,
        recommendation: reco,
      };

      setResults(newResults);
      setScanning(false);
      toast.success("AI Scan selesai! Hasil biomekanika berhasil dihitung.");

      // Simpan ke Supabase jika user aktif
      if (user) {
        try {
          await supabase.from("jump_metrics").insert([
            {
              user_id: user.id,
              vertical_leap_cm: parseFloat(leapVal),
              takeoff_angle_deg: parseFloat(angleVal),
              approach_speed_ms: parseFloat(speedVal),
              ai_recommendation: reco,
              created_at: new Date().toISOString(),
            },
          ]);
          toast.success("Hasil pemindaian tersimpan ke cloud Supabase!");
        } catch (err) {
          console.error("Gagal menyimpan hasil scan ke Supabase:", err);
        }
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl bg-gradient-to-r from-violet-900/70 via-indigo-900/60 to-slate-900 p-6 md:p-8 border border-violet-500/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Modul Eksklusif AI Vision Analytics
            </div>
            <h2 className="text-2xl font-bold text-white">AI Jump Vision & Biomechanics Analyzer</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Simulasi pemindaian video lompat tinggi menggunakan Computer Vision untuk menghitung tinggi
              vertical leap, sudut take-off, dan kecepatan awalan.
            </p>
          </div>
          <button
            onClick={runScan}
            disabled={scanning}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50"
          >
            {scanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menganalisis Video...
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" /> Jalankan AI Video Scan
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frame Box */}
        <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-indigo-400" /> Tangkapan Frame Lompat Tinggi
          </h3>
          <div className="relative w-full h-72 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />

            <div className="absolute top-1/2 left-0 right-0 h-1 bg-rose-500/80 z-10 flex items-center justify-center">
              <span className="bg-slate-950 text-rose-400 text-[10px] px-2 py-0.5 rounded border border-rose-500/50 font-bold">
                BAR 2.10M
              </span>
            </div>

            <svg className="absolute inset-0 w-full h-full z-20" viewBox="0 0 400 300">
              <circle cx="200" cy="110" r="10" fill="#6366f1" />
              <line x1="200" y1="120" x2="190" y2="160" stroke="#10b981" strokeWidth="4" />
              <line x1="190" y1="160" x2="170" y2="210" stroke="#10b981" strokeWidth="4" />
              <line x1="190" y1="160" x2="220" y2="180" stroke="#10b981" strokeWidth="4" />
              <path d="M 120 250 Q 200 150 280 250" fill="none" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth="2" />
            </svg>

            {scanning && (
              <div className="absolute inset-0 bg-slate-950/80 z-30 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
                <Scan className="w-12 h-12 text-amber-400 animate-spin mb-3" />
                <h4 className="text-lg font-bold text-white">Menganalisis Rangka & Biomekanika...</h4>
                <p className="text-xs text-slate-400 mt-1">Memproses frame video Fosbury Flop...</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Box */}
        <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" /> Hasil Analisis Biomekanika
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Tinggi Vertikal (Vertical Leap)</p>
                <h4 className="text-lg font-bold text-white">
                  {results ? `${results.leap} cm` : "-- cm"}
                </h4>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  results ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                }`}
              >
                {results ? "Sangat Baik" : "Menunggu"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Sudut Tumpuan (Take-off Angle)</p>
                <h4 className="text-lg font-bold text-white">
                  {results ? `${results.angle}°` : "-- °"}
                </h4>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  results ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                }`}
              >
                {results ? "Optimal" : "Menunggu"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Kecepatan Awalan (Approach Speed)</p>
                <h4 className="text-lg font-bold text-white">
                  {results ? `${results.speed} m/s` : "-- m/s"}
                </h4>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  results ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-800 text-slate-400"
                }`}
              >
                {results ? "Stabil" : "Menunggu"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/30">
              <p className="text-xs font-semibold text-violet-300 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Rekomendasi Perbaikan AI:
              </p>
              <p className="text-xs text-slate-300">
                {results
                  ? results.recommendation
                  : "Silakan jalankan pemindaian untuk mendapatkan masukan pelatih AI secara spesifik mengenai teknik Fosbury Flop Anda."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
