import type { Metadata } from "next";
import { PostAdForm } from "@/components/forms/post-ad-form";
import { PostPosterAdForm } from "@/components/forms/post-poster-ad-form";

export const metadata: Metadata = {
  title: "Post Ad - PaisaAds",
  description: "Create a new advertisement",
};

export default function PostAdPage() {
  return (
    <div className="space-y-6 ">
      <PostPosterAdForm />
    </div>
  );
}
