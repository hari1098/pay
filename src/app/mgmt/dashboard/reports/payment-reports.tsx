"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, CreditCard, TrendingUp, DollarSign, Receipt } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";

interface PaymentReportFilters {
  startDate: Date | null;
  endDate: Date | null;
  period: "daily" | "weekly" | "monthly";
}

export function PaymentReports() {
  const [filters, setFilters] = useState<PaymentReportFilters>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    period: "monthly"
  });

  const { data: transactionData, isLoading: transactionLoading } = useQuery({
    queryKey: ["payment-transactions", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.startDate) params.set("startDate", format(filters.startDate, "yyyy-MM-dd"));
      if (filters.endDate) params.set("endDate", format(filters.endDate, "yyyy-MM-dd"));
      params.set("period", filters.period);
      
      const { data } = await api.get(`/reports/payments/transactions?${params}`);
      return data;
    },
    enabled: !!(filters.startDate && filters.endDate)
  });

  const { data: revenueByProductData, isLoading: revenueByProductLoading } = useQuery({
    queryKey: ["revenue-by-product"],
    queryFn: async () => {
      const { data } = await api.get("/reports/payments/revenue-by-product");
      return data;
    }
  });

  const { data: revenueByCategoryData, isLoading: revenueByCategoryLoading } = useQuery({
    queryKey: ["revenue-by-category"],
    queryFn: async () => {
      const { data } = await api.get("/reports/payments/revenue-by-category");
      return data;
    }
  });

  const handleFilterChange = (key: keyof PaymentReportFilters, value: any) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Analytics Filters
          </CardTitle>
          <CardDescription>
            Configure date ranges and grouping for payment reports
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
                onClick={() => exportData("payment-transactions")} 
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {transactionLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(transactionData?.summary?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total platform revenue
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {transactionLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {transactionData?.summary?.totalTransactions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Completed transactions
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {transactionLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(transactionData?.summary?.avgTransactionValue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average transaction value
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {transactionLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {transactionData?.summary?.successRate || 100}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Payment success rate
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Timeline</CardTitle>
            <CardDescription>
              Revenue trends over selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactionLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : transactionData?.timeline ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={transactionData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Area type="monotone" dataKey="revenue" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No revenue timeline data available for the selected period.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Product Type</CardTitle>
            <CardDescription>
              Revenue distribution across ad types
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueByProductLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : revenueByProductData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Line Ads", value: revenueByProductData.lineAds?.revenue || 0, color: "#0088FE" },
                      { name: "Poster Ads", value: revenueByProductData.posterAds?.revenue || 0, color: "#00C49F" },
                      { name: "Video Ads", value: revenueByProductData.videoAds?.revenue || 0, color: "#FFBB28" }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[{ color: "#0088FE" }, { color: "#00C49F" }, { color: "#FFBB28" }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No product revenue data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
            <CardDescription>
              Number of transactions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactionLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : transactionData?.timeline ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transactionData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="transactions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No transaction volume data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories by Revenue</CardTitle>
            <CardDescription>
              Highest revenue generating categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueByCategoryLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : revenueByCategoryData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByCategoryData.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoryName" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Alert>
                <AlertDescription>No category revenue data available.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {revenueByProductData && (
        <Card>
          <CardHeader>
            <CardTitle>Product Performance Breakdown</CardTitle>
            <CardDescription>
              Detailed revenue and transaction metrics by product type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Product Type</th>
                    <th className="text-left p-2">Revenue</th>
                    <th className="text-left p-2">Transactions</th>
                    <th className="text-left p-2">Avg Value</th>
                    <th className="text-left p-2">Revenue Share</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Line Ads", data: revenueByProductData.lineAds },
                    { name: "Poster Ads", data: revenueByProductData.posterAds },
                    { name: "Video Ads", data: revenueByProductData.videoAds }
                  ].map((product, index) => {
                    const totalRevenue = (revenueByProductData.lineAds?.revenue || 0) + 
                                        (revenueByProductData.posterAds?.revenue || 0) + 
                                        (revenueByProductData.videoAds?.revenue || 0);
                    const share = totalRevenue > 0 ? ((product.data?.revenue || 0) / totalRevenue * 100).toFixed(1) : 0;
                    
                    return (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{product.name}</td>
                        <td className="p-2">
                          <Badge variant="secondary" className="text-green-700">
                            {formatCurrency(product.data?.revenue || 0)}
                          </Badge>
                        </td>
                        <td className="p-2">{product.data?.transactions || 0}</td>
                        <td className="p-2">{formatCurrency(product.data?.avgValue || 0)}</td>
                        <td className="p-2">
                          <Badge variant="outline">{share}%</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {revenueByCategoryData && (
        <Card>
          <CardHeader>
            <CardTitle>Category Revenue Breakdown</CardTitle>
            <CardDescription>
              Revenue performance by category with transaction details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Revenue</th>
                    <th className="text-left p-2">Transactions</th>
                    <th className="text-left p-2">Avg Transaction Value</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueByCategoryData.slice(0, 15).map((category: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{category.categoryName}</td>
                      <td className="p-2">
                        <Badge variant="secondary" className="text-green-700">
                          {formatCurrency(category.revenue)}
                        </Badge>
                      </td>
                      <td className="p-2">{category.transactions}</td>
                      <td className="p-2">{formatCurrency(category.avgTransactionValue)}</td>
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