'use client';

import useWindowSize from '@/app/utils/useWindowSize';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  RowData,
  SortingState,
  TableMeta,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { Grant } from '../../../../core/src/types/grants';
import { toggleApproval } from '../lib/grantAPILib';
import { onError } from '../lib/errorLib';

interface DataTableProps<TData extends Grant, TValue> {
  // columns: ColumnDef<TData, TValue>[];
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    handleApproval: (grant: Grant) => void;
  }
}

export function DataTable<TData, TValue>({
  columns: columnsProps,
  data: dataProp,
}: DataTableProps<Grant, TValue>) {
  const [tableData, setTableData] = React.useState(dataProp);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const { width } = useWindowSize();
  const isMobile = width && width < 768;

  const data = React.useMemo(() => tableData, [tableData]);

  const columns = React.useMemo(() => columnsProps, [columnsProps]);

  const handleApproval = async (grant: Grant) => {
    // Filter out the grant from the list and update the state
    const newList = tableData.filter((g) => g.id !== grant.id);
    setTableData(newList);

    // Call the API to update the grant
    try {
      const updateResponse = await toggleApproval(grant);
    } catch (error) {
      onError('toggleApproval', error);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      // columnVisibility: mobileDefaultColumns,
      pagination: { pageIndex: 0, pageSize: 25 },
    },
    meta: {
      handleApproval: handleApproval,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <>
      <div className="flex h-auto items-center py-4 md:py-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                // This is a mobile-only feature of the table and we want to
                // Mount the shortened Table with a limited set of options.
                // if (!mobileDefaultColumnIDs.includes(column.id)) column.toggleVisibility(false);
                // else column.toggleVisibility(true);
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.columnDef.header as string}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border border-black my-2 overflow-hidden ">
        <Table>
          <TableHeader className="sticky top-0 bg-stone-950 hover:bg-stone-950">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-xs text-gray-50" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-gray-50">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="h-12" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
