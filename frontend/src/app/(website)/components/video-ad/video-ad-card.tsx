import Image from "next/image";
import { cn } from "@/lib/utils";
import { PosterAd } from "@/lib/types/posterAd";
import Zoom from "react-medium-image-zoom";
interface PosterAdCardProps {
  ad: PosterAd;
  className?: string;
}

export function PosterAdCard({ ad, className }: PosterAdCardProps) {
  if (!ad) return null;

  const mainCategory = ad.mainCategory?.name || "";
  const categoryOne = ad.categoryOne?.name || "";
  const categoryTwo = ad.categoryTwo?.name || "";
  const categoryThree = ad.categoryThree?.name || "";

  const location =
    ad.city && ad.state ? `${ad.city}, ${ad.state}` : ad.city || ad.state || "";

  const imageUrl = `/api/images?imageName=${ad.image.fileName}`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg shadow-md group",
        className
      )}
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Zoom>
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={`${mainCategory}`.trim()}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Zoom>

        {location && (
          <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
            {location}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-1 p-2">
        {mainCategory && (
          <span
            className="rounded bg-black/80 px-2 py-1 text-xs font-medium text-white"
            style={{
              backgroundColor:
                ad.mainCategory?.categories_color || "rgba(0,0,0,0.8)",
              color: ad.mainCategory?.font_color || "white",
            }}
          >
            {mainCategory}
          </span>
        )}

        {categoryOne && (
          <span
            className="rounded bg-black/80 px-2 py-1 text-xs font-medium text-white"
            style={{
              color: ad.categoryOne?.category_heading_font_color || "white",
            }}
          >
            {categoryOne}
          </span>
        )}

        {categoryTwo && (
          <span
            className="rounded bg-black/80 px-2 py-1 text-xs font-medium text-white"
            style={{
              color: ad.categoryTwo?.category_heading_font_color || "white",
            }}
          >
            {categoryTwo}
          </span>
        )}

        {categoryThree && (
          <span
            className="rounded bg-black/80 px-2 py-1 text-xs font-medium text-white"
            style={{
              color: ad.categoryThree?.category_heading_font_color || "white",
            }}
          >
            {categoryThree}
          </span>
        )}
      </div>
    </div>
  );
}
