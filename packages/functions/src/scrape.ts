import handler from '@little-good-grants/core/handler';
import { ScrapeService } from '@little-good-grants/core/scrape';

export const lwl = handler(async (_event) => {
  return JSON.stringify(await ScrapeService.lwl());
});
