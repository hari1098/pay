"use client";
import { EditVideoAdForm } from "@/components/forms/edit-video-ad-form";
import type { Metadata } from "next";
import { useParams } from "next/navigation";

export default function EditAdPage() {
  const params = useParams();
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Edit Video Ad</h1>
      </div>

      <EditVideoAdForm adId={params.id as string} />
    </div>
  );
}
