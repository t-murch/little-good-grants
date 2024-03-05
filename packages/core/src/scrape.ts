import { bulkInsert } from './grant';
import { ladiesLaunchJob } from './jobs/ladies-launch-job';

export async function lwl() {
  // We need to call the ladies launch job and await the resulting data
  // Then we take that data and call the bulk create grants job
  const data = await ladiesLaunchJob();
  console.debug('Data from ladies launch job', data);
  return 'Success';
  // return await bulkInsert(data);
}

export * as ScrapeService from './scrape';
