import { adminColumns } from '@/app/grants/columns';
import { DataTable } from '@/app/grants/data-table';
import { Logout } from '@/app/ui/admin/Logout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Grant } from '../../../../core/src/types/grants';
import { getApprovedGrants, getUnapprovedGrants } from '../lib/grantAPILib';
import { onError } from '../lib/errorLib';

export default async function Page() {
  const displayName: 'AdminDashboard' = 'AdminDashboard';
  const allSubmissions: Grant[] = [];
  const allListings: Grant[] = [];

  await onLoad();

  async function onLoad() {
    let freshSubmissions: Grant[] = [],
      freshListings: Grant[] = [];
    try {
      [freshSubmissions, freshListings] = await Promise.all([
        getUnapprovedGrants(),
        getApprovedGrants(),
      ]);
    } catch (error) {
      onError(`${displayName}.onLoad`, error);
    }

    allSubmissions.push(...freshSubmissions);
    allListings.push(...freshListings);
  }

  return (
    <main className="bg-secondary flex min-h-screen w-screen flex-col items-center justify-between">
      <div className="w-full px-8 md:px-20 py-4">
        <section className="flex flex-col w-full space-y-4">
          <article className="flex justify-between">
            <div className="space-y-4 md:space-x-4 w-full">
              <div className="flex flex-col md:flex-row h-full w-full p-4 md:items-end rounded-md bg-gray-50 shadow-lg shadow-gray-50/50 opacity-75">
                <div className="grow justify-between space-x-2 flex-col md:flex-row md:space-x-0 md:space-y-2 rounded-md">
                  <h1 className="font-bold md:text-4xl">
                    Grants Admin Dashboard
                  </h1>
                </div>
                <Logout />
              </div>
            </div>
            {/* <h2 className="font-bold text-xl">Grants Admin Dashboard</h2> */}
          </article>
        </section>
        <section className="flex flex-col grow mt-4 w-full h-auto">
          {/* <section className="lg:h-auto lg:w-full p-2 flex flex-col rounded-md border border-purple-600"> */}
          <Accordion
            className="rounded-md overflow-hidden"
            type="single"
            collapsible
          >
            <AccordionItem className="rounded-t-md" value="item-1">
              <AccordionTrigger className="bg-white font-bold px-4">
                Pending Submissions {allSubmissions.length}
              </AccordionTrigger>
              <AccordionContent className="bg-white px-4">
                <>
                  Rows of Submissions
                  <DataTable columns={adminColumns} data={allSubmissions} />
                </>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              className="rounded-b-md overflow-hidden"
              value="item-2"
            >
              <AccordionTrigger className="bg-white font-bold px-4">
                Active Grants {allListings.length}
              </AccordionTrigger>
              <AccordionContent className="bg-white px-4">
                <>
                  Rows of Active Listings
                  <DataTable columns={adminColumns} data={allListings} />
                </>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </main>
  );
}
