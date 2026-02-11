import { chromium } from 'playwright';
import path from 'node:path';

const filePath = path.resolve('/Users/poyrazozsoy/Documents/GitHub/Eylul-1.-Ay/wrapped-story-lab.html');
const url = `file://${filePath}`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(700);

const grab = async (name) => {
  await page.screenshot({ path: `/Users/poyrazozsoy/Documents/GitHub/Eylul-1.-Ay/${name}`, fullPage: true });
};

await grab('.tmp-story-0.png');

for (let i = 1; i <= 15; i++) {
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(450);
  if ([2,4,6,8,10,12,14,15].includes(i)) {
    await grab(`.tmp-story-${i}.png`);
  }
}

const summaryInfo = await page.evaluate(() => {
  const bgImg = document.querySelector('.summaryStory .sumPhoto img.on')?.src || '';
  const replayVisible = !!document.querySelector('#sumReplayBtn');
  const contentClass = document.querySelector('#content')?.className || '';
  const line = Array.from(document.querySelectorAll('.copyLine')).map((n) => ({
    text: n.textContent?.trim(),
    cls: n.className,
    color: getComputedStyle(n).color,
    fill: getComputedStyle(n).webkitTextFillColor,
  }));
  return { bgImg, replayVisible, contentClass, lineCount: line.length };
});

await page.waitForTimeout(10150);
const summaryInfoAfter = await page.evaluate(() => {
  const bgImg = document.querySelector('.storyBG.on')?.style.backgroundImage || '';
  return { bgImg };
});

await page.click('#sumReplayBtn');
await page.waitForTimeout(500);
const replayState = await page.evaluate(() => {
  const hasReplay = !!document.querySelector('#sumReplayBtn');
  const firstTitle = document.querySelector('.copyLine.title')?.textContent?.trim() || '';
  return { hasReplay, firstTitle };
});

console.log(JSON.stringify({ summaryInfo, summaryInfoAfter, replayState }, null, 2));
await browser.close();
