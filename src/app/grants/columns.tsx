"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Grant } from "../types/grants";

export const columns: ColumnDef<Grant>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "orgName",
    header: "Organization Name",
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => {
      return (
        <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Deadline
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "url",
    header: "URL",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const myDescription = row.getValue("description");
      if (typeof myDescription === "string" && myDescription.length > 46) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">{myDescription}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-md">{myDescription}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      return <div className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">{row.getValue("description")}</div>;
    },
  },
  {
    accessorKey: "popServed",
    header: "Population Served",
  },
  {
    accessorKey: "indServed",
    header: "Industries Served",
  },
];

export const mobileDefaultColumnIDs = ["name", "deadline", "url", "amount"];
export const mobileDefaultColumns = mobileDefaultColumnIDs.reduce((acc: Record<string, boolean>, item) => {
  acc[item] = false;
  return acc;
}, {});

const adminColumns: ColumnDef<Grant>[] = [
  {
    accessorKey: "submitted",
    header: "Submitted",
  },
  {
    accessorKey: "subDate",
    header: "Submission Date",
  },
];
