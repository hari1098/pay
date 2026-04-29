import type { Metadata } from "next";
import DashboardStats from "@/components/dashboard/dashboard-stats";

export const metadata: Metadata = {
  title: "Dashboard - PaisaAds",
  description: "Manage your advertisements",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardStats />
    </div>
  );
}
