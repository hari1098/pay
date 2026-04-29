"use client";
import EditPosterAd from "@/app/mgmt/dashboard/review-ads/poster/edit/[id]/page";
import EditPosterAdForm from "@/components/forms/edit-poster-ad-form";
import type { Metadata } from "next";
import { useParams } from "next/navigation";

export default function EditAdPage() {
  const params = useParams();
  return (
    <div className="">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Edit Line Ad</h1>
      </div>

      <EditPosterAdForm adId={params.id as string} />
    </div>
  );
}
