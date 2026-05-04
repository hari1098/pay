"use client"
import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import api from "@/lib/api"
import { columns } from "./columns"

export default function MyAdsDataTable() {

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["myAds"],
    queryFn: async () => {
      try {
        const response = await api.get("/line-ad/my-ads")
        return response.data
      } catch (error) {
        console.error("Error fetching ads:", error)
        return []
      }
    },
  })

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="p-4">
          <Skeleton className="h-8 w-full mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (ads.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No advertisements yet</h3>
          <p className="text-muted-foreground mb-4">Create your first advertisement to get started.</p>
          <Button asChild>
            <Link href="/dashboard/post-ad/line-ad">Create Advertisement</Link>
          </Button>
        </div>
      </div>
    )
  }

  return <DataTable columns={columns} data={ads} searchColumn="content" searchPlaceholder="Search content..." />
}
