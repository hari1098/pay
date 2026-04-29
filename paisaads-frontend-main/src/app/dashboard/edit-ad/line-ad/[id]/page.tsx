"use client";
import EditLineAdForm from "@/components/forms/edit-line-ad-form";
import { useParams } from "next/navigation";

export default function EditAdPage() {
  const params = useParams();
  return (
    <div className="space-y-6 mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Edit Advertisement</h1>
      </div>
      <EditLineAdForm adId={params.id as string} />
    </div>
  );
}
