const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));
  
  try {
    await page.goto('http://localhost:4173');
    await new Promise(r => setTimeout(r, 2000));
    
    const html = await page.content();
    if (html.includes('id="root"></div>')) {
        console.log('ROOT DIV IS EMPTY');
    } else {
        console.log('ROOT DIV HAS CONTENT');
    }
  } catch (err) {
    console.error('PUPPETEER ERROR:', err.message);
  }
  
  await browser.close();
  process.exit(0);
})();
