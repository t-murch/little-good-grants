import { Browser, chromium } from 'playwright';
import { createWriteStream } from 'node:fs';
import { Grant, parseAmount } from '../types/grants';

type ScrapeRow = {
  clientRowID: string;
  [key: string]: string;
} & Grant;

type LeftPaneRowMap = {
  clientRowID: string;
  name: string;
};

export async function ladiesLaunchJob(): Promise<Grant[]> {
  const normalizedData: Grant[] = [];
  let browser: Browser | undefined = undefined;

  try {
    const startTime = Date.now();
    browser = await chromium.launch({});
    const page = await browser.newPage();

    const LADIES_LAUNCH_URL =
      'https://www.ladieswholaunch.org/small-business-grants';
    const airTableClass = '.airtable-embed';
    const returnPayload: { [key: string]: ScrapeRow } = {};

    await page.goto(LADIES_LAUNCH_URL);
    await page.waitForURL(LADIES_LAUNCH_URL);
    console.log('WENT TO THE URL: %s', LADIES_LAUNCH_URL);

    const tableContainer = page.frameLocator(airTableClass).first();
    const countText = await tableContainer
      .getByTestId('group-left-pane')
      .first()
      .locator('.count')
      .innerText();
    console.debug('Table displays %s Open Grants', countText);

    const leftPaneRows = tableContainer.getByTestId('data-row');
    const leftPaneRowCount = await leftPaneRows.count();
    const headerMap: { [key: string]: string } = {};

    // Build Map<columnId, category>
    const rightPanelHeaderContainer = tableContainer
      .locator('.headerRow.rightPane')
      .first();
    const rightPanelHeaderKeys =
      rightPanelHeaderContainer.locator('.cell.header');
    const rightPaneHeaderRowCount = await rightPanelHeaderKeys.count();

    for (let i = 0; i < rightPaneHeaderRowCount; i++) {
      const thisKey = rightPanelHeaderKeys.nth(i);
      const thisColumnId = await thisKey.getAttribute('data-columnid');
      const columnName = await thisKey.locator('.name').innerText();
      if (thisColumnId && columnName) headerMap[thisColumnId] = columnName;
    }

    const rightPanelData = tableContainer
      .locator('.dataRightPaneInnerContent.paneInnerContent')
      .locator('.dataRow.rightPane');
    const rightPanelRowCount = await rightPanelData.count();

    // Build initial list of rows with names
    for (let i = 0; i < leftPaneRowCount; i++) {
      const leftPaneRow: LeftPaneRowMap = {} as LeftPaneRowMap;
      const thisRow = leftPaneRows.nth(i);

      leftPaneRow.clientRowID =
        (await thisRow.getAttribute('data-rowid')) || '';
      const rawNameField = await thisRow.innerText();
      const normalNameField = rawNameField.slice(1).trimStart();
      leftPaneRow.name = normalNameField;

      if (!returnPayload?.[leftPaneRow.clientRowID]) {
        returnPayload[leftPaneRow.clientRowID] = leftPaneRow as ScrapeRow;
      }
    }

    for (let i = 0; i < rightPanelRowCount; i++) {
      const thisRow = rightPanelData.nth(i);
      const correspondingRowID = await thisRow.getAttribute('data-rowid');

      if (!correspondingRowID) break; // TO-DO: Add error logging/handling.

      const rowData = thisRow.locator('.cell.read');
      const rowPropertyCount = await rowData.count();

      for (let j = 0; j < rowPropertyCount; j++) {
        const thisProperty = rowData.nth(j);
        const thisColumnId = await thisProperty.getAttribute('data-columnid');

        if (!thisColumnId) break;
        const cellText = await thisProperty.innerText();

        if (returnPayload?.[correspondingRowID] && headerMap?.[thisColumnId]) {
          returnPayload[correspondingRowID][headerMap[thisColumnId]] = cellText;
        }
      }
    }

    // Process and filter the data
    normalizedData.push(
      ...Object.entries(returnPayload)
        .map(([_, grantRow]) => {
          const rowCopy = { ...grantRow } as { [key: string]: string };

          const cleanGrantDAO: Grant = {
            amount: parseAmount(rowCopy?.['Amount']),
            approved: 'no',
            deadline_date: rowCopy?.['Deadline'],
            description: rowCopy?.['Description'],
            industries_served: rowCopy?.['Industries Served'],
            name: rowCopy?.['name'],
            organization_name: rowCopy?.['Organization Name'],
            source: 'scrape',
            url: rowCopy?.['URL'],
          } as Grant;
          return cleanGrantDAO;
        })
        .filter((grant) => {
          const today = Date.now();
          const monthDayYearDueDate = grant.deadline_date.split('/');

          if (monthDayYearDueDate.length !== 3) return true;

          const parsedDeadline = new Date(
            parseInt(monthDayYearDueDate[2]),
            parseInt(monthDayYearDueDate[0]) - 1,
            parseInt(monthDayYearDueDate[1]),
          );

          return parsedDeadline.valueOf() > today;
        }),
    );

    // Log duration and results
    const duration = ((Date.now() - startTime) / 1000).toFixed(3);
    const streamDuration = createWriteStream('./timeResults.txt', {
      flags: 'a',
    });
    const streamResults = createWriteStream('./scrapeResults.json');
    streamDuration.write(duration + '--- \n');
    streamResults.write(JSON.stringify(normalizedData, null, 2));
    streamDuration.end();
    streamResults.end();
  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    if (browser) await browser.close();
    return normalizedData;
  }
}

// ladiesLaunchJob()
//   .then((result) => console.debug(result))
//   .catch((error) => console.error(error));
