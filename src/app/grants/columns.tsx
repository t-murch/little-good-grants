'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import { Grant } from '../types/grants';
import TooltipIcon from '/public/TooltipIcon.svg';

export const columns: ColumnDef<Grant>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'organization_name',
    header: 'Organization Name',
  },
  {
    accessorKey: 'deadline_date',
    header: ({ column }) => {
      return (
        <Button variant={'ghost'} onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Deadline
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button variant={'ghost'} onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
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
                  <div className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">{myDescription}</div>
                  <Image className="flex flex-col h-[16px] w-[16px]" src={TooltipIcon} alt="More Info Icon" priority />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-md">{myDescription}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      return <div className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">{row.getValue('description')}</div>;
    },
  },
  {
    accessorKey: 'industries_served',
    header: 'Industries Served',
  },
];

export const mobileDefaultColumnIDs = ['name', 'deadline', 'url', 'amount'];
export const mobileDefaultColumns = mobileDefaultColumnIDs.reduce((acc: Record<string, boolean>, item) => {
  acc[item] = false;
  return acc;
}, {});

const adminColumns: ColumnDef<Grant>[] = [
  {
    accessorKey: 'submitted',
    header: 'Submitted',
  },
  {
    accessorKey: 'subDate',
    header: 'Submission Date',
  },
];
