"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Users, UserCheck, TrendingUp, Activity } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface UserReportFilters {
  startDate: Date | null;
  endDate: Date | null;
  period: "daily" | "weekly" | "monthly";
}

export function UserReports() {
  const [filters, setFilters] = useState<UserReportFilters>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    period: "daily"
  });

  const { data: registrationData, isLoading: registrationLoading } = useQuery({
    queryKey: ["user-registrations", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.startDate) params.set("startDate", format(filters.startDate, "yyyy-MM-dd"));
      if (filters.endDate) params.set("endDate", format(filters.endDate, "yyyy-MM-dd"));
      params.set("period", filters.period);
      
      const { data } = await api.get(`/reports/users/registrations?${params}`);
      return data;
    },
    enabled: !!(filters.startDate && filters.endDate)
  });

  const { data: activeInactiveData, isLoading: activeInactiveLoading } = useQuery({
    queryKey: ["active-inactive-users"],
    queryFn: async () => {
      const { data } = await api.get("/reports/users/active-vs-inactive");
      return data;
    }
  });

  const { data: loginActivityData, isLoading: loginActivityLoading } = useQuery({
    queryKey: ["user-login-activity", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.startDate) params.set("startDate", format(filters.startDate, "yyyy-MM-dd"));
      if (filters.endDate) params.set("endDate", format(filters.endDate, "yyyy-MM-dd"));
      params.set("period", filters.period);
      
      const { data } = await api.get(`/reports/users/login-activity?${params}`);
      return data;
    },
    enabled: !!(filters.startDate && filters.endDate)
  });

  const { data: viewsByCategoryData, isLoading: viewsByCategoryLoading } = useQuery({
    queryKey: ["user-views-by-category"],
    queryFn: async () => {
      const { data } = await api.get("/reports/users/views-by-category");
      return data;
    }
  });

  const handleFilterChange = (key: keyof UserReportFilters, value: any) => {
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
            <Users className="h-5 w-5" />
            User Analytics Filters
          </CardTitle>
          <CardDescription>
            Configure date ranges and grouping for user reports
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
              <label className="text-sm font-medium">Actions</label>
              <Button 
                onClick={() => exportData("user-registrations")} 
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {activeInactiveLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {activeInactiveData ? activeInactiveData.active + activeInactiveData.inactive : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Registered users on platform
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {activeInactiveLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {activeInactiveData?.active || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {activeInactiveData?.percentage?.active || 0}% of total users
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {registrationLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  +{registrationData?.summary?.growth || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Registration growth
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loginActivityLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600">
                  {loginActivityData?.summary?.avgDailyActive || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average daily active users
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Registration Trends</CardTitle>
            <CardDescription>
              New user registrations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrationLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : registrationData?.data ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={registrationData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="activeCount" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No registration data available for the selected period.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Status Distribution</CardTitle>
            <CardDescription>
              Active vs inactive user breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeInactiveLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : activeInactiveData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Active", value: activeInactiveData.active, color: "#00C49F" },
                      { name: "Inactive", value: activeInactiveData.inactive, color: "#FF8042" }
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
                <AlertDescription>No user status data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Login Activity</CardTitle>
            <CardDescription>
              User login patterns over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginActivityLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : loginActivityData?.data ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={loginActivityData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                  <Bar dataKey="activeCount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No login activity data available for the selected period.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Views by Category</CardTitle>
            <CardDescription>
              Most popular categories by estimated views
            </CardDescription>
          </CardHeader>
          <CardContent>
            {viewsByCategoryLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : viewsByCategoryData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={viewsByCategoryData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoryName" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="estimatedViews" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No category views data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {registrationData?.data && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Registration Statistics</CardTitle>
            <CardDescription>
              Breakdown of user registrations by period and demographics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-1 md:p-2">Period</th>
                    <th className="text-left p-1 md:p-2">Total</th>
                    <th className="text-left p-1 md:p-2">Active</th>
                    <th className="text-left p-1 md:p-2 hidden sm:table-cell">By Role</th>
                    <th className="text-left p-1 md:p-2 hidden sm:table-cell">By Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {registrationData.data.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-1 md:p-2 font-medium">{item.period}</td>
                      <td className="p-1 md:p-2">{item.count}</td>
                      <td className="p-1 md:p-2">
                        <Badge variant="secondary" className="text-xs">{item.activeCount}</Badge>
                      </td>
                      <td className="p-1 md:p-2 hidden sm:table-cell">
                        <div className="text-xs space-y-1">
                          {item.byRole && Object.entries(item.byRole).map(([role, count]: [string, any]) => (
                            <div key={role}>{role}: {count}</div>
                          ))}
                        </div>
                      </td>
                      <td className="p-1 md:p-2 hidden sm:table-cell">
                        <div className="text-xs space-y-1">
                          {item.byGender && Object.entries(item.byGender).map(([gender, count]: [string, any]) => (
                            <div key={gender}>{gender}: {count}</div>
                          ))}
                        </div>
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