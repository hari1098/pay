"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Role } from "@/lib/enum/roles.enum";
import { ManagementSidebar } from "./management-sidebar";
import { ManagementHeader } from "./management-header";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { User } from "@/lib/types/user";

interface ManagementLayoutProps {
  children: React.ReactNode;
}

export function ManagementLayout({ children }: ManagementLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/profile");
      return data;
    },
  });
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ManagementSidebar 
        userRole={data.role} 
        pathname={pathname}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <div className="flex flex-col flex-1 overflow-hidden md:ml-0">
        <ManagementHeader 
          userName={data.name} 
          userEmail={data.email}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
