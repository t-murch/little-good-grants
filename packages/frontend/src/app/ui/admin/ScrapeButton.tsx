'use client';

import { scrapeLwlJob } from '@/app/lib/grantAPILib';

export default function ScrapeButton({
  jobName,
  action,
}: {
  jobName: string;
  action: any;
}) {
  return (
    <div className="flex flex-col md:flex-row w-full space-y-4 md:space-x-4 md:space-y-0">
      <button
        className="bg-primary text-white font-bold py-2 px-3 rounded-md"
        onClick={async () => {
          console.debug('action: Scrape LwL');
          const response = await action();
          console.debug('response: ', response);
          return 'Scrape LwL';
        }}
      >
        Scrape {jobName}
      </button>
    </div>
  );
}
