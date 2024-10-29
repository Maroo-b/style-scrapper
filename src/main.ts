import express, { Request, Response } from 'express';
import { getAllFonts, getAllCssProperties } from './utils/scrapper.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());



async function buildPayload(url, selector) {
  const fonts = await getAllFonts(url);
  const cssProperties = await getAllCssProperties(url, selector);
  return {
    fonts: fonts,
    primaryButton: cssProperties
  };
}

// Sample route to get all items
app.get('/api/style/:siteUrl', async (req: Request, res: Response) => {
  const { siteUrl } = req.params;
  console.log('site:', siteUrl);
  // Validate if the provided URL is a valid URL
  const url = new URL(decodeURIComponent(siteUrl)); // Decode and validate the URL
  const payload = await buildPayload(url, 'form[action*="/cart/add"] button');
  res.json(payload);
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});