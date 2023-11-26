import { ColumnDef } from "@tanstack/react-table";

type ColumnHeaders = { Header: string; accessor: string };
const columns: ColumnDef<ColumnHeaders>[] = [
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
    header: "Deadline",
  },
  {
    accessorKey: "url",
    header: "URL",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "desciption",
    header: "Desciption",
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

const adminColumns: ColumnDef<ColumnHeaders>[] = [
  {
    accessorKey: "submitted",
    header: "Submitted",
  },
  {
    accessorKey: "subDate",
    header: "Submission Date",
  },
];
