import {chromium} from '@playwright/test';
import sharp from 'sharp';
import {server} from './preview.mjs';
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
  page.on('pageerror',error=>console.error(error));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.locator('#load-scene').click();
  await page.waitForFunction(()=>document.querySelector('#camp-showcase').dataset.state==='ready');
  await page.evaluate(()=>{const stage=document.querySelector('#camp-showcase');stage.style.cssText='width:1200px;height:1000px;border:0;border-radius:0;position:fixed;top:0;left:0;z-index:9999';document.querySelector('.scene-corner').hidden=true;});
  await page.waitForTimeout(250);
  const png=await page.locator('#camp-showcase').screenshot();
  await sharp(png).webp({quality:84}).toFile('assets/showcase/camp-poster.webp');
  console.log(JSON.stringify(await page.locator('#camp-showcase').evaluate(e=>({...e.dataset,bytes:e.querySelector('canvas').width*e.querySelector('canvas').height}))));
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
