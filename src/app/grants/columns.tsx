"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../components/ui/button";
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
