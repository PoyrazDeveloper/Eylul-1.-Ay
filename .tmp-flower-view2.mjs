import { chromium } from 'playwright';
import path from 'node:path';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
await page.goto('file://' + path.resolve('/Users/poyrazozsoy/Documents/GitHub/Eylul-1.-Ay/index.html') + '?dev=1');
await page.evaluate(()=>sceneSummary());
await page.waitForTimeout(5400);
await page.screenshot({ path:'/Users/poyrazozsoy/Documents/GitHub/Eylul-1.-Ay/.tmp-flower-view2.png', fullPage:true });
const m = await page.evaluate(()=>{
  const flower = document.querySelector('.summaryFlowerSvg')?.getBoundingClientRect();
  const dock = document.querySelector('.summaryFlowerDock')?.getBoundingClientRect();
  const body = document.querySelector('.summaryBody')?.getBoundingClientRect();
  return {
    flower: flower ? {x:Math.round(flower.left), y:Math.round(flower.top), w:Math.round(flower.width), h:Math.round(flower.height)}:null,
    dock: dock ? {x:Math.round(dock.left), y:Math.round(dock.top), w:Math.round(dock.width), h:Math.round(dock.height)}:null,
    body: body ? {x:Math.round(body.left), y:Math.round(body.top), w:Math.round(body.width), h:Math.round(body.height)}:null
  }
});
console.log(JSON.stringify(m,null,2));
await browser.close();
