"use client";

import React, { useState } from "react";
import { JumpPhaseType } from "@/types";
import { GitCompare, Sliders, Layers, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function ComparisonPage() {
  const [viewMode, setViewMode] = useState<"side-by-side" | "ghost-overlay">("ghost-overlay");
  const [syncPhase, setSyncPhase] = useState<JumpPhaseType>("clearance");
  const [ghostOpacity, setGhostOpacity] = useState(65);

  const phases: JumpPhaseType[] = ["approach", "plant", "takeoff", "clearance", "landing"];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Fitur 3: Komparasi Kinematika & Ghost Overlay
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Side-by-Side & Ghost Overlay Analysis
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Bandingkan percobaan atlet secara langsung dengan referensi teknik Juara Dunia (Gold
              Standard) atau lompatan terbaik pribadi (Personal Best).
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode("ghost-overlay")}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "ghost-overlay"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" /> Ghost Overlay
            </button>
            <button
              onClick={() => setViewMode("side-by-side")}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "side-by-side"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GitCompare className="w-4 h-4" /> Side-by-Side
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Phase Selector & Opacity */}
      <div className="rounded-2xl p-4 bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Phase buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs text-slate-400 font-semibold mr-1">Sinkronisasi Fase:</span>
          {phases.map((p) => (
            <button
              key={p}
              onClick={() => setSyncPhase(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                syncPhase === p
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Ghost Opacity Slider */}
        {viewMode === "ghost-overlay" && (
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-300 font-medium">Opasitas Ghost Pro:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={ghostOpacity}
              onChange={(e) => setGhostOpacity(Number(e.target.value))}
              className="w-28 accent-cyan-400 cursor-pointer"
            />
            <span className="text-xs text-cyan-400 font-bold w-9">{ghostOpacity}%</span>
          </div>
        )}
      </div>

      {/* Visualizer Area */}
      {viewMode === "ghost-overlay" ? (
        /* GHOST OVERLAY VIEWPORT */
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" /> Percobaan Anda (Raihan Pratama - 2.08m)
              </span>
              <span className="flex items-center gap-1.5 text-pink-400 font-bold">
                <span className="w-3 h-3 rounded-full bg-pink-400 inline-block" /> Benchmark Juara Dunia (Gold Standard - 2.15m)
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">Fase: {syncPhase.toUpperCase()}</span>
          </div>

          <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Mistar */}
            <div className="absolute top-[35%] left-0 right-0 h-1 bg-rose-500/80 z-10 flex items-center justify-center">
              <span className="bg-slate-950 text-rose-400 text-[10px] px-2.5 py-0.5 rounded-full border border-rose-500/50 font-bold">
                MISTAR TARGET: 2.15 METER
              </span>
            </div>

            {/* SVG OVERLAY: SKELETON A (Cyan) + SKELETON B (Pink Ghost) */}
            <svg className="absolute inset-0 w-full h-full z-20" viewBox="0 0 500 350">
              {/* SKELETON B (GHOST PRO BENCHMARK - PINK) */}
              <g style={{ opacity: ghostOpacity / 100 }} className="transition-opacity duration-200">
                {/* Lengkungan Pro Fosbury Flop yang lebih sempurna dan tinggi */}
                <circle cx="325" cy="115" r="11" fill="#ec4899" />
                <path d="M 170 145 Q 250 55 325 115" fill="none" stroke="#ec4899" strokeWidth="5" strokeDasharray="6 3" />
                <line x1="170" y1="145" x2="135" y2="115" stroke="#f472b6" strokeWidth="4" />
                <line x1="135" y1="115" x2="115" y2="75" stroke="#f472b6" strokeWidth="4" />
                <text x="230" y="50" fill="#ec4899" fontSize="11" fontWeight="bold">
                  Pro Arch (155°)
                </text>
              </g>

              {/* SKELETON A (PERCOBAAN ANDA - CYAN SOLID) */}
              <g>
                <circle cx="310" cy="135" r="11" fill="#06b6d4" />
                <path d="M 180 160 Q 250 85 310 135" fill="none" stroke="#06b6d4" strokeWidth="5" />
                <line x1="180" y1="160" x2="145" y2="135" stroke="#10b981" strokeWidth="4" />
                <line x1="145" y1="135" x2="130" y2="100" stroke="#10b981" strokeWidth="4" />
                <text x="210" y="90" fill="#06b6d4" fontSize="11" fontWeight="bold">
                  Anda (142°)
                </text>
              </g>
            </svg>

            {/* Matras */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                Matras Pendaratan Atletik
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* SIDE-BY-SIDE VIEWPORT */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400">Percobaan Anda (2.08m)</span>
              <span className="text-slate-400">Sudut: 58.4° • Kecepatan: 7.4 m/s</span>
            </div>
            <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center relative">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <circle cx="260" cy="115" r="10" fill="#06b6d4" />
                <path d="M 140 140 Q 200 70 260 115" fill="none" stroke="#06b6d4" strokeWidth="4" />
                <line x1="140" y1="140" x2="110" y2="115" stroke="#10b981" strokeWidth="4" />
              </svg>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-pink-400">Benchmark Juara Dunia (2.15m)</span>
              <span className="text-slate-400">Sudut: 64.2° • Kecepatan: 7.9 m/s</span>
            </div>
            <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center relative">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <circle cx="270" cy="95" r="10" fill="#ec4899" />
                <path d="M 130 120 Q 200 45 270 95" fill="none" stroke="#ec4899" strokeWidth="4" />
                <line x1="130" y1="120" x2="100" y2="95" stroke="#f472b6" strokeWidth="4" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Delta Kinematics Table Comparison */}
      <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-cyan-400" />
          Tabel Komparasi Selisih Kinematika (Δ Delta Parameters)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Parameter Kinematika</th>
                <th className="p-3 text-cyan-400">Percobaan Anda</th>
                <th className="p-3 text-pink-400">Benchmark Pro</th>
                <th className="p-3 text-right">Selisih (Delta)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="p-3 font-medium text-white">Sudut Tumpuan Take-off (θ)</td>
                <td className="p-3">58.4°</td>
                <td className="p-3">64.0°</td>
                <td className="p-3 text-right font-bold text-amber-400">-5.6° (Perlu ditingkatkan)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Kecepatan Awalan (Approach Speed)</td>
                <td className="p-3">7.4 m/s</td>
                <td className="p-3">7.9 m/s</td>
                <td className="p-3 text-right font-bold text-slate-300">-0.5 m/s</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Kelengkungan Layback Arch</td>
                <td className="p-3">142°</td>
                <td className="p-3">155°</td>
                <td className="p-3 text-right font-bold text-emerald-400">13° (Clearance Efektif)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Tinggi Maksimal Pinggul di Atas Bar</td>
                <td className="p-3">4.2 cm</td>
                <td className="p-3">7.8 cm</td>
                <td className="p-3 text-right font-bold text-cyan-400">-3.6 cm margin</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
