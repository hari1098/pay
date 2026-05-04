"use client";

import { PaymentDetailsDialog } from "@/components/payment/payment-details-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { VideoAd } from "@/lib/types/videoAd";
import { getStatusVariant } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Eye, Calendar } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<VideoAd>[] = [
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
      return <div className="font-medium">VA00{sequenceNumber}</div>;
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
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Position
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="">{row.original.position.pageType}</div>;
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
    accessorKey: "comments",
    header: "Rejection Reason",
    cell: ({ row }) => {
      const comments = row.original.comments;

      const rejectionComment = comments?.find(
        (comment: any) => comment.actionType === "REJECTED"
      );

      if (!rejectionComment?.comment) {
        return (
          <span className="text-muted-foreground text-xs">
            No reason provided
          </span>
        );
      }

      return (
        <div className="max-w-xs">
          <p
            className="text-sm text-red-600 truncate"
            title={rejectionComment.comment}
          >
            {rejectionComment.comment}
          </p>
        </div>
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

      return <PaymentDetailsDialog payment={payment} />;
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
            <Link href={`/mgmt/dashboard/review-ads/video/view/${ad.id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Link>
          </Button>
        </div>
      );
    },
  },
];
