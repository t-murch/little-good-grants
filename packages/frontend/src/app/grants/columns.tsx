'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { tableFont } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { put } from 'aws-amplify/api';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Grant } from '../../../../core/src/types/grants';
import { onError } from '../lib/errorLib';
import TooltipIcon from '/public/TooltipIcon.svg';

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
          size={'sm'}
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Deadline
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('deadline_date'));
      const deadlineType = String(row.original.deadline_type);

      if (isNaN(date.getDate())) {
        return <div className="pl-3">{deadlineType}</div>;
      }

      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return <div className="pl-3">{`${month}-${day}-${year}`}</div>;
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
      const amount = row.getValue('amount');
      if (typeof amount === 'string' && amount.length > 0) {
        return <div className="pl-4 font-medium">{amount}</div>;
      }
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(amount));

      return <div className="pl-4 font-medium">{formatted}</div>;
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
          {typeof myDescription === 'string' && myDescription.length > 0
            ? myDescription
            : 'No description available'}
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
  // column for date added
  {
    accessorKey: 'date_added',
    header: 'Date Added',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date_added'));
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return <div className="pl-3">{`${month}-${day}-${year}`}</div>;
    },
  },
  {
    accessorKey: 'approved',
    header: 'Approved',
    cell: ({ row }) => {
      const grant = row.original;
      const isApproved = grant.approved;
      async function toggleApproval(grant: Grant) {
        grant.approved = isApproved === 'yes' ? 'no' : 'yes';

        try {
          const { body } = await put({
            apiName: 'grants',
            path: `/grant/${grant.id}`,
            options: {
              body: { grant },
            },
          }).response;

          console.debug('\n body= ', body + '\n');
          const data = JSON.parse(await body.text());
          console.debug('data: ', data);

          return data;
        } catch (error) {
          return onError('DataTable.toggleApproval', error);
        }
      }

      return (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={isApproved === 'yes'}
            onCheckedChange={async () => {
              console.log('CLICK -- Approved');
              const response = await toggleApproval(grant);
              console.log('\n response= ', response + '\n');
            }}
          />
        </div>
      );
    },
  },
];
