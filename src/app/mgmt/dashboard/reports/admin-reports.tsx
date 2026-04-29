"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, UserCheck, Clock, CheckCircle, XCircle, Pause } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface AdminReportFilters {
  startDate: Date | null;
  endDate: Date | null;
  period: "daily" | "weekly" | "monthly";
  adminId?: string;
}

export function AdminReports() {
  const [filters, setFilters] = useState<AdminReportFilters>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    period: "daily"
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ["admin-activity", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.startDate) params.set("startDate", format(filters.startDate, "yyyy-MM-dd"));
      if (filters.endDate) params.set("endDate", format(filters.endDate, "yyyy-MM-dd"));
      params.set("period", filters.period);
      if (filters.adminId) params.set("adminId", filters.adminId);
      
      const { data } = await api.get(`/reports/admin/activity?${params}`);
      return data;
    },
    enabled: !!(filters.startDate && filters.endDate)
  });

  const { data: userWiseData, isLoading: userWiseLoading } = useQuery({
    queryKey: ["admin-user-wise", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.startDate) params.set("startDate", format(filters.startDate, "yyyy-MM-dd"));
      if (filters.endDate) params.set("endDate", format(filters.endDate, "yyyy-MM-dd"));
      
      const { data } = await api.get(`/reports/admin/user-wise-activity?${params}`);
      return data;
    },
    enabled: !!(filters.startDate && filters.endDate)
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["admin-category-activity", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.startDate) params.set("startDate", format(filters.startDate, "yyyy-MM-dd"));
      if (filters.endDate) params.set("endDate", format(filters.endDate, "yyyy-MM-dd"));
      
      const { data } = await api.get(`/reports/admin/activity-by-category?${params}`);
      return data;
    },
    enabled: !!(filters.startDate && filters.endDate)
  });

  const handleFilterChange = (key: keyof AdminReportFilters, value: any) => {
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
            <UserCheck className="h-5 w-5" />
            Admin Activity Filters
          </CardTitle>
          <CardDescription>
            Configure date ranges and admin selection for activity reports
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
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
              <label className="text-sm font-medium">Period</label>
              <Select value={filters.period} onValueChange={(value: "daily" | "weekly" | "monthly") => handleFilterChange("period", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin</label>
              <Select value={filters.adminId || ""} onValueChange={(value) => handleFilterChange("adminId", value || undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Admins" />
                </SelectTrigger>
                <SelectContent>
                  {userWiseData?.map((admin: any) => (
                    <SelectItem key={admin.adminId} value={admin.adminId}>
                      {admin.adminName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button 
                onClick={() => exportData("admin-activity")} 
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
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {activityData?.summary?.totalActions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Admin actions taken
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approvals</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {activityData?.summary?.approvals || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ads approved
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejections</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">
                  {activityData?.summary?.rejections || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ads rejected
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {activityData?.summary?.avgTimeToAction || 0}h
                </div>
                <p className="text-xs text-muted-foreground">
                  Average response time
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Activity Timeline</CardTitle>
            <CardDescription>
              Admin actions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : activityData?.timelineData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="actions" fill="#8884d8" />
                  <Bar dataKey="approvals" fill="#82ca9d" />
                  <Bar dataKey="rejections" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No activity timeline data available for the selected period.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Performance</CardTitle>
            <CardDescription>
              Individual admin activity breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userWiseLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : userWiseData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userWiseData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="adminName" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalActions" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No admin performance data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity by Category</CardTitle>
            <CardDescription>
              Admin actions distributed by ad categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : categoryData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalActions"
                    label={({ categoryName, totalActions }) => `${categoryName}: ${totalActions}`}
                  >
                    {categoryData.slice(0, 8).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No category activity data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action Type Distribution</CardTitle>
            <CardDescription>
              Breakdown of admin action types
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : activityData?.summary ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Approvals", value: activityData.summary.approvals, color: "#00C49F" },
                      { name: "Rejections", value: activityData.summary.rejections, color: "#FF8042" },
                      { name: "Holds", value: activityData.summary.holds, color: "#FFBB28" }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[{ color: "#00C49F" }, { color: "#FF8042" }, { color: "#FFBB28" }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No action type data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {userWiseData && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Admin Performance</CardTitle>
            <CardDescription>
              Individual admin activity statistics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-1 md:p-2">Admin</th>
                    <th className="text-left p-1 md:p-2">Actions</th>
                    <th className="text-left p-1 md:p-2 hidden sm:table-cell">Approvals</th>
                    <th className="text-left p-1 md:p-2 hidden sm:table-cell">Rejections</th>
                    <th className="text-left p-1 md:p-2 hidden md:table-cell">Holds</th>
                    <th className="text-left p-1 md:p-2 hidden md:table-cell">Reviews</th>
                    <th className="text-left p-1 md:p-2 hidden lg:table-cell">Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {userWiseData.map((admin: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-1 md:p-2 font-medium">{admin.adminName}</td>
                      <td className="p-1 md:p-2">
                        <Badge variant="secondary" className="text-xs">{admin.totalActions}</Badge>
                      </td>
                      <td className="p-1 md:p-2 hidden sm:table-cell">
                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                          {admin.approvals}
                        </Badge>
                      </td>
                      <td className="p-1 md:p-2 hidden sm:table-cell">
                        <Badge variant="default" className="bg-red-100 text-red-800 text-xs">
                          {admin.rejections}
                        </Badge>
                      </td>
                      <td className="p-1 md:p-2 hidden md:table-cell">
                        <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-xs">
                          {admin.holds}
                        </Badge>
                      </td>
                      <td className="p-1 md:p-2 hidden md:table-cell">{admin.reviews}</td>
                      <td className="p-1 md:p-2 hidden lg:table-cell">
                        {admin.avgTimeToAction ? `${admin.avgTimeToAction}h` : "N/A"}
                      </td>
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