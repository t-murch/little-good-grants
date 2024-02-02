'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Grant } from '@/app/types/grants';
import TooltipIcon from '/public/TooltipIcon.svg';
import { Checkbox } from '@/components/ui/checkbox';
import { tableFont } from '@/components/ui/table';

export const columns: ColumnDef<Grant>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <div className="whitespace-nowrap">{row.getValue('name')}</div>;
    },
  },
  {
    accessorKey: 'organization_name',
    header: 'Organization Name',
  },
  {
    accessorKey: 'deadline_date',
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          size={'sm'}
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Deadline
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url = row.getValue('url') as string;
      return (
        <a
          className={`flex flex-row whitespace-nowrap ${tableFont} text-blue-600`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          More info
          <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const myDescription = row.getValue('description');
      if (typeof myDescription === 'string' && myDescription.length > 46) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-row gap-1">
                  <div className="max-w-[8rem] overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {myDescription}
                  </div>
                  <Image
                    className="flex flex-col h-[16px] w-[16px]"
                    src={TooltipIcon}
                    alt="More Info Icon"
                    priority
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className={`max-w-md ${tableFont}`}>{myDescription}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      return (
        <div className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
          {row.getValue('description')}
        </div>
      );
    },
  },
  {
    accessorKey: 'industries_served',
    header: 'Industries Served',
  },
];

export const mobileDefaultColumnIDs = ['name', 'deadline', 'url', 'amount'];
export const mobileDefaultColumns = mobileDefaultColumnIDs.reduce(
  (acc: Record<string, boolean>, item) => {
    acc[item] = false;
    return acc;
  },
  {},
);

export const adminColumns: ColumnDef<Grant>[] = [
  ...columns,
  {
    accessorKey: 'approved',
    header: 'Approved',
    cell: ({ row }) => {
      const isApproved: boolean = row.getValue('approved');
      return (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={isApproved}
            onCheckedChange={() => 'CLICK -- Approved'}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'submitted',
    header: 'Submitted',
    cell: ({ row }) => {
      const isSubmitted: boolean = row.getValue('submitted');
      return (
        <div className="flex items-center justify-center">
          <Checkbox
            className="flex items-center justify-center"
            checked={isSubmitted}
            onCheckedChange={() => 'CLICK -- Submitted'}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'subDate',
    header: 'Submission Date',
  },
];
