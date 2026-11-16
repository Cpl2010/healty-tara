"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { NutritionLog } from "@/types";
import { toast } from "sonner";
import { Utensils, Calculator, Plus, Trash2, Loader2, GlassWater } from "lucide-react";

interface NutritionTrackerProps {
  onOpenAuth?: () => void;
}

export const NutritionTracker: React.FC<NutritionTrackerProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [foods, setFoods] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // TDEE States
  const [weight, setWeight] = useState("71");
  const [height, setHeight] = useState("182");
  const [age, setAge] = useState("21");
  const [tdeeResult, setTdeeResult] = useState<{
    tdee: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);

  // Hydration state
  const [waterMl, setWaterMl] = useState(1750);
  const maxWater = 2500;

  // Food Form States
  const [mealTime, setMealTime] = useState("Sarapan Pagi");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("500");
  const [protein, setProtein] = useState("35");
  const [carbs, setCarbs] = useState("60");
  const [fat, setFat] = useState("12");

  // 1. Fetch Nutrition Logs dari Supabase
  const fetchNutritionLogs = async () => {
    if (!user) {
      setFoods([]);
      return;
    }

    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("nutrition_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error [fetchNutritionLogs]:", error);
        toast.error(`Gagal memuat catatan nutrisi: ${error.message}`);
      } else if (data) {
        setFoods(data as NutritionLog[]);
      }
    } catch (err: any) {
      console.error("Catch Error [fetchNutritionLogs]:", err);
      toast.error("Masalah koneksi saat mengambil log nutrisi.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNutritionLogs();

    if (user) {
      const channel = supabase
        .channel(`realtime-nutrition-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "nutrition_logs",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchNutritionLogs();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  // 2. Simpan Log Nutrisi Baru ke Supabase
  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.info("Silakan login untuk menyimpan jurnal makanan ke akun Supabase Anda.");
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (!foodName.trim()) {
      toast.error("Nama menu makanan tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      const newFoodPayload = {
        user_id: user.id, // User id dari user aktif
        meal_time: mealTime,
        food_name: foodName.trim(),
        calories: parseInt(calories, 10) || 0,
        protein_g: parseInt(protein, 10) || 0,
        carbs_g: parseInt(carbs, 10) || 0,
        fat_g: parseInt(fat, 10) || 0,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("nutrition_logs")
        .insert([newFoodPayload])
        .select();

      if (error) {
        throw error;
      }

      toast.success("Catatan makanan berhasil disimpan ke Supabase!");
      setFoodName("");
      if (data && data.length > 0) {
        setFoods((prev) => [data[0] as NutritionLog, ...prev]);
      }
    } catch (err: any) {
      console.error("Gagal menyimpan nutrisi:", err);
      toast.error(`Gagal menyimpan nutrisi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Hapus Log Nutrisi
  const handleDeleteFood = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("nutrition_logs")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setFoods((prev) => prev.filter((item) => item.id !== id));
      toast.info("Data makanan telah dihapus.");
    } catch (err: any) {
      toast.error(`Gagal menghapus: ${err.message}`);
    }
  };

  // Kalkulator TDEE
  const calculateTDEE = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight) || 70;
    const h = parseFloat(height) || 175;
    const a = parseFloat(age) || 20;

    // Rumus Harris-Benedict untuk atlet
    const bmr = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
    const tdeeVal = Math.round(bmr * 1.55);
    const protVal = Math.round(w * 2.0);
    const fatVal = Math.round((tdeeVal * 0.25) / 9);
    const carbsVal = Math.round((tdeeVal - protVal * 4 - fatVal * 9) / 4);

    setTdeeResult({
      tdee: tdeeVal,
      protein: protVal,
      carbs: carbsVal,
      fat: fatVal,
    });
    toast.success("Kalkulasi TDEE & Makronutrien berhasil diperbarui!");
  };

  const addWater = (ml: number) => {
    setWaterMl((prev) => Math.min(prev + ml, maxWater));
    toast.success(`+${ml} ml air minum ditambahkan!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Utensils className="w-5 h-5 text-indigo-400" /> Nutrisi & Manajemen Kalori (Supabase Database)
        </h2>
        <p className="text-xs text-slate-400">
          Kalkulator makronutrien TDEE otomatis, pencatat asupan makanan, dan hidrasi atlet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TDEE Calculator */}
        <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" /> Kalkulator TDEE & Makronutrien
          </h3>
          <form onSubmit={calculateTDEE} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Berat Badan (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tinggi Badan (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Usia (Tahun)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30"
              >
                Hitung TDEE
              </button>
            </div>
          </form>

          {tdeeResult && (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center animate-in fade-in">
              <div>
                <p className="text-xs text-slate-400">Pemeliharaan (TDEE)</p>
                <h4 className="text-lg font-bold text-white">{tdeeResult.tdee.toLocaleString()} kcal</h4>
              </div>
              <div>
                <p className="text-xs text-slate-400">Protein (2g/kg)</p>
                <h4 className="text-lg font-bold text-indigo-400">{tdeeResult.protein} g</h4>
              </div>
              <div>
                <p className="text-xs text-slate-400">Karbohidrat</p>
                <h4 className="text-lg font-bold text-amber-400">{tdeeResult.carbs} g</h4>
              </div>
              <div>
                <p className="text-xs text-slate-400">Lemak Sehat</p>
                <h4 className="text-lg font-bold text-violet-400">{tdeeResult.fat} g</h4>
              </div>
            </div>
          )}
        </div>

        {/* Hydration Widget */}
        <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GlassWater className="w-4 h-4 text-cyan-400" /> Hidrasi Harian
            </h3>
            <span className="text-xs text-indigo-400 font-semibold">
              {waterMl.toLocaleString()} / {maxWater.toLocaleString()} ml
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(waterMl / maxWater) * 100}%` }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-xl border border-slate-700 text-white transition-all"
            >
              +250 ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-medium rounded-xl border border-indigo-500/30 transition-all"
            >
              +500 ml
            </button>
          </div>
        </div>
      </div>

      {/* Form Tambah Menu Makanan */}
      <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" /> Catat Makanan ke Supabase
        </h3>
        <form onSubmit={handleAddFood} className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">Waktu</label>
            <select
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Sarapan Pagi">Sarapan</option>
              <option value="Makan Siang">Makan Siang</option>
              <option value="Makan Malam">Makan Malam</option>
              <option value="Camilan / Pre-Workout">Camilan</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-1">Menu Makanan</label>
            <input
              type="text"
              required
              placeholder="Contoh: Dada Ayam + Nasi Merah"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Kalori (kcal)</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Protein (g)</label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Jurnal Makanan Tersimpan */}
      <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white">Daftar Makanan Harian (Supabase Database)</h3>
          {fetching && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3 rounded-l-lg">Waktu Makan</th>
                <th className="p-3">Menu Makanan</th>
                <th className="p-3">Kalori (kcal)</th>
                <th className="p-3">Makro (P/K/F)</th>
                <th className="p-3 rounded-r-lg text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {foods.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-xs text-slate-500">
                    {user
                      ? "Belum ada catatan makanan tersimpan di Supabase."
                      : "Silakan masuk untuk melihat jurnal nutrisi cloud Anda."}
                  </td>
                </tr>
              ) : (
                foods.map((food) => (
                  <tr key={food.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-semibold text-white">{food.meal_time}</td>
                    <td className="p-3">{food.food_name}</td>
                    <td className="p-3 text-amber-400 font-medium">{food.calories} kcal</td>
                    <td className="p-3 text-xs text-slate-400">
                      {food.protein_g}g / {food.carbs_g}g / {food.fat_g}g
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteFood(food.id)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
