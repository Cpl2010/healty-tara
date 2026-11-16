"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LeaderboardEntry } from "@/types/database.types";
import { toast } from "sonner";
import { Trophy, Medal, Award, Loader2, Sparkles, Flame, Shield, Heart } from "lucide-react";

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data Leaderboard langsung dari tabel Supabase
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("best_height_m", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Gagal memuat leaderboard:", error);
        toast.error(`Gagal memuat leaderboard: ${error.message}`);
      } else if (data && data.length > 0) {
        setLeaderboard(data as LeaderboardEntry[]);
      } else {
        // Fallback default mock jika tabel baru dibuat dan belum di-seed
        setLeaderboard([
          {
            id: "1",
            athlete_name: "Raihan Pratama",
            region: "DKI Jakarta",
            club: "Klub Atletik Nasional",
            best_height_m: 2.12,
            vertical_jump_cm: 81,
            rank: 1,
          },
          {
            id: "2",
            athlete_name: "Dimas Alamsyah",
            region: "Jawa Barat",
            club: "PPLP Jabar",
            best_height_m: 2.08,
            vertical_jump_cm: 79,
            rank: 2,
          },
          {
            id: "3",
            athlete_name: "Bima Sakti",
            region: "Jawa Timur",
            club: "PASI Jatim",
            best_height_m: 2.05,
            vertical_jump_cm: 77,
            rank: 3,
          },
        ]);
      }
    } catch (err: any) {
      console.error("Catch error [fetchLeaderboard]:", err);
      toast.error("Masalah jaringan memuat data leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // 2. Real-time Subscription untuk tabel leaderboard
    const channel = supabase
      .channel("realtime-leaderboard-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leaderboard",
        },
        (payload) => {
          console.log("[Supabase Realtime] Leaderboard berubah:", payload);
          toast.info("Papan peringkat diperbarui secara live!");
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Papan Peringkat Atlet (Supabase Real-Time)
          </h2>
          <p className="text-xs text-slate-400">
            Peringkat nasional high jump terupdate langsung dari cloud database.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Live Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Papan Peringkat */}
        <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Medal className="w-4 h-4 text-amber-400" /> Top Atlet Nasional High Jump
            </h3>
            {loading && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((athlete, index) => {
              const rank = index + 1;
              const isFirst = rank === 1;
              const isSecond = rank === 2;
              const isThird = rank === 3;

              return (
                <div
                  key={athlete.id || index}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isFirst
                      ? "bg-amber-500/10 border-amber-500/40 glow-effect"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <span
                      className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                        isFirst
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                          : isSecond
                          ? "bg-slate-300 text-slate-900"
                          : isThird
                          ? "bg-amber-700 text-amber-100"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {rank}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                        {athlete.athlete_name}
                        {isFirst && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {athlete.region} {athlete.club ? `• ${athlete.club}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-400">
                      {athlete.best_height_m} m
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Vertical {athlete.vertical_jump_cm} cm
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges & Pencapaian */}
        <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" /> Badges & Achievements
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 text-center space-y-1">
              <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Bar 2.0m Club</h4>
              <p className="text-[10px] text-slate-400">Clearance 2.0+ meter</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">30 Day Streak</h4>
              <p className="text-[10px] text-slate-400">Konsisten berlatih</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">AI Vision Pro</h4>
              <p className="text-[10px] text-slate-400">50x Analisis video</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-violet-500/30 text-center space-y-1">
              <div className="w-10 h-10 mx-auto rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">Hydration Pro</h4>
              <p className="text-[10px] text-slate-400">Target 2.5L tercapai</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
