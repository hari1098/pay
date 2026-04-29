import type { Metadata } from "next";
import { PostAdForm } from "@/components/forms/post-ad-form";
import { PostPosterAdForm } from "@/components/forms/post-poster-ad-form";
import { PostVideoAdForm } from "@/components/forms/post-video-ad-form";

export const metadata: Metadata = {
  title: "Post Ad - PaisaAds",
  description: "Create a new advertisement",
};

export default function PostAdPage() {
  return (
    <div>
      <PostVideoAdForm />
    </div>
  );
}
