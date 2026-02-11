import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 850 } });
await page.goto('file:///Users/poyrazozsoy/Documents/GitHub/Eylul-1.-Ay/wrapped-story-lab.html');
await page.waitForTimeout(1100);

const shots = [0,1,2,3,6,15];
for (const idx of shots){
  await page.evaluate((i)=>{ if(window.gotoStory) window.gotoStory(i); }, idx);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `/Users/poyrazozsoy/Documents/GitHub/Eylul-1.-Ay/.tmp-last-${idx}.png`, fullPage: true });
}

const meta = await page.evaluate(async () => {
  const checkPos = (i) => {
    if(window.gotoStory) window.gotoStory(i);
    const content = document.querySelector('.content');
    const title = document.querySelector('.copyLine.title');
    const c = content?.getBoundingClientRect();
    const t = title?.getBoundingClientRect();
    return {
      i,
      classes: content?.className || '',
      relX: c && t ? ((t.x - c.x) / c.width).toFixed(2) : null,
      relY: c && t ? ((t.y - c.y) / c.height).toFixed(2) : null
    };
  };

  const p0 = checkPos(0);
  const p1 = checkPos(1);
  const p2 = checkPos(2);
  const p3 = checkPos(3);

  if(window.gotoStory) window.gotoStory(6);
  const num = document.querySelector('.copyLine.title');
  const lbl = document.querySelector('.copyLine.sub.statLabelLine');
  const ncs = num ? getComputedStyle(num) : null;
  const lcs = lbl ? getComputedStyle(lbl) : null;

  if(window.gotoStory) window.gotoStory(15);
  const beforeBg = getComputedStyle(document.querySelector('#storyBGA.on, #storyBGB.on')).backgroundImage;
  await new Promise(r=>setTimeout(r, 2400));
  const midBg = getComputedStyle(document.querySelector('#storyBGA.on, #storyBGB.on')).backgroundImage;
  await new Promise(r=>setTimeout(r, 8500));
  const lateBg = getComputedStyle(document.querySelector('#storyBGA.on, #storyBGB.on')).backgroundImage;

  const replay = document.querySelector('#sumReplayBtn');
  replay?.click();
  await new Promise(r=>setTimeout(r, 700));
  const replayWentStart = (document.querySelector('.copyLine.title')?.textContent || '').includes('41 gün');

  return {
    pos: [p0,p1,p2,p3],
    statNumColor: ncs?.color || null,
    statNumBg: ncs?.backgroundImage || null,
    statLabelBg: lcs?.backgroundImage || null,
    statLabelShadow: lcs?.textShadow || null,
    replayWentStart,
    bgChangedMid: beforeBg !== midBg,
    bgChangedLate: midBg !== lateBg
  };
});

console.log(JSON.stringify(meta, null, 2));
await browser.close();
