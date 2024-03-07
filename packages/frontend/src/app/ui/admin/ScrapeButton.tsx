'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ScrapeButton({
  jobName,
  action,
}: {
  jobName: string;
  action: any;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleAction() {
    setIsLoading(true);
    console.debug('action: Scrape LwL');

    try {
      const response = await action();
      console.debug('response: ', response);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-full space-y-4 md:space-x-4 md:space-y-0">
      {/* Set a loading style on the button */}
      <Button disabled={isLoading} onClick={handleAction}>
        {isLoading ? 'Crawling...' : `Scrape ${jobName}`}
      </Button>
    </div>
  );
}
