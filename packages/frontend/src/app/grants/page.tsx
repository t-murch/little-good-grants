import { getTableData } from '@/app/types/grants';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function GrantTable() {
  const data = await getTableData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
