import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/shared/Navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AI HighJump & Sports Pro | Biomechanics & Analytics Suite",
  description:
    "Aplikasi Analisis Video & Kinematika Lompat Tinggi, MediaPipe Pose Estimation, Ghost Overlay & Database Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
        <AuthProvider>
          {/* Global Navbar */}
          <Navbar />

          {/* Main Page Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>

          {/* Global Footer */}
          <footer className="mt-auto border-t border-slate-800 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
            <p>
              &copy; 2026 AI HighJump & Sports Pro. Dikembangkan untuk Ujian Akhir Semester (UAS).
            </p>
          </footer>

          {/* Toast Notification Container */}
          <Toaster position="bottom-right" richColors theme="dark" />
        </AuthProvider>
      </body>
    </html>
  );
}
