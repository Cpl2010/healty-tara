"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpCircle, Flame, Activity, Heart } from "lucide-react";

export const MetricsGrid: React.FC = () => {
  const [heartRate, setHeartRate] = useState(128);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeartRate(Math.floor(Math.random() * (136 - 122 + 1)) + 122);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Vertical Jump */}
      <div className="rounded-2xl p-4 bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-slate-400 font-medium">Vertical Jump Peak</p>
          <h3 className="text-2xl font-black text-white mt-1">
            78.5 <span className="text-sm font-normal text-cyan-400">cm</span>
          </h3>
          <span className="inline-flex items-center text-[11px] text-emerald-400 mt-1 font-semibold">
            +2.1 cm minggu ini
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
          <ArrowUpCircle className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Kalori Terbakar */}
      <div className="rounded-2xl p-4 bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-slate-400 font-medium">Kalori Terbakar</p>
          <h3 className="text-2xl font-black text-white mt-1">
            2,450 <span className="text-sm font-normal text-amber-400">kcal</span>
          </h3>
          <span className="inline-flex items-center text-[11px] text-amber-400 mt-1 font-semibold">
            Target Harian: 2,600
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
          <Flame className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Recovery Score */}
      <div className="rounded-2xl p-4 bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-slate-400 font-medium">Recovery Score</p>
          <h3 className="text-2xl font-black text-white mt-1">92%</h3>
          <span className="inline-flex items-center text-[11px] text-emerald-400 mt-1 font-semibold">
            Optimal untuk Latihan
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
          <Activity className="w-6 h-6" />
        </div>
      </div>

      {/* 4. Live Heart Rate */}
      <div className="rounded-2xl p-4 bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-slate-400 font-medium">Detak Jantung (Live)</p>
          <h3 className="text-2xl font-black text-white mt-1">
            {heartRate} <span className="text-sm font-normal text-rose-400">BPM</span>
          </h3>
          <span className="inline-flex items-center text-[11px] text-rose-400 mt-1 font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block mr-1.5" />
            Sensor Aktif
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
          <Heart className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
