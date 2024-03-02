import { columns } from '@/app/grants/columns';
import { DataTable } from '@/app/grants/data-table';
import { HeaderNav } from '@/app/ui/home/headernav';
import { SuggestionForm } from '@/app/ui/home/suggestionForm';

import { runWithAmplifyServerContext } from '../app/utils/amplifyServerUtils';
import { get } from 'aws-amplify/api/server';
import { Grant } from '../../../core/src/types/grants';
import { cookies } from 'next/headers';
import { onError } from './lib/errorLib';

export default async function Page() {
  const displayName: 'Home' = 'Home';
  const tableData: Grant[] = [];

  await loadTableData();

  async function loadTableData() {
    return await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => {
        try {
          const { body } = await get(contextSpec, {
            apiName: 'grants',
            path: '/grants/listings',
          }).response;

          // console.log('body= \n', body);
          // console.log('body.json()= \n', await body.json());
          tableData.push(...((await body.json()) as Grant[]));
        } catch (error) {
          onError(`${displayName}.loadTableData`, error);
        }
      },
    });
  }

  return (
    <main className="bg-secondary flex min-h-screen w-screen flex-col items-center justify-between">
      <div className="w-full px-8 md:px-20 py-4">
        <div className="flex flex-col space-y-4">
          <HeaderNav />
          <p>
            Integer nunc diam, hendrerit sed nibh ut, congue pretium tellus.
            Aenean nec enim in purus porta hendrerit sit amet sit amet purus.
            Sed et enim at mauris rutrum semper at non diam. Sed vitae massa
            varius arcu mattis commodo eu elementum turpis. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Nam pretium in risus eu auctor. Integer sed ex ut
            tellus faucibus bibendum. Donec ultricies augue in nisl tristique
            vestibulum. Maecenas a est ut mauris volutpat semper in nec ex.
            Mauris interdum mi nec tortor accumsan euismod.{' '}
          </p>
        </div>
        <article className="flex flex-col grow space-y-4 w-full h-auto">
          <DataTable columns={columns} data={tableData} />
          <SuggestionForm />
        </article>
      </div>
    </main>
  );
}
