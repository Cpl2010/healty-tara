"use client";

import React, { useState, useEffect } from "react";
import { JumpPhaseType } from "@/types";
import { calculateAngle } from "@/lib/ai/kinematics";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react";

interface PoseVisualizerProps {
  currentPhase?: JumpPhaseType;
  onPhaseChange?: (phase: JumpPhaseType) => void;
  interactive?: boolean;
}

export const PoseVisualizer: React.FC<PoseVisualizerProps> = ({
  currentPhase = "clearance",
  onPhaseChange,
  interactive = true,
}) => {
  const [phase, setPhase] = useState<JumpPhaseType>(currentPhase);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frameIndex, setFrameIndex] = useState(3); // 0..4

  const phases: JumpPhaseType[] = [
    "approach",
    "plant",
    "takeoff",
    "clearance",
    "landing",
  ];

  const phaseLabels: Record<JumpPhaseType, string> = {
    approach: "1. Awalan (J-Curve Approach)",
    plant: "2. Tumpuan Kaki (Plant Step)",
    takeoff: "3. Dorongan Vertikal (Take-off)",
    clearance: "4. Melengkung Mistar (Fosbury Flop Arch)",
    landing: "5. Pendaratan (Mat Landing)",
  };

  useEffect(() => {
    setPhase(currentPhase);
    setFrameIndex(phases.indexOf(currentPhase));
  }, [currentPhase]);

  // Animasi otomatis jika isPlaying
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setFrameIndex((prev) => {
        const next = (prev + 1) % phases.length;
        const nextPhase = phases[next];
        setPhase(nextPhase);
        if (onPhaseChange) onPhaseChange(nextPhase);
        return next;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [isPlaying, onPhaseChange]);

  const selectPhase = (p: JumpPhaseType) => {
    setPhase(p);
    setFrameIndex(phases.indexOf(p));
    if (onPhaseChange) onPhaseChange(p);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            MediaPipe Pose Estimation Canvas
          </h4>
          <p className="text-xs text-slate-400">
            Deteksi 33 Landmark Kinematika Rangka Atlet High Jump
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          Fase: {phaseLabels[phase].split("(")[0]}
        </span>
      </div>

      {/* Canvas Viewport SVG */}
      <div className="relative w-full h-72 sm:h-80 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* High Jump Mistar (Bar) */}
        <div className="absolute top-[38%] left-0 right-0 h-1 bg-rose-500/80 z-10 flex items-center justify-center">
          <span className="bg-slate-950 text-rose-400 text-[10px] px-2.5 py-0.5 rounded-full border border-rose-500/50 font-bold tracking-wider">
            MISTAR 2.10 METER
          </span>
        </div>

        {/* Matras High Jump */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            Matras Pendaratan Atletik
          </span>
        </div>

        {/* Dynamic Skeleton Pose Visualization based on Phase */}
        <svg
          className="absolute inset-0 w-full h-full z-20"
          viewBox="0 0 500 350"
        >
          {phase === "approach" && (
            <g className="transition-all duration-300">
              {/* Kepala */}
              <circle cx="120" cy="140" r="12" fill="#06b6d4" />
              {/* Leher & Tulang Belakang */}
              <line x1="120" y1="152" x2="140" y2="200" stroke="#38bdf8" strokeWidth="4" />
              {/* Lengan */}
              <line x1="125" y1="165" x2="100" y2="195" stroke="#0ea5e9" strokeWidth="3" />
              <line x1="125" y1="165" x2="155" y2="180" stroke="#0ea5e9" strokeWidth="3" />
              {/* Kaki Kiri Lari */}
              <line x1="140" y1="200" x2="110" y2="250" stroke="#10b981" strokeWidth="4" />
              <line x1="110" y1="250" x2="90" y2="300" stroke="#10b981" strokeWidth="4" />
              {/* Kaki Kanan Lari */}
              <line x1="140" y1="200" x2="175" y2="245" stroke="#10b981" strokeWidth="4" />
              <line x1="175" y1="245" x2="195" y2="295" stroke="#10b981" strokeWidth="4" />
              {/* Vector Kecepatan */}
              <line x1="140" y1="160" x2="220" y2="160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
              <text x="160" y="150" fill="#f59e0b" fontSize="11" fontWeight="bold">7.4 m/s</text>
            </g>
          )}

          {phase === "plant" && (
            <g className="transition-all duration-300">
              {/* Kepala */}
              <circle cx="210" cy="130" r="12" fill="#06b6d4" />
              {/* Badan agak condong ke belakang */}
              <line x1="210" y1="142" x2="195" y2="210" stroke="#38bdf8" strokeWidth="4" />
              {/* Kaki Tumpu Kiri (Plant) */}
              <line x1="195" y1="210" x2="225" y2="260" stroke="#ef4444" strokeWidth="5" />
              <line x1="225" y1="260" x2="245" y2="300" stroke="#ef4444" strokeWidth="5" />
              {/* Kaki Ayun Kanan */}
              <line x1="195" y1="210" x2="155" y2="230" stroke="#10b981" strokeWidth="4" />
              <line x1="155" y1="230" x2="145" y2="280" stroke="#10b981" strokeWidth="4" />
              {/* Sudut Takeoff Arc */}
              <path d="M 245 300 Q 225 240 195 210" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="3 3" />
              <text x="235" y="250" fill="#eab308" fontSize="12" fontWeight="bold">θ = 63.5°</text>
            </g>
          )}

          {phase === "takeoff" && (
            <g className="transition-all duration-300">
              {/* Atlet terangkat dari tanah */}
              <circle cx="240" cy="90" r="12" fill="#06b6d4" />
              <line x1="240" y1="102" x2="235" y2="165" stroke="#38bdf8" strokeWidth="4" />
              <line x1="235" y1="165" x2="215" y2="220" stroke="#10b981" strokeWidth="4" />
              <line x1="215" y1="220" x2="210" y2="265" stroke="#10b981" strokeWidth="4" />
              {/* Lutut Ayun Naik Tinggi */}
              <line x1="235" y1="165" x2="270" y2="150" stroke="#10b981" strokeWidth="4" />
              <line x1="270" y1="150" x2="265" y2="200" stroke="#10b981" strokeWidth="4" />
              {/* Vektor Impuls Vertikal */}
              <line x1="240" y1="140" x2="240" y2="50" stroke="#06b6d4" strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="250" y="65" fill="#06b6d4" fontSize="11" fontWeight="bold">Impuls Vertikal</text>
            </g>
          )}

          {phase === "clearance" && (
            <g className="transition-all duration-300">
              {/* Fosbury Flop Arching over the Bar (2.10m) */}
              {/* Kepala di sisi kanan bar, menghadap ke atas/belakang */}
              <circle cx="310" cy="135" r="11" fill="#06b6d4" />
              {/* Lengkungan Punggung & Pinggul di atas mistar */}
              <path
                d="M 180 160 Q 250 85 310 135"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="5"
              />
              {/* Kaki kiri tertekuk melengkung */}
              <line x1="180" y1="160" x2="145" y2="135" stroke="#10b981" strokeWidth="4" />
              <line x1="145" y1="135" x2="130" y2="100" stroke="#10b981" strokeWidth="4" />
              {/* Kaki kanan melecut ke atas melewati mistar */}
              <line x1="180" y1="160" x2="155" y2="120" stroke="#10b981" strokeWidth="4" />
              <line x1="155" y1="120" x2="140" y2="85" stroke="#10b981" strokeWidth="4" />
              {/* Label clearance */}
              <text x="210" y="80" fill="#06b6d4" fontSize="12" fontWeight="bold">
                Arch Angle: 142° (Clearance OK)
              </text>
            </g>
          )}

          {phase === "landing" && (
            <g className="transition-all duration-300">
              {/* Pendaratan di matras (Punggung atas pertama) */}
              <circle cx="330" cy="275" r="11" fill="#06b6d4" />
              <line x1="330" y1="275" x2="260" y2="285" stroke="#38bdf8" strokeWidth="5" />
              {/* Kaki terangkat ke atas matras */}
              <line x1="260" y1="285" x2="230" y2="230" stroke="#10b981" strokeWidth="4" />
              <line x1="230" y1="230" x2="210" y2="190" stroke="#10b981" strokeWidth="4" />
              <text x="240" y="200" fill="#10b981" fontSize="11" fontWeight="bold">Pendaratan Aman</text>
            </g>
          )}
        </svg>

        {/* Phase progress badge */}
        <div className="absolute bottom-12 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Fase Aktif: <strong className="text-white">{phase.toUpperCase()}</strong></span>
        </div>
      </div>

      {/* Control Buttons & Phase Switcher */}
      {interactive && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Jeda" : "Putar Fase"}</span>
            </button>
            <button
              onClick={() => selectPhase("approach")}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors cursor-pointer"
              title="Reset ke awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {phases.map((p) => (
              <button
                key={p}
                onClick={() => selectPhase(p)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  phase === p
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
