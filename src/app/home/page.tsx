import { columns } from '@/app/grants/columns';
import { DataTable } from '@/app/grants/data-table';
import { Grant, getTableData } from '@/app/types/grants';
import { HeaderNav } from '@/app/ui/home/headernav';
import { SuggestionForm } from '@/app/ui/home/suggestionForm';

export default async function Page() {
  const tableData: Grant[] = [];
  const testData = await getTableData();
  tableData.push(...testData);

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-between">
      <HeaderNav />
      <article className="flex flex-col grow px-8 md:px-20 py-4 space-y-4 w-full h-auto">
        <p>
          Integer nunc diam, hendrerit sed nibh ut, congue pretium tellus. Aenean nec enim in purus porta hendrerit sit amet sit amet purus. Sed et enim at mauris rutrum semper at
          non diam. Sed vitae massa varius arcu mattis commodo eu elementum turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
          Nam pretium in risus eu auctor. Integer sed ex ut tellus faucibus bibendum. Donec ultricies augue in nisl tristique vestibulum. Maecenas a est ut mauris volutpat semper
          in nec ex. Mauris interdum mi nec tortor accumsan euismod.{' '}
        </p>
        <DataTable columns={columns} data={tableData} />
        <SuggestionForm />
      </article>
    </main>
  );
}
