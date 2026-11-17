"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TrendingUp, Flame, Activity, Heart, ArrowUpRight } from "lucide-react";

export function DashboardStats() {
  const [loading, setLoading] = useState(true);
  const [peakJump, setPeakJump] = useState<number>(0);
  const [totalCalories, setTotalCalories] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !isMounted) return;

        // 1. Ambil data lompatan tertinggi (Peak Jump)
        const { data: jumpData, error: jumpError } = await supabase
          .from("jump_metrics")
          .select("vertical_leap_cm, created_at")
          .eq("user_id", user.id)
          .order("vertical_leap_cm", { ascending: false })
          .limit(1);

        if (!jumpError && jumpData && jumpData.length > 0 && isMounted) {
          const val = Number(jumpData[0].vertical_leap_cm);
          setPeakJump(isNaN(val) ? 0 : val);
        }

        // 2. Ambil total kalori terbakar dari tabel workouts
        const { data: workoutData, error: workoutError } = await supabase
          .from("workouts")
          .select("calories_burned")
          .eq("user_id", user.id);

        if (!workoutError && workoutData && isMounted) {
          const sumCalories = workoutData.reduce(
            (acc: number, curr: { calories_burned?: number | string | null }) =>
              acc + (Number(curr?.calories_burned) || 0),
            0
          );
          setTotalCalories(isNaN(sumCalories) ? 0 : sumCalories);
        }
      } catch (error) {
        console.error("Gagal memuat data dasbor:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {/* 1. Card: Vertical Jump Peak */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            Vertical Jump Peak
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-bold text-slate-100">
              {loading ? "..." : peakJump > 0 ? `${peakJump.toFixed(1)}` : "0.0"}
            </h3>
            <span className="text-sm font-semibold text-cyan-400">cm</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Data Tersinkronisasi
          </span>
          <div className="p-2.5 bg-cyan-950/50 border border-cyan-800/50 rounded-xl text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Card: Kalori Terbakar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            Total Kalori Terbakar
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-bold text-slate-100">
              {loading ? "..." : totalCalories.toLocaleString()}
            </h3>
            <span className="text-sm font-semibold text-amber-400">kcal</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">Akumulasi Sesi Latihan</span>
          <div className="p-2.5 bg-amber-950/50 border border-amber-800/50 rounded-xl text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Card: Recovery Score */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Recovery Score</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-bold text-slate-100">92%</h3>
          </div>
          <p className="text-xs text-emerald-400 mt-1">Optimal untuk Latihan</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">Status Fisik Stabil</span>
          <div className="p-2.5 bg-emerald-950/50 border border-emerald-800/50 rounded-xl text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. Card: Detak Jantung (Live) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            Detak Jantung (Live)
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-bold text-slate-100">118</h3>
            <span className="text-sm font-semibold text-rose-400">BPM</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs text-rose-400 font-medium">
              Sensor Terhubung
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">Zona Latihan Aerobik</span>
          <div className="p-2.5 bg-rose-950/50 border border-rose-800/50 rounded-xl text-rose-400">
            <Heart className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
