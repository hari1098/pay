import Link from "next/link";
import { AdType } from "@/lib/enum/ad-type";
import { getEditRoute, type AdStatusPage } from "@/lib/navigation";

interface EditAdLinkProps {
  adId: string;
  adType: AdType;
  from: AdStatusPage;
  children: React.ReactNode;
  className?: string;
}

export function EditAdLink({ adId, adType, from, children, className }: EditAdLinkProps) {
  const href = getEditRoute(from, adType, adId);
  
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}