import { bulkInsert } from "./grant";
import { ladiesLaunchJob } from "./jobs/ladies-launch-job";
import { hydrateGrant } from "./types/grants";

export async function lwl(): Promise<{ status: string }> {
  // We need to call the ladies launch job and await the resulting data
  // Then we take that data and call the bulk create grants job
  const data = await ladiesLaunchJob();

  // Normalize the data into Grant Type
  const normalizedData = data.map((row) => hydrateGrant(row, "scrape"));
  // console.debug("Data from ladies launch job", normalizedData);
  return await bulkInsert(normalizedData);
}

export * as ScrapeService from "./scrape";
