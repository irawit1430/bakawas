import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`file://${path.resolve('bench.html')}`);

  await page.waitForFunction(() => {
    return document.getElementById('output').innerText !== 'Running...';
  }, { timeout: 10000 });

  const result = await page.evaluate(() => {
    return document.getElementById('output').innerText;
  });

  try {
    const data = JSON.parse(result);
    console.log('Baseline Unoptimized:', data.unoptimized.toFixed(2), 'ms');
    console.log('Baseline Optimized:', data.optimized.toFixed(2), 'ms');
    console.log('Improvement:', ((data.unoptimized - data.optimized) / data.unoptimized * 100).toFixed(2) + '%');
  } catch(e) {
    console.log('Error parsing output:', result);
  }

  await browser.close();
})();
