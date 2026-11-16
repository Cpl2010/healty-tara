"use client";

import React, { useState } from "react";
import { UploadCloud, FileVideo, Film, CheckCircle2, Play } from "lucide-react";
import { toast } from "sonner";

interface VideoUploaderProps {
  onVideoSelected?: (videoName: string, videoUrl?: string) => void;
  onAnalyze?: () => void;
  analyzing?: boolean;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoSelected,
  onAnalyze,
  analyzing = false,
}) => {
  const [selectedVideo, setSelectedVideo] = useState("fosbury_flop_210m_clearance.mp4");
  const [isDragOver, setIsDragOver] = useState(false);

  const sampleVideos = [
    {
      id: "sample-1",
      name: "fosbury_flop_210m_clearance.mp4",
      title: "Rekaman Fosbury Flop 2.10m (Kejuaraan Nasional)",
      fps: "60 FPS",
      angle: "Tampak Samping (Lateral)",
    },
    {
      id: "sample-2",
      name: "j_curve_approach_takeoff.mp4",
      title: "Analisis Sudut Tumpuan J-Curve Approach",
      fps: "120 FPS Slow-Mo",
      angle: "Sudut Diagonal 45°",
    },
    {
      id: "sample-3",
      name: "plant_step_penetration.mp4",
      title: "Penultimate & Plant Step Drill",
      fps: "60 FPS",
      angle: "Tampak Depan",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedVideo(file.name);
      toast.success(`Video "${file.name}" berhasil dimuat ke MediaPipe Studio!`);
      if (onVideoSelected) onVideoSelected(file.name);
    }
  };

  const handleSelectSample = (sample: (typeof sampleVideos)[0]) => {
    setSelectedVideo(sample.name);
    toast.info(`Memuat klip sampel: ${sample.title}`);
    if (onVideoSelected) onVideoSelected(sample.name);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Film className="w-4 h-4 text-cyan-400" />
          Unggah Video & Pemilihan Klip Lompat Tinggi
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Pilih video rekaman latihan Anda atau gunakan klip sampel beresolusi tinggi untuk pose estimation
        </p>
      </div>

      {/* Drag & Drop Box */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedVideo(file.name);
            toast.success(`Video "${file.name}" berhasil diunggah!`);
            if (onVideoSelected) onVideoSelected(file.name);
          }
        }}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragOver
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
        }`}
      >
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 shadow-inner">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-white">
          Tarik & lepas file video Anda di sini, atau{" "}
          <span className="text-cyan-400 underline">telusuri file</span>
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Mendukung format MP4, MOV, atau WEBM (Disarankan 60 FPS atau lebih)
        </p>
      </label>

      {/* Video Sampel Pilihan */}
      <div className="space-y-2 pt-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Atau Pilih Klip Sampel Referensi Atletik:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {sampleVideos.map((sample) => {
            const isSelected = selectedVideo === sample.name;
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? "bg-cyan-500/10 border-cyan-500/40 shadow-sm"
                    : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
                    {sample.fps}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <h5 className="text-xs font-semibold text-white truncate">{sample.title}</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">{sample.angle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
