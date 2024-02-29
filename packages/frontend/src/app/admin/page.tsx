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

export default async function Page() {
  const displayName: 'AdminDashboard' = 'AdminDashboard';
  const allSubmissions: Grant[] = [];
  const allListings: Grant[] = [];

  await onLoad();

  async function onLoad() {
    const [freshSubmissions, freshListings] = await Promise.all([
      getUnapprovedGrants(),
      getApprovedGrants(),
    ]);

    allSubmissions.push(...freshSubmissions);
    allListings.push(...freshListings);
  }

  return (
    <main className="bg-secondary flex p-24 min-h-screen w-screen flex-col items-center justify-between bg-back">
      <div className="bg-gray-50 flex flex-col w-full rounded-md border border-purple-600 py-2">
        <section className="lg:h-auto py-2 px-4 flex flex-col rounded-md border">
          <article className="flex justify-between">
            <h2 className="font-bold text-xl">Grants Admin Dashboard</h2>
            <Logout />
          </article>
        </section>
        <section className="lg:h-auto lg:w-full p-2 flex flex-col rounded-md border border-purple-600">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold px-4">
                Pending Submissions {allSubmissions.length}
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <>
                  Rows of Submissions
                  <DataTable columns={adminColumns} data={allSubmissions} />
                </>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold px-4">
                Active Grants {allListings.length}
              </AccordionTrigger>
              <AccordionContent className="px-4">
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
