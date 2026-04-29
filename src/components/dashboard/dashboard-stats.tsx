"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import {
  BarChart2,
  CheckCircle2,
  FileText,
  Eye,
  PauseCircle,
  XCircle,
  Image,
  List,
  Clock,
  Video,
} from "lucide-react";

interface DashboardStats {
  totalAds: number;
  statusCounts: {
    DRAFT: number;
    FOR_REVIEW: number;
    REJECTED: number;
    HOLD: number;
    YET_TO_BE_PUBLISHED: number;
    PUBLISHED: number;
    PAUSED: number;
  };
  ads: any[];
  videoAds: number;
  posterAds: number;
  lineAds: number;
}

const statusMeta = [
  {
    label: "TOTAL",
    icon: BarChart2,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "PUBLISHED",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800",
  },
  {
    label: "DRAFT",
    icon: FileText,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    label: "IN REVIEW",
    icon: Eye,
    color: "bg-blue-100 text-blue-800",
  },
  {
    label: "PAUSED",
    icon: PauseCircle,
    color: "bg-gray-100 text-gray-800",
  },
  {
    label: "REJECTED",
    icon: XCircle,
    color: "bg-red-100 text-red-800",
  },
];

export default function DashboardStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await api.get<DashboardStats>("/ad-dashboard/user");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="shadow-md">
            <CardContent className="p-6">
              <Skeleton className="h-7 w-20 mb-2" />
              <Skeleton className="h-9 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const inReviewCount =
    (data?.statusCounts.FOR_REVIEW || 0) +
    (data?.statusCounts.YET_TO_BE_PUBLISHED || 0);

  const lastAdDate = data?.ads?.length
    ? new Date(
        Math.max(...data.ads.map((ad) => new Date(ad.created_at).getTime()))
      )
    : null;

  const tiles = [
    {
      ...statusMeta[0],
      count: data?.totalAds || 0,
    },
    {
      ...statusMeta[1],
      count: data?.statusCounts.PUBLISHED || 0,
    },
    {
      ...statusMeta[2],
      count: data?.statusCounts.DRAFT || 0,
    },
    {
      ...statusMeta[3],
      count: inReviewCount,
    },
    {
      ...statusMeta[4],
      count: data?.statusCounts.PAUSED || 0,
    },
    {
      ...statusMeta[5],
      count: data?.statusCounts.REJECTED || 0,
    },
  ];

  const extraTiles = [
    {
      label: "Poster Ads",
      icon: Image,
      count: data?.posterAds || 0,
      color: "bg-purple-100 text-purple-800",
    },
    {
      label: "Line Ads",
      icon: List,
      count: data?.lineAds,
      color: "bg-pink-100 text-pink-800",
    },
    {
      label: "Video Ads",
      icon: Video,
      count: data?.videoAds,
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Last Ad Posted",
      icon: Clock,
      count: lastAdDate
        ? lastAdDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "-",
      color: "bg-gray-50 text-gray-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {tiles.map((tile) => (
        <Card
          key={tile.label}
          className={`shadow-md border ${tile.color} flex flex-col items-start justify-between`}
        >
          <CardContent className="px-5 pb-1 flex flex-col items-start">
            <div className="rounded-full p-2 mb-3 bg-white/60 flex items-center justify-center">
              <tile.icon className="h-7 w-7" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1">
              {tile.label}
            </p>
            <p className="text-3xl font-bold">{tile.count}</p>
          </CardContent>
        </Card>
      ))}
      {extraTiles.map((tile) => (
        <Card
          key={tile.label}
          className={`shadow-md border ${tile.color} flex flex-col items-start justify-between`}
        >
          <CardContent
            className="px-5 pb-1
           flex flex-col items-start"
          >
            <div className="rounded-full p-2 mb-3 bg-white/60 flex items-center justify-center">
              <tile.icon className="h-7 w-7" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1">
              {tile.label}
            </p>
            <p className="text-2xl font-bold">{tile.count}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
