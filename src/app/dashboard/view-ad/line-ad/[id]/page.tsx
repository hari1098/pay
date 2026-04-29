"use client";

import EditLineAdForm from "@/components/forms/edit-line-ad-form";
import { ViewAdForm } from "@/components/forms/view-ad-form";
import { useParams } from "next/navigation";

export default function ViewAdPage() {
  const params: { id: string } = useParams();
  return <ViewAdForm adId={params.id} adType="line" />;
}
