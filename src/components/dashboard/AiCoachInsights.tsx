"use client";

import React from "react";
import { Bot, AlertCircle, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";

export const AiCoachInsights: React.FC = () => {
  return (
    <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800/80 backdrop-blur-md space-y-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              AI Coach & Biomechanics Insights
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Evaluasi otomatis berbasis rekaman video lompat tinggi sesi terakhir
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          Kinematika Aktif
        </span>
      </div>

      <div className="space-y-3">
        {/* Rekomendasi 1 */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs sm:text-sm text-slate-300">
            <strong className="text-white">Sudut Tumpuan (Take-off Angle):</strong> Sudut tumpuan
            kaki kiri Anda tercatat di <span className="text-amber-400 font-semibold">58.4°</span>.
            Untuk mencapai target mistar 2.15m, dorong lutut tumpu lebih cepat ke arah vertikal dan
            optimalkan sudut ke kisaran{" "}
            <span className="text-cyan-400 font-semibold">63° - 65°</span>.
          </div>
        </div>

        {/* Rekomendasi 2 */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
          <div className="text-xs sm:text-sm text-slate-300">
            <strong className="text-white">Kecepatan Kurva J (Approach Speed):</strong> Kecepatan
            awalan Anda stabil di <span className="text-emerald-400 font-semibold">7.4 m/s</span>.
            Gaya sentrifugal berhasil dipertahankan pada 3 langkah terakhir menuju mistar.
          </div>
        </div>

        {/* Rekomendasi 3 */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
          <div className="text-xs sm:text-sm text-slate-300">
            <strong className="text-white">Fosbury Flop Layback:</strong> Ekstensi punggung saat
            melewati mistar tercatat di <span className="text-cyan-400 font-semibold">142°</span>{" "}
            (Kategori Ideal). Pinggul bebas dari sentuhan mistar.
          </div>
        </div>
      </div>
    </div>
  );
};
