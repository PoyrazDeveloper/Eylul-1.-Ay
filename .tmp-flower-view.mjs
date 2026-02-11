import { chromium } from 'playwright';
import path from 'node:path';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
await page.goto('file://' + path.resolve('/Users/poyrazozsoy/Documents/GitHub/Eylul-1.-Ay/index.html') + '?dev=1');
await page.evaluate(()=>sceneSummary());
await page.waitForTimeout(5200);
await page.screenshot({ path:'/Users/poyrazozsoy/Documents/GitHub/Eylul-1.-Ay/.tmp-flower-view.png', fullPage:true });
const metrics = await page.evaluate(()=>{
  const card = document.querySelector('.summaryCard')?.getBoundingClientRect();
  const flower = document.querySelector('.summaryFlowerSvg')?.getBoundingClientRect();
  const dock = document.querySelector('.summaryFlowerDock')?.getBoundingClientRect();
  return {
    card: card ? {w: Math.round(card.width), h: Math.round(card.height)} : null,
    dock: dock ? {x: Math.round(dock.left), y: Math.round(dock.top), w: Math.round(dock.width), h: Math.round(dock.height)} : null,
    flower: flower ? {x: Math.round(flower.left), y: Math.round(flower.top), w: Math.round(flower.width), h: Math.round(flower.height)} : null
  }
});
console.log(JSON.stringify(metrics,null,2));
await browser.close();
