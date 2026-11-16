"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil sesi awal saat aplikasi dimuat
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Gagal mengambil sesi aktif:", error.message);
        } else {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.error("Terjadi kesalahan sesi:", err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Berlangganan perubahan status otentikasi (Active Session Listener)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fungsi Login dengan Email & Password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`Login gagal: ${error.message}`);
        return { error };
      }

      toast.success(`Selamat datang kembali, ${data.user.user_metadata?.full_name || data.user.email}!`);
      return { error: null };
    } catch (err: any) {
      const errMsg = err?.message || "Terjadi kesalahan pada sistem autentikasi.";
      toast.error(errMsg);
      return { error: err };
    }
  };

  // Fungsi Sign Up (Register)
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast.error(`Registrasi gagal: ${error.message}`);
        return { error };
      }

      // Opsional: Buat profil di tabel profiles jika user baru berhasil terdaftar
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          user_id: data.user.id,
          full_name: fullName,
          athlete_category: "High Jump Pro",
          created_at: new Date().toISOString(),
        });
      }

      toast.success("Registrasi berhasil! Silakan periksa email untuk konfirmasi (jika email confirmation aktif) atau langsung masuk.");
      return { error: null };
    } catch (err: any) {
      const errMsg = err?.message || "Gagal membuat akun.";
      toast.error(errMsg);
      return { error: err };
    }
  };

  // Fungsi Logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(`Gagal keluar: ${error.message}`);
      } else {
        toast.success("Berhasil keluar dari akun.");
      }
    } catch (err: any) {
      toast.error("Gagal memproses logout.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};
