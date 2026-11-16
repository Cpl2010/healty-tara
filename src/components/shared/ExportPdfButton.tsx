"use client";

import React, { useState } from "react";
import { FileDown, Printer, Check } from "lucide-react";
import { toast } from "sonner";

interface ExportPdfButtonProps {
  reportTitle?: string;
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  reportTitle = "Laporan Analisis Biomekanika High Jump",
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleExport = () => {
    setDownloading(true);
    toast.info("Menyiapkan dokumen laporan analitik atlet...");

    setTimeout(() => {
      window.print();
      setDownloading(false);
      toast.success("Dokumen siap dicetak atau disimpan sebagai PDF!");
    }, 600);
  };

  return (
    <button
      onClick={handleExport}
      disabled={downloading}
      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
      title="Export ke PDF atau Cetak"
    >
      <FileDown className="w-4 h-4 text-cyan-400" />
      <span>{downloading ? "Memproses..." : "Export Laporan PDF"}</span>
    </button>
  );
};
