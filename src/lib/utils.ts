import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { AdType } from "./enum/ad-type";
import { AdStatus } from "./enum/ad-status";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusVariant = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return "success";
    case "DRAFT":
      return "secondary";
    case "FOR_REVIEW":
    case "YET_TO_BE_PUBLISHED":
      return "warning";
    case "REJECTED":
      return "destructive";
    case "PAUSED":
      return "outline";
    default:
      return "default";
  }
};

export const truncateContent = (content: string, maxLength = 50) => {
  if (!content) return "";
  return content.length > maxLength
    ? `${content.substring(0, maxLength)}...`
    : content;
};

export const formatOrderId = (sequenceNumber: number, type: AdType) => {
  switch (type) {
    case AdType.LINE:
      return `LA${sequenceNumber.toString().padStart(4, "0")}`;
    case AdType.POSTER:
      return `PA${sequenceNumber.toString().padStart(4, "0")}`;
    case AdType.VIDEO:
      return `VD${sequenceNumber.toString().padStart(4, "0")}`;
    default:
      break;
  }
};

export const REVIEWER_STATUSES = [
  AdStatus.YET_TO_BE_PUBLISHED,
  AdStatus.HOLD,
  AdStatus.REJECTED,
];

export const EDITOR_STATUSES = [
  AdStatus.REJECTED,
  AdStatus.HOLD,
  AdStatus.PUBLISHED,
  AdStatus.PAUSED,
];

export const PAYMENT_METHODS = [
  "cash",
  "bank_transfer",
  "upi",
  "cheque",
  "other",
];

export const INDIA_ID = 101;

export const getMonthName = (date: Date) => {
  return format(date, "MMMM yyyy");
};

export const groupDatesByDay = (dates: string[]) => {
  if (!dates || dates.length === 0) return [];

  return dates
    .map((dateStr) => {
      const date = new Date(dateStr);
      return {
        date,
        day: Number.parseInt(format(date, "d")),
        dayName: format(date, "EEE"),
        month: format(date, "MMMM"),
        year: format(date, "yyyy"),
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};
