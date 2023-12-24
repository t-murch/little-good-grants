import { Grant } from '@/app/types/grants';
import { testData } from '@/app/ui/testing/grantlist';
import { columns } from './columns';
import { DataTable } from './data-table';

async function getTableData(): Promise<Grant[]> {
  return new Promise((resolve) =>
    setTimeout(() => {
      return resolve(testData);
    }, 1500),
  );
}

export default async function GrantTable() {
  const data = await getTableData();
  // console.info("how many rows of data=", data?.length);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
