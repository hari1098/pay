"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  Eye,
  Clock,
  Image,
  Video,
  List,
  CheckCircle2,
} from "lucide-react";
import { useDashboardData } from "./layout";
import { StatusDistributionChart } from "@/components/mgmt/stat-distribution-chart";
import { RecentAdsList } from "@/components/mgmt/recent-ad-list";

export default function ManagementDashboardPage() {
  const dashboardStats = useDashboardData();
  const isLoading = !dashboardStats;

  const inReviewCount =
    (dashboardStats?.statusCounts.FOR_REVIEW || 0) +
    (dashboardStats?.statusCounts.YET_TO_BE_PUBLISHED || 0);

  const overviewTiles = [
    {
      label: "Total Ads",
      count: dashboardStats?.totalAds || 0,
      icon: <BarChart3 className="h-6 w-6" />,
      description: "All advertisements",
      color: "bg-blue-50 text-blue-600 border-blue-200",
      iconBg: "bg-blue-100",
    },
    {
      label: "Published",
      count: dashboardStats?.statusCounts.PUBLISHED || 0,
      icon: <CheckCircle2 className="h-6 w-6" />,
      description: "Live advertisements",
      color: "bg-green-50 text-green-600 border-green-200",
      iconBg: "bg-green-100",
    },
    {
      label: "In Review",
      count: inReviewCount,
      icon: <Clock className="h-6 w-6" />,
      description: "Pending approval",
      color: "bg-orange-50 text-orange-600 border-orange-200",
      iconBg: "bg-orange-100",
    },
    {
      label: "Draft",
      count: dashboardStats?.statusCounts.DRAFT || 0,
      icon: <FileText className="h-6 w-6" />,
      description: "Draft advertisements",
      color: "bg-gray-50 text-gray-600 border-gray-200",
      iconBg: "bg-gray-100",
    },
  ];

  const adTypeTiles = [
    {
      label: "Line Ads",
      count: dashboardStats?.lineAds || 0,
      icon: <List className="h-5 w-5" />,
      description: "Text-based ads",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      label: "Poster Ads",
      count: dashboardStats?.posterAds || 0,
      icon: <Image className="h-5 w-5" />,
      description: "Image advertisements",
      color: "bg-pink-50 text-pink-600 border-pink-200",
    },
    {
      label: "Video Ads",
      count: dashboardStats?.videoAds || 0,
      icon: <Video className="h-5 w-5" />,
      description: "Video advertisements",
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewTiles.map((tile) => (
            <Card
              key={tile.label}
              className={`border-2 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${tile.color}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium opacity-80">
                      {tile.label}
                    </p>
                    <p className="text-3xl font-bold">
                      {tile.count.toLocaleString()}
                    </p>
                    <p className="text-xs opacity-70">{tile.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${tile.iconBg}`}>
                    {tile.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Ad Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adTypeTiles.map((tile) => (
            <Card
              key={tile.label}
              className={`border-2 hover:shadow-md transition-all duration-200 ${tile.color}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">{tile.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium opacity-80">
                      {tile.label}
                    </p>
                    <p className="text-2xl font-bold">
                      {tile.count.toLocaleString()}
                    </p>
                    <p className="text-xs opacity-70 truncate">
                      {tile.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {dashboardStats && (
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Ad Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StatusDistributionChart
                statusCounts={dashboardStats.statusCounts}
              />
            </CardContent>
          </Card>
        )}

        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Recent Activity</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total ads created today</span>
                  <span className="font-semibold text-blue-600">
                    {dashboardStats?.ads?.filter((ad: any) => {
                      const today = new Date().toDateString();
                      return new Date(ad.created_at).toDateString() === today;
                    }).length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Ads pending review</span>
                  <span className="font-semibold text-orange-600">
                    {inReviewCount}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Published this week</span>
                  <span className="font-semibold text-green-600">
                    {dashboardStats?.statusCounts.PUBLISHED || 0}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-6 w-96" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-28" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-5 w-5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
