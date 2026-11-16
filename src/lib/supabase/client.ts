import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fmbrgnwzznmccdowvmau.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_M8x7AwRaz651gly9wV4Qlw_TIxhE245";

/**
 * Supabase Client Instance (Singleton)
 * Digunakan di seluruh komponen client Next.js
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
