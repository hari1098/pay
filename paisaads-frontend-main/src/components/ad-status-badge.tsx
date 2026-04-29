import { Badge } from "@/components/ui/badge";
import { AdStatus } from "@/lib/enum/ad-status";

interface AdStatusBadgeProps {
  status: AdStatus;
}

export function AdStatusBadge({ status }: AdStatusBadgeProps) {
  switch (status) {
    case AdStatus.PUBLISHED:
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>
      );
    case AdStatus.DRAFT:
      return <Badge className="bg-gray-500 hover:bg-gray-600">Draft</Badge>;
    case AdStatus.FOR_REVIEW:
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">For Review</Badge>
      );
    case AdStatus.REJECTED:
      return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
    case AdStatus.HOLD:
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600">On Hold</Badge>
      );
    case AdStatus.YET_TO_BE_PUBLISHED:
      return <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>;
    case AdStatus.PAUSED:
      return (
        <Badge className="bg-purple-500 hover:bg-purple-600">Paused</Badge>
      );
    default:
      return <Badge>Unknown</Badge>;
  }
}

export function getStatusLabel(status: AdStatus): string {
  switch (status) {
    case AdStatus.PUBLISHED:
      return "Published";
    case AdStatus.DRAFT:
      return "Draft";
    case AdStatus.FOR_REVIEW:
      return "For Review";
    case AdStatus.REJECTED:
      return "Rejected";
    case AdStatus.HOLD:
      return "On Hold";
    case AdStatus.YET_TO_BE_PUBLISHED:
      return "Scheduled";
    case AdStatus.PAUSED:
      return "Paused";
    default:
      return "Unknown";
  }
}

export function getStatusColor(status: AdStatus): string {
  switch (status) {
    case AdStatus.PUBLISHED:
      return "green";
    case AdStatus.DRAFT:
      return "gray";
    case AdStatus.FOR_REVIEW:
      return "yellow";
    case AdStatus.REJECTED:
      return "red";
    case AdStatus.HOLD:
      return "orange";
    case AdStatus.YET_TO_BE_PUBLISHED:
      return "blue";
    case AdStatus.PAUSED:
      return "purple";
    default:
      return "gray";
  }
}
