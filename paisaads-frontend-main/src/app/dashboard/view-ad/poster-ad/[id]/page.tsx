"use client";

import { useParams } from "next/navigation";
import { ViewAdForm } from "@/components/forms/view-ad-form";

export default function ViewAdPage() {
  const params: { id: string } = useParams();
  return <ViewAdForm adId={params.id} adType="poster" />;
}
