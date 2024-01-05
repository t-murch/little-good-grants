import { getUnapprovedSubmissions } from '@/app/actions/grants';
import { createClient } from '@/app/actions/supabase';
import { adminColumns, columns } from '@/app/grants/columns';
import { DataTable } from '@/app/grants/data-table';
import { grantDAOtoGrant } from '@/app/types/grants';
import { Logout } from '@/app/ui/admin/Logout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = cookies();
  const supabaseClient = createClient(cookieStore);
  const allSubmissions = (await getUnapprovedSubmissions(() => supabaseClient)) ?? [];
  console.log('Grant Rows Count = ', allSubmissions?.length);

  return (
    <main className="flex p-24 min-h-screen w-screen flex-col items-center justify-between bg-back">
      <div className="flex flex-col w-full rounded-md border border-purple-600 py-2">
        <section className="lg:h-auto py-2 px-4 flex flex-col rounded-md border">
          <article className="flex justify-between">
            <h2 className="font-bold text-xl">Grants Admin Dashboard</h2>
            <Logout />
          </article>
        </section>
        <section className="lg:h-auto lg:w-full p-2 flex flex-col rounded-md border border-purple-600">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className='font-bold px-4'>Pending Submissions {allSubmissions.length}</AccordionTrigger>
              <AccordionContent className='px-4'>
                <>
                  Rows of Submissions
                  <DataTable columns={adminColumns} data={grantDAOtoGrant(allSubmissions)} />
                </>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className='font-bold px-4'>Active Grants {allSubmissions.length}</AccordionTrigger>
              <AccordionContent className='px-4'>
                <>
                  Rows of Submissions
                  <DataTable columns={adminColumns} data={grantDAOtoGrant(allSubmissions)} />
                </>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </main>
  );
}
