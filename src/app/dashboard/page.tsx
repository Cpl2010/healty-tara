"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { QuickWorkoutCard } from "@/components/dashboard/QuickWorkoutCard";
import { AiCoachInsights } from "@/components/dashboard/AiCoachInsights";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { WorkoutLogger } from "@/components/dashboard/WorkoutLogger";
import { ExportPdfButton } from "@/components/shared/ExportPdfButton";
import { Award, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const athleteName =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user?.email === "string"
        ? user.email.split("@")[0]
        : "Raihan Pratama";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 p-6 md:p-8 border border-slate-800 glow-effect">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-3 border border-cyan-500/20">
              <Award className="w-3.5 h-3.5" /> Dashboard Atlet High Jump Pro
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Selamat Datang Kembali,{" "}
              <span className="text-cyan-400">{athleteName}</span>!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              AI Analytics mendeteksi peningkatan tinggi lompatan vertikal
              sebesar +4.2cm bulan ini. Pertahankan konsistensi sudut take-off
              dan kecepatan awalan Anda!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/ai-vision"
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> AI Vision Studio
            </Link>
            <ExportPdfButton reportTitle="Laporan Analitik Atlet High Jump" />
          </div>
        </div>
      </div>

      {/* Grid Metrik Utama Tersinkronisasi Supabase */}
      <DashboardStats />

      {/* Quick Workout Logger Card */}
      <QuickWorkoutCard />

      {/* AI Insights & Progress Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AiCoachInsights />
          <ProgressChart />
        </div>

        {/* Detailed Workout Logger & GPS History */}
        <div className="lg:col-span-1 space-y-6">
          <WorkoutLogger />
        </div>
      </div>
    </div>
  );
}
