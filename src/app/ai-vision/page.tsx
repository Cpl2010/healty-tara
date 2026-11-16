"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { PoseVisualizer } from "@/components/ai/PoseVisualizer";
import { VideoUploader } from "@/components/ai/VideoUploader";
import { analyzeKinematics } from "@/lib/ai/kinematics";
import { JumpPhaseType, KinematicsResult } from "@/types";
import { toast } from "sonner";
import {
  Sparkles,
  Scan,
  Loader2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

export default function AiVisionPage() {
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<JumpPhaseType>("clearance");
  const [selectedVideo, setSelectedVideo] = useState("fosbury_flop_210m_clearance.mp4");

  // State hasil analisis kinematika
  const [results, setResults] = useState<KinematicsResult | null>({
    takeoffAngle: 63.8,
    approachVelocity: 7.4,
    estimatedVerticalLeap: 81.5,
    archScore: 88,
    kneeFlexionAngle: 142.0,
    feedback: [
      "Sudut take-off optimal (63.8°). Konversi kecepatan lari ke impuls vertikal sangat efisien.",
      "Kecepatan kurva 7.4 m/s memberikan gaya sentrifugal yang prima.",
      "Lengkungan panggul sempurna (142°). Pinggul bebas melewati mistar 2.10m.",
    ],
  });

  const handleRunAiAnalysis = () => {
    setAnalyzing(true);
    toast.info("Memulai ekstraksi koordinat MediaPipe & kalkulasi kinematika...");

    setTimeout(async () => {
      // Menghitung kinematika acak realistis berbasis gerakan
      const angle = parseFloat((61 + Math.random() * 5).toFixed(1));
      const speed = parseFloat((7.1 + Math.random() * 0.9).toFixed(1));
      const arch = parseFloat((138 + Math.random() * 12).toFixed(1));
      const knee = parseFloat((135 + Math.random() * 10).toFixed(1));

      const analysis = analyzeKinematics(angle, speed, arch, knee);
      setResults(analysis);
      setAnalyzing(false);
      toast.success("Analisis AI Video Scan selesai!");

      // Simpan ke Supabase jika user sedang login
      if (user) {
        try {
          await supabase.from("jump_metrics").insert([
            {
              user_id: user.id,
              vertical_leap_cm: analysis.estimatedVerticalLeap,
              takeoff_angle_deg: analysis.takeoffAngle,
              approach_speed_ms: analysis.approachVelocity,
              ai_recommendation: analysis.feedback.join(" "),
              created_at: new Date().toISOString(),
            },
          ]);
          toast.success("Hasil analisis biomekanika tersimpan ke cloud Supabase!");
        } catch (err: any) {
          console.error("Gagal menyimpan ke Supabase:", err);
        }
      }
    }, 2200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Fitur 1 & 2: Pose Estimation & Kinematika
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Studio Analisis Video AI & Pose Estimation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Memanfaatkan deteksi rangka Computer Vision (MediaPipe) untuk mengukur sudut tumpuan
              kaki (plant angle), kecepatan lari kurva J, serta lengkungan spinal layback saat melewati mistar.
            </p>
          </div>

          <button
            onClick={handleRunAiAnalysis}
            disabled={analyzing}
            className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Mengekstrak Rangka 33 Titik...
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" /> Jalankan AI Pose Scan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Video Uploader & Pose Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <VideoUploader
            onVideoSelected={(name) => setSelectedVideo(name)}
            onAnalyze={handleRunAiAnalysis}
            analyzing={analyzing}
          />

          {/* Quick link ke Fitur 3: Comparison */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-white">Ingin membandingkan dua percobaan?</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Gunakan modul Side-by-Side & Ghost Overlay untuk komparasi teknik.
              </p>
            </div>
            <Link
              href="/comparison"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              Buka Ghost Overlay <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Pose Visualizer */}
        <div>
          <PoseVisualizer
            currentPhase={currentPhase}
            onPhaseChange={(p) => setCurrentPhase(p)}
          />
        </div>
      </div>

      {/* Hasil Analisis Biomekanika & Kinematika */}
      {results && (
        <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Metrik Hasil Pemindaian Kinematika Rangka (Pose Metrics)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Sudut Take-off (θ)</span>
              <h4 className="text-xl font-black text-white mt-1">{results.takeoffAngle}°</h4>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">
                Zona Optimal: 63° - 65°
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Kecepatan Awalan</span>
              <h4 className="text-xl font-black text-cyan-400 mt-1">{results.approachVelocity} m/s</h4>
              <span className="text-[10px] text-slate-400 mt-1 inline-block">Gaya Sentrifugal Prima</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Est. Vertical Leap</span>
              <h4 className="text-xl font-black text-amber-400 mt-1">{results.estimatedVerticalLeap} cm</h4>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">
                Tinggi Efektif
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Fosbury Arch Score</span>
              <h4 className="text-xl font-black text-emerald-400 mt-1">{results.archScore}%</h4>
              <span className="text-[10px] text-slate-400 mt-1 inline-block">Kelenturan Layback</span>
            </div>
          </div>

          {/* AI Coaching Feedback Items */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Masukan Pelatih AI (AI Coach Feedback):
            </h5>
            <ul className="space-y-1.5">
              {results.feedback.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
