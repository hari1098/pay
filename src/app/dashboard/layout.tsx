"use client";
import type React from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { User } from "@/lib/types/user";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/profile");
      return data;
    },
  });
  const pathname = usePathname();
  return (
    <div className=" h-screen ">
      <DashboardNavbar
        userEmail={data?.email ?? ""}
        userName={data?.name ?? ""}
      />
      <div className="flex  h-[calc(100vh-65px)]">
        <DashboardSidebar pathname={pathname} />
        <main className="flex-1 h-full p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
