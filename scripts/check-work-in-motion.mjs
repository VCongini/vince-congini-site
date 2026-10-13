import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const require = createRequire(import.meta.url);
const playwright = require(
  process.env.PLAYWRIGHT_MODULE_PATH
    || '/Users/vincentcongini/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
);
const browserPath = process.env.PLAYWRIGHT_BROWSER_PATH
  || '/Users/vincentcongini/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const sourceRoot = join(process.cwd(), 'src');
const mimeTypes = {
  '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.mp4': 'video/mp4',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2'
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function startServer() {
  const server = createServer(async (request, response) => {
    const requestedPath = request.url === '/' ? '/index.html' : request.url.split('?')[0];
    const filePath = normalize(join(sourceRoot, requestedPath));
    if (!filePath.startsWith(sourceRoot)) {
      response.writeHead(403).end();
      return;
    }
    try {
      const file = await readFile(filePath);
      const headers = { 'content-type': mimeTypes[extname(filePath)] || 'application/octet-stream', 'accept-ranges': 'bytes' };
      const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range || '');
      if (range) {
        const start = Number(range[1]);
        const end = range[2] ? Math.min(Number(range[2]), file.length - 1) : file.length - 1;
        if (start > end) { response.writeHead(416).end(); return; }
        response.writeHead(206, { ...headers, 'content-range': `bytes ${start}-${end}/${file.length}`, 'content-length': end - start + 1 });
        response.end(file.subarray(start, end + 1));
      } else {
        response.writeHead(200, { ...headers, 'content-length': file.length });
        response.end(file);
      }
    } catch (error) {
      response.writeHead(404).end();
    }
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function checkViewport(page, baseUrl, viewport, expectedSource, rotatedViewport, expectLandscape) {
  const mp4Requests = [];
  await page.setViewportSize(viewport);
  await page.route('**/*.mp4', async (route) => {
    mp4Requests.push(route.request().url());
    await route.fulfill({ status: 204 });
  });
  await page.goto(baseUrl);

  assert(await page.locator('[data-work-in-motion-player]').count() === 1, 'Expected one work-in-motion player.');
  assert(mp4Requests.length === 0, 'The poster state must not request MP4 bytes.');
  assert(await page.locator('[data-work-in-motion-play]').isVisible(), 'Expected an explicit play control.');
  const posterBox = await page.locator('[data-work-in-motion-poster]').boundingBox();
  const playBox = await page.locator('[data-work-in-motion-play]').boundingBox();
  assert(playBox.x >= posterBox.x && playBox.y >= posterBox.y && playBox.x + playBox.width <= posterBox.x + posterBox.width && playBox.y + playBox.height <= posterBox.y + posterBox.height, 'Play must overlay the poster without extending outside it.');
  assert(!(await page.locator('[data-work-in-motion-video]').isVisible()), 'The inactive video must not occupy layout.');
  assert(!(await page.locator('[data-work-in-motion-fallback]').isVisible()), 'The inactive fallback link must not occupy layout.');
  assert(await page.locator('[data-work-in-motion-meta]').textContent() === '15 seconds · Silent', 'Expected visible duration and silent metadata.');
  assert(await page.locator('[data-work-in-motion-video]').getAttribute('src') === null, 'Video source must stay unset before activation.');
  assert(await page.locator('[data-work-in-motion-video]').getAttribute('autoplay') === null, 'The film must not autoplay.');
  assert(await page.locator('[data-work-in-motion-video]').getAttribute('loop') === null, 'The film must not loop.');
  assert(await page.locator('[data-work-in-motion-video]').getAttribute('aria-describedby') === 'work-in-motion-description', 'The film needs its text description.');

  await page.locator('[data-work-in-motion-media]').evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(150);
  assert(mp4Requests.length === 0, 'Reduced motion must preserve manual playback even in view.');
  await page.locator('[data-work-in-motion-play]').focus();
  await page.keyboard.press('Enter');
  const selectedSource = await page.locator('[data-work-in-motion-video]').getAttribute('src');
  assert(selectedSource.endsWith(expectedSource), 'Activation selected the wrong responsive video source.');
  assert(await page.locator('[data-work-in-motion-video]').getAttribute('controls') !== null, 'Native controls must appear after activation.');
  assert(await page.locator('[data-work-in-motion-video]').evaluate((video) => document.activeElement === video), 'Keyboard activation must move focus to native video controls.');
  const accessibility = await page.context().newCDPSession(page);
  const documentNode = await accessibility.send('DOM.getDocument');
  const videoNode = await accessibility.send('DOM.querySelector', {
    nodeId: documentNode.root.nodeId, selector: '[data-work-in-motion-video]'
  });
  const tree = await accessibility.send('Accessibility.getPartialAXTree', { nodeId: videoNode.nodeId });
  const accessibleVideo = tree.nodes.find(node => node.role?.value === 'Video');
  const description = await page.locator('#work-in-motion-description').textContent();
  assert(accessibleVideo?.description?.value === description, 'The collapsed film description must remain available to assistive technology.');
  await accessibility.detach();
  const playerOrder = await page.locator('[data-work-in-motion-player]').evaluate((player) => {
    const video = player.querySelector('[data-work-in-motion-video]');
    const controls = player.querySelector('.work-in-motion__controls');
    return Boolean(video && controls && video.compareDocumentPosition(controls) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  assert(playerOrder, 'The activated video must remain before the control row.');
  await page.waitForTimeout(250);
  assert(mp4Requests.some((url) => url.endsWith('/' + expectedSource)), 'Activation did not request the selected MP4.');
  await page.locator('[data-work-in-motion-status]').waitFor({ state: 'visible' });
  assert((await page.locator('[data-work-in-motion-status]').textContent()).includes('could not load'), 'A media failure needs a useful recovery message.');
  assert(await page.locator('[data-work-in-motion-fallback]').isVisible(), 'A media failure needs a visible recovery link.');
  const recoveryHref = await page.locator('[data-work-in-motion-fallback]').getAttribute('href');
  assert(recoveryHref.endsWith(expectedSource), 'The recovery link must target the selected film.');
  await page.setViewportSize(rotatedViewport);
  const ratio = await page.locator('[data-work-in-motion-video]').evaluate((video) => {
    const box = video.getBoundingClientRect();
    return box.width / box.height;
  });
  assert((expectLandscape && ratio > 1.4) || (!expectLandscape && ratio < 1), 'The activated film must retain its selected aspect ratio after resize.');
  assert((await page.locator('[data-work-in-motion-video]').getAttribute('src')).endsWith(expectedSource), 'Resize must not replace the selected film.');
}

async function checkScrollPlayback(browser, baseUrl) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  const movies = [];
  page.on('request', request => { if (request.url().endsWith('.mp4')) movies.push(request.url()); });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  assert(movies.length === 0, 'An offscreen film must not load on entry.');
  await page.locator('[data-work-in-motion-media]').evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForFunction(() => {
    const video = document.querySelector('[data-work-in-motion-video]');
    return !video.paused && video.currentTime > 0;
  }, null, { timeout: 4000 });
  assert(await page.locator('video').evaluate(v => document.activeElement !== v && v.muted), 'Scroll start must be muted and must not steal focus.');
  await page.locator('video').evaluate(v => { v.pause(); v.currentTime = 7; });
  await page.waitForFunction(() => !document.querySelector('video').seeking);
  await page.locator('.theme-toggle').click();
  await page.waitForFunction(() => document.querySelector('video').currentSrc.endsWith('work-in-motion-desktop-dark.mp4'), null, { timeout: 3000 });
  try {
    await page.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 2 && !v.seeking && v.currentTime >= 6.9; }, null, { timeout: 5000 });
  } catch (error) {
    console.error('Theme playback state:', await page.locator('video').evaluate(v => ({ src: v.currentSrc, time: v.currentTime, ready: v.readyState, seeking: v.seeking, paused: v.paused, error: v.error && v.error.message, duration: v.duration, buffered: v.buffered.length && [v.buffered.start(0), v.buffered.end(0)] })));
    throw error;
  }
  assert(await page.locator('video').evaluate(v => v.paused && Math.abs(v.currentTime - 7) < 0.2), 'Theme switching must preserve a paused film and its position.');
  await page.locator('[data-work-in-motion-play]').click();
  await page.waitForFunction(() => !document.querySelector('video').paused);
  await page.locator('.theme-toggle').click();
  await page.waitForFunction(() => { const v = document.querySelector('video'); return v.currentSrc.endsWith('work-in-motion-desktop.mp4') && !v.paused && v.currentTime >= 7; });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForFunction(() => document.querySelector('video').paused);
  await page.locator('[data-work-in-motion-media]').evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(250);
  assert(await page.locator('video').evaluate(v => v.paused), 'Scrolling back must not override a paused film.');
  await page.locator('video').evaluate(async v => { v.currentTime = 14.8; await v.play(); });
  await page.waitForFunction(() => document.querySelector('video').ended);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.locator('[data-work-in-motion-media]').evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(250);
  assert(await page.locator('video').evaluate(v => v.ended && v.paused && !v.loop), 'The film must play only once on scroll.');
  await page.close();
}

async function checkNoScript(browser, baseUrl, viewport, expectedSource, variant) {
  const page = await browser.newPage({ javaScriptEnabled: false, viewport, colorScheme: variant.endsWith('-dark') ? 'dark' : 'light' });
  await page.goto(baseUrl);
  assert(!(await page.locator('[data-work-in-motion-play]').isVisible()), 'No-JS visitors must not receive a dead play button.');
  const fallbackLink = page.locator('[data-work-in-motion-no-js-fallback="' + variant + '"]');
  assert(await fallbackLink.isVisible(), 'No-JS visitors need the selected fallback link.');
  await Promise.all([
    page.waitForURL(new RegExp(expectedSource.replace('.', '\\.'))),
    fallbackLink.click()
  ]);
  await page.close();
}

const server = await startServer();
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}/`;
const browser = await playwright.chromium.launch({ executablePath: browserPath });

try {
  await checkScrollPlayback(browser, baseUrl);
  const desktop = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
  await checkViewport(desktop, baseUrl, { width: 1280, height: 800 }, 'assets/video/work-in-motion-desktop.mp4', { width: 390, height: 844 }, true);
  await desktop.close();

  const mobile = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  await checkViewport(mobile, baseUrl, { width: 390, height: 844 }, 'assets/video/work-in-motion-mobile.mp4', { width: 1280, height: 800 }, false);
  await mobile.close();

  const dark = await browser.newPage({ reducedMotion: 'reduce', colorScheme: 'dark', viewport: { width: 1280, height: 800 } });
  await checkViewport(dark, baseUrl, { width: 1280, height: 800 }, 'assets/video/work-in-motion-desktop-dark.mp4', { width: 390, height: 844 }, true);
  await dark.close();

  await checkNoScript(browser, baseUrl, { width: 1280, height: 800 }, 'assets/video/work-in-motion-desktop.mp4', 'desktop');
  await checkNoScript(browser, baseUrl, { width: 390, height: 844 }, 'assets/video/work-in-motion-mobile.mp4', 'mobile');
  await checkNoScript(browser, baseUrl, { width: 390, height: 844 }, 'assets/video/work-in-motion-mobile-dark.mp4', 'mobile-dark');
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

console.log('Work-in-motion browser checks passed.');
