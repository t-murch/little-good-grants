import { chromium } from 'playwright';

async function scrapeNestedIframe() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the main page
    await page.goto('https://www.example.com');

    // Locate and switch to the iframe
    const iframeHandle = await page.waitForSelector('iframe');
    const iframeContent = await iframeHandle.contentFrame();

    // Now you can interact with elements within the iframe
    const nestedContent = await iframeContent.$eval(
      'selector-inside-iframe',
      (element) => element.textContent.trim(),
    );

    console.log('Nested Content:', nestedContent);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Call the scraping function
scrapeNestedIframe();
