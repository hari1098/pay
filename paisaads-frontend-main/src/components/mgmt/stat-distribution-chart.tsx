"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdStatus } from "@/lib/enum/ad-status";
import { useTheme } from "next-themes";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface StatusDistributionChartProps {
  statusCounts: {
    DRAFT: number;
    FOR_REVIEW: number;
    REJECTED: number;
    HOLD: number;
    YET_TO_BE_PUBLISHED: number;
    PUBLISHED: number;
    PAUSED: number;
  };
}

export function StatusDistributionChart({
  statusCounts,
}: StatusDistributionChartProps) {
  const { theme } = useTheme();

  const data = Object.entries(statusCounts)
    .map(([status, count]) => ({
      name: status.replace(/_/g, " "),
      value: count,
      color: getStatusColor(status as AdStatus),
    }))
    .filter((item) => item.value > 0); 

  function getStatusColor(status: AdStatus): string {
    switch (status) {
      case AdStatus.DRAFT:
        return "#f59e0b"; 
      case AdStatus.FOR_REVIEW:
        return "#3b82f6"; 
      case AdStatus.REJECTED:
        return "#ef4444"; 
      case AdStatus.HOLD:
        return "#8b5cf6"; 
      case AdStatus.YET_TO_BE_PUBLISHED:
        return "#10b981"; 
      case AdStatus.PUBLISHED:
        return "#22c55e"; 
      case AdStatus.PAUSED:
        return "#6b7280"; 
      default:
        return "#94a3b8"; 
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} ads`, "Count"]}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                    color: theme === "dark" ? "#f9fafb" : "#111827",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
