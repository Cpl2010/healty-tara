import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickWorkoutCard from "@/components/dashboard/QuickWorkoutCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Pastikan menggunakan format <NamaKomponen /> */}
      <DashboardStats />
      <QuickWorkoutCard />
    </div>
  );
}
