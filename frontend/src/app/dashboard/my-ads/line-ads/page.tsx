import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import MyAdsDataTable from "./my-ads-table";

export const metadata: Metadata = {
  title: "My Ads - PaisaAds",
  description: "Manage your advertisements",
};

export default function MyAdsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Line Ads</h1>
        <Button asChild>
          <Link href="/dashboard/post-ad/line-ad">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Ad
          </Link>
        </Button>
      </div>

      <MyAdsDataTable />
    </div>
  );
}
