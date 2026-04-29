"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, Image as ImageIcon, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface ListingReportFilters {
  startDate: Date | null;
  endDate: Date | null;
}

export function ListingReports() {
  const [filters, setFilters] = useState<ListingReportFilters>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["listing-analytics", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.startDate) params.set("startDate", format(filters.startDate, "yyyy-MM-dd"));
      if (filters.endDate) params.set("endDate", format(filters.endDate, "yyyy-MM-dd"));
      
      const { data } = await api.get(`/reports/listings/analytics?${params}`);
      return data;
    },
    enabled: !!(filters.startDate && filters.endDate)
  });

  const { data: activeByCategoryData, isLoading: activeByCategoryLoading } = useQuery({
    queryKey: ["active-by-category"],
    queryFn: async () => {
      const { data } = await api.get("/reports/listings/active-by-category");
      return data;
    }
  });

  const { data: approvalTimesData, isLoading: approvalTimesLoading } = useQuery({
    queryKey: ["approval-times"],
    queryFn: async () => {
      const { data } = await api.get("/reports/listings/approval-times");
      return data;
    }
  });

  const { data: byUserData, isLoading: byUserLoading } = useQuery({
    queryKey: ["listings-by-user"],
    queryFn: async () => {
      const { data } = await api.get("/reports/listings/by-user");
      return data;
    }
  });

  const handleFilterChange = (key: keyof ListingReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const exportData = async (reportType: string) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.set("startDate", format(filters.startDate, "yyyy-MM-dd"));
      if (filters.endDate) params.set("endDate", format(filters.endDate, "yyyy-MM-dd"));
      params.set("format", "csv");
      params.set("reportType", reportType);

      const response = await api.get(`/reports/export?${params}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Listing Analytics Filters
          </CardTitle>
          <CardDescription>
            Configure date ranges for listing performance reports
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? format(filters.startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.startDate || undefined}
                    onSelect={(date) => handleFilterChange("startDate", date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate ? format(filters.endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.endDate || undefined}
                    onSelect={(date) => handleFilterChange("endDate", date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button 
                onClick={() => exportData("listing-analytics")} 
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {analyticsData?.summary?.totalListings || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  All listings on platform
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {analyticsData?.summary?.withImages || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData?.summary?.totalListings 
                    ? Math.round((analyticsData.summary.withImages / analyticsData.summary.totalListings) * 100)
                    : 0}% have images
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Approval</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsData?.summary?.avgApprovalTime || 0}h
                </div>
                <p className="text-xs text-muted-foreground">
                  Average approval time
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {byUserLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600">
                  {byUserData?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Users with listings
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Listings by Category</CardTitle>
            <CardDescription>
              Distribution of active listings across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeByCategoryLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : activeByCategoryData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activeByCategoryData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoryName" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No category data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listings by User Type</CardTitle>
            <CardDescription>
              Individual vs Business user listing distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : analyticsData?.byUserType ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.byUserType}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ userType, percentage }) => `${userType}: ${percentage}%`}
                  >
                    {analyticsData.byUserType.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No user type data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Usage Statistics</CardTitle>
            <CardDescription>
              Listings with vs without images
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : analyticsData?.summary ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "With Images", value: analyticsData.summary.withImages, color: "#00C49F" },
                      { name: "Without Images", value: analyticsData.summary.withoutImages, color: "#FF8042" }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[{ color: "#00C49F" }, { color: "#FF8042" }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No image usage data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>
              Categories by listing count and approval metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : analyticsData?.byCategory ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.byCategory.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoryName" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalAds" fill="#0088FE" name="Total Ads" />
                  <Bar dataKey="activeAds" fill="#00C49F" name="Active Ads" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No category performance data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {analyticsData?.byCategory && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Category Analytics</CardTitle>
            <CardDescription>
              Comprehensive category performance metrics and approval times
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Total Ads</th>
                    <th className="text-left p-2">Active Ads</th>
                    <th className="text-left p-2">With Images</th>
                    <th className="text-left p-2">Without Images</th>
                    <th className="text-left p-2">Avg Approval Time</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.byCategory.map((category: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{category.categoryName}</td>
                      <td className="p-2">
                        <Badge variant="secondary">{category.totalAds}</Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {category.activeAds}
                        </Badge>
                      </td>
                      <td className="p-2">{category.withImages}</td>
                      <td className="p-2">{category.withoutImages}</td>
                      <td className="p-2">
                        {category.avgApprovalTime ? `${category.avgApprovalTime}h` : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {byUserData && (
        <Card>
          <CardHeader>
            <CardTitle>Top Users by Listings</CardTitle>
            <CardDescription>
              Users with the most active listings on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">User Type</th>
                    <th className="text-left p-2">Line Ads</th>
                    <th className="text-left p-2">Poster Ads</th>
                    <th className="text-left p-2">Video Ads</th>
                    <th className="text-left p-2">Total Ads</th>
                    <th className="text-left p-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {byUserData.slice(0, 20).map((user: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{user.userName}</td>
                      <td className="p-2">
                        <Badge variant="outline">{user.userType}</Badge>
                      </td>
                      <td className="p-2">{user.lineAds}</td>
                      <td className="p-2">{user.posterAds}</td>
                      <td className="p-2">{user.videoAds}</td>
                      <td className="p-2">
                        <Badge variant="secondary">{user.totalAds}</Badge>
                      </td>
                      <td className="p-2 text-xs text-muted-foreground">{user.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}