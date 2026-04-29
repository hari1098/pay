"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleReportsFilter } from './simple-reports-filter'
import { SimpleReportsTable } from "./simple-reports-table";
import { UserReports } from "./user-reports";
import { AdminReports } from "./admin-reports";
import { ListingReports } from "./listing-reports";
import { PaymentReports } from "./payment-reports";
import { BarChart3, Users, UserCheck, FileText, CreditCard } from "lucide-react";

export interface ReportsFilters {
  adType: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  state: string;
  city: string;
  userType: string;
  mainCategory: string;
  categoryOne: string;
  categoryTwo: string;
  categoryThree: string;
}

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportsFilters>({
    adType: "",
    status: "",
    startDate: null,
    endDate: null,
    state: "",
    city: "",
    userType: "",
    mainCategory: "",
    categoryOne: "",
    categoryTwo: "",
    categoryThree: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("filtered-ads");

  const handleFiltersChange = (newFilters: ReportsFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">📊 Comprehensive Reports</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Advanced analytics and business intelligence for Paisa Ads platform
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 md:gap-0 h-auto md:h-10">
          <TabsTrigger value="filtered-ads" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
            <BarChart3 className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Filtered Ads</span>
            <span className="sm:hidden">Ads</span>
          </TabsTrigger>
          <TabsTrigger value="user-reports" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
            <Users className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">User Reports</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
          <TabsTrigger value="admin-reports" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
            <UserCheck className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Admin Reports</span>
            <span className="sm:hidden">Admin</span>
          </TabsTrigger>
          <TabsTrigger value="listing-reports" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
            <FileText className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Listing Reports</span>
            <span className="sm:hidden">Listings</span>
          </TabsTrigger>
          <TabsTrigger value="payment-reports" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
            <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Payment Reports</span>
            <span className="sm:hidden">Payment</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filtered-ads" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
                Filtered Ads Report
              </CardTitle>
              <CardDescription className="text-sm">
                Filter and analyze ads data based on various criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4 md:space-y-6">
                <SimpleReportsFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
                <SimpleReportsTable
                  filters={filters}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-reports" className="space-y-4 md:space-y-6">
          <UserReports />
        </TabsContent>

        <TabsContent value="admin-reports" className="space-y-4 md:space-y-6">
          <AdminReports />
        </TabsContent>

        <TabsContent value="listing-reports" className="space-y-4 md:space-y-6">
          <ListingReports />
        </TabsContent>

        <TabsContent value="payment-reports" className="space-y-4 md:space-y-6">
          <PaymentReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
