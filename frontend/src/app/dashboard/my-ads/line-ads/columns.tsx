"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusVariant, truncateContent } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, X, Eye, Edit } from "lucide-react";
import { format } from "date-fns";
import { PaymentDialog } from "@/components/payment/payment-dialog";
import { PaymentDetailsDialog } from "@/components/payment/payment-details-dialog";
import Link from "next/link";
import { LineAd } from "@/lib/types/lineAd";
import { Payment } from "@/lib/types/payment";
import { AdStatus } from "@/lib/enum/ad-status";
import { AdType } from "@/lib/enum/ad-type";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import Zoom from 'react-medium-image-zoom'
export const columns: ColumnDef<LineAd>[] = [
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
        <div>{truncateContent(row.getValue("content"),20)}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.city}, {row.original.state}
        </div>
      </div>
    ),
  },
  {
    accessorKey:'images',
    header:()=>{
      return "Images"
    },
    cell:({row}) =>{
      {console.log(row.original.images)}
      return <div className="flex">
        
        {row.original.images.map((image) => <Zoom key={image.id}>
          <img className="size-12 aspect-square" src={`/api/images?imageName=${image.fileName}`}></img>
        </Zoom>)}
      </div>
    }
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
      const payment = row.original.payment as Payment;
      console.log("payment", payment);
      if (payment) {

        return <PaymentDetailsDialog payment={payment} />;
      }

      return <PaymentDialog type={AdType.LINE} adId={row.original.id} />;
    },
    sortingFn: (rowA, rowB) => {
      const paymentA = rowA.original.payment ? 1 : 0;
      const paymentB = rowB.original.payment ? 1 : 0;
      return paymentA - paymentB;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const ad = row.original;
      const canEdit = ad.status === "DRAFT" || ad.status === "HOLD";

      return (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/dashboard/view-ad/line-ad/${ad.id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Link>
          </Button>

          {canEdit ? (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/dashboard/edit-ad/line-ad/${ad.id}`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled
              title="Cannot edit this ad"
            >
              <Edit className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
        </div>
      );
    },
  },
];
