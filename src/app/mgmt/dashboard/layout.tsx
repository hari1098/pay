"use client";
import { ManagementLayout } from "@/components/mgmt/management-layout";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { createContext, useContext } from "react";

export const DashboardContext = createContext<any>(null);

export function useDashboardData() {
  return useContext(DashboardContext);
}

export default function ManagementDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["globalDashboard"],
    queryFn: async () => {
      const { data } = await api.get("/ad-dashboard/global");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading dashboard...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={dashboardData}>
      <ManagementLayout>{children}</ManagementLayout>
    </DashboardContext.Provider>
  );
}
