"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusVariant, truncateContent } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  X,
  Eye,
  Edit,
  FileImage,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import type { LineAd } from "@/lib/types/lineAd";
import { EditAdLink } from "@/components/mgmt/EditAdLink";
import { AdType } from "@/lib/enum/ad-type";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Zoom from "react-medium-image-zoom";
export const columns: ColumnDef<LineAd>[] = [
  {
    accessorKey: "sequenceNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const sequenceNumber = row.getValue("sequenceNumber") as number;
      return <div className="font-medium">LA00{sequenceNumber}</div>;
    },
  },
  {
    accessorKey: "customer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const customer = row.original.customer;
      return (
        <div className="space-y-1">
          <div className="font-medium">{customer.user?.name || "Unknown"}</div>
          <div className="text-xs text-muted-foreground">
            {customer.user?.phone_number || "No phone"}
          </div>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const nameA = rowA.original.customer.user?.name || "";
      const nameB = rowB.original.customer.user?.name || "";
      return nameA.localeCompare(nameB);
    },
  },
  {
    accessorKey: "mainCategory",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const mainCategory = row.original.mainCategory;
      const categoryOne = row.original.categoryOne;
      const categoryTwo = row.original.categoryTwo;
      const categoryThree = row.original.categoryThree;

      return (
        <div className="space-y-1">
          <div className="font-medium">{mainCategory.name}</div>
          {categoryOne && (
            <div className="text-xs text-muted-foreground">
              {categoryOne.name}
              {categoryTwo && ` > ${categoryTwo.name}`}
              {categoryThree && ` > ${categoryThree.name}`}
            </div>
          )}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.mainCategory.name.localeCompare(
        rowB.original.mainCategory.name
      );
    },
  },
  {
    accessorKey: "content",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Content
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="space-y-1">
        <div>{truncateContent(row.getValue("content"), 40)}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.city}, {row.original.state}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => {
      const images = row.original.images;
      if (!images || images.length === 0) {
        return <span className="text-muted-foreground text-xs">No images</span>;
      }

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <FileImage className="h-4 w-4 mr-1" />
              {images.length}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2">
            <div className="grid grid-cols-2 gap-2">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-md border"
                >
                  <Image
                    src={`/api/images?imageName=/${image.fileName}`}
                    alt={image.fileName}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "dates",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dates
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dates = row.original.dates;
      if (!dates || dates.length === 0) return "No dates";

      const sortedDates = [...dates]
        .map((dateStr) => new Date(dateStr))
        .sort((a, b) => a.getTime() - b.getTime());

      const datesByMonth: Record<string, Date[]> = {};
      sortedDates.forEach((date) => {
        const monthYear = format(date, "MMMM yyyy");
        if (!datesByMonth[monthYear]) {
          datesByMonth[monthYear] = [];
        }
        datesByMonth[monthYear].push(date);
      });

      const totalDates = dates.length;
      const firstDate = sortedDates[0];
      const lastDate = sortedDates[sortedDates.length - 1];

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-left justify-start"
            >
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {totalDates === 1
                  ? format(firstDate, "d MMM")
                  : totalDates <= 3
                  ? sortedDates.map((date) => format(date, "d")).join(", ") +
                    " " +
                    format(firstDate, "MMM")
                  : `${format(firstDate, "d MMM")} - ${format(
                      lastDate,
                      "d MMM"
                    )} (${totalDates})`}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                Selected Dates ({totalDates})
              </h4>
              <div className="max-h-48 overflow-y-auto">
                {Object.entries(datesByMonth).map(
                  ([monthYear, datesInMonth]) => {
                    const month = monthYear.split(" ")[0];
                    const year = monthYear.split(" ")[1];
                    const daysStr = datesInMonth
                      .map((date) => format(date, "d"))
                      .join(", ");
                    return (
                      <div key={monthYear} className="text-sm">
                        <span className="font-medium">{daysStr}</span> {month}{" "}
                        {year}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
    sortingFn: (rowA, rowB) => {
      const dateA =
        rowA.original.dates.length > 0
          ? new Date(rowA.original.dates[0]).getTime()
          : 0;
      const dateB =
        rowB.original.dates.length > 0
          ? new Date(rowB.original.dates[0]).getTime()
          : 0;
      return dateA - dateB;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={getStatusVariant(status) as any} className="capitalize">
          {status.replace(/_/g, " ").toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "payment",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const payment = row.original.payment;
      if (!payment) {
        return (
          <span className="text-muted-foreground text-xs">No payment</span>
        );
      }

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <span>{payment.method.toUpperCase()}</span>
              <span>₹{payment.amount}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Payment Details</h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-muted-foreground">Method:</div>
                  <div className="font-medium">
                    {payment.method.toUpperCase()}
                  </div>
                  <div className="text-muted-foreground">Amount:</div>
                  <div className="font-medium">₹{payment.amount}</div>
                  <div className="text-muted-foreground">Details:</div>
                  <div className="font-medium">{payment.details || "N/A"}</div>
                </div>
              </div>

              {payment.proof && (
                <div className="space-y-2">
                  <h4 className="font-medium">Payment Proof</h4>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border">
                    <Zoom>
                      <Image
                        src={`/api/images?imageName=${payment.proof.fileName}`}
                        alt="Payment proof"
                        fill
                        className="object-contain"
                      />
                    </Zoom>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
    sortingFn: (rowA, rowB) => {
      const paymentA = rowA.original.payment ? 1 : 0;
      const paymentB = rowB.original.payment ? 1 : 0;
      return paymentA - paymentB;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const ad = row.original;

      return (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/mgmt/dashboard/review-ads/line/view/${ad.id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <EditAdLink adId={ad.id} adType={AdType.LINE} from="published-ads">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </EditAdLink>
          </Button>
        </div>
      );
    },
  },
];
