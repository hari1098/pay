import Image from "next/image";
import { cn } from "@/lib/utils";
import { PosterAd } from "@/lib/types/posterAd";

interface PosterAdCardProps {
  ad: PosterAd;
  className?: string;
}

export function PosterAdCard({ ad, className }: PosterAdCardProps) {
  if (!ad) return null;

  const mainCategory = ad.mainCategory?.name || "";

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
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`${mainCategory}`.trim()}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-2 text-sm text-white font-semibold bg-black/80 rounded-b-lg">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {[ad.mainCategory, ad.categoryOne, ad.categoryTwo, ad.categoryThree]
            .filter(Boolean)
            .map((category, idx, arr) => (
              <span key={category?.id || idx}>
                {category?.name}
                {idx < arr.length - 1 && <span className="mx-1">|</span>}
              </span>
            ))}
        </div>
        {location && (
          <span className="ml-4 whitespace-nowrap text-white font-semibold">
            {location}
          </span>
        )}
      </div>
    </div>
  );
}
