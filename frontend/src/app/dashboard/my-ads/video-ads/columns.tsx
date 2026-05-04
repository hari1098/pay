"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusVariant } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, X, Eye, Edit } from "lucide-react";
import { format } from "date-fns";
import { PaymentDialog } from "@/components/payment/payment-dialog";
import { PaymentDetailsDialog } from "@/components/payment/payment-details-dialog";
import Link from "next/link";
import { Payment } from "@/lib/types/payment";
import { AdType } from "@/lib/enum/ad-type";
import { VideoAd } from "@/lib/types/videoAd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";

export const columns: ColumnDef<VideoAd>[] = [
  {
    accessorKey: "sequenceNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("sequenceNumber")}</div>
    ),
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
          <div className="font-medium">{mainCategory?.name}</div>
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
    header: "Status",
    cell: ({ row }) => (

      <Badge variant={getStatusVariant(row.original.status) as any}>
        {row.original.status}
      </Badge>
    ),
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
      const payment = row.original.payment as Payment;
      console.log("payment", payment);
      if (payment) {

        return <PaymentDetailsDialog payment={payment} />;
      }

      return <PaymentDialog adId={row.original.id} type={AdType.VIDEO} />;
    },
    sortingFn: (rowA, rowB) => {
      const paymentA = rowA.original.payment ? 1 : 0;
      const paymentB = rowB.original.payment ? 1 : 0;
      return paymentA - paymentB;
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return isActive ? (
        <Check className="text-green-500" />
      ) : (
        <X className="text-red-500" />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/dashboard/view-ad/video-ad/${row.original.id}`}>
          <Button size="icon" variant="ghost">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/dashboard/edit-ad/video-ad/${row.original.id}`}>
          <Button size="icon" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];
