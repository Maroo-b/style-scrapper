import puppeteer, { Browser } from 'puppeteer';

export async function getAllCssProperties(url: string, selector: string): Promise<Record<string, string> | null> {
  let browser: Browser | null = null;

  try {
    // Launch a headless browser
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the page URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Evaluate the page content to get all CSS properties
    const cssProperties: Record<string, string> | null = await page.evaluate((selector: string) => {
      const element = document.querySelector(selector);
      if (!element) return null; // Return null if the element is not found

      // Get computed style of the element
      const computedStyle = window.getComputedStyle(element);

      // Convert the computed style to an object with all CSS properties
      const styleObject: Record<string, string> = {};
      for (let i = 0; i < computedStyle.length; i++) {
        const property = computedStyle[i];
        styleObject[property] = computedStyle.getPropertyValue(property);
      }
      return styleObject;
    }, selector);

    console.log('CSS Properties:', cssProperties);
    return cssProperties;

  } catch (error) {
    console.error('Error:', error);
    return null;

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function getAllFonts(url: string): Promise<string[]> {
  let browser: Browser | null = null;

  try {
    // Launch a headless browser
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the page URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Evaluate page to get all unique fonts
    const fonts: string[] = await page.evaluate(() => {
      // Use a Set to store unique font families
      const fontSet = new Set<string>();

      // Loop through all elements on the page
      document.querySelectorAll('*').forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const fontFamily = computedStyle.getPropertyValue('font-family');

        if (fontFamily) {
          fontSet.add(fontFamily);
        }
      });

      // Convert the Set to an Array to return
      return Array.from(fontSet);
    });

    console.log('Fonts found on the page:', fonts);
    return fonts;

  } catch (error) {
    console.error('Error:', error);
    return [];

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}