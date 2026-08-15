import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const resumeHtmlPath = path.join(rootDir, 'src', 'resume.html');
const resumePdfPath = path.join(rootDir, 'src', 'assets', 'files', 'vincent-congini-resume.pdf');

const chromeCandidates = [
  process.env.CHROME_PATH,
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

function findChrome() {
  const found = chromeCandidates.find((candidate) => existsSync(candidate));

  if (!found) {
    throw new Error(
      [
        'Could not find Chrome or Chromium to generate the resume PDF.',
        'Install Chrome, Chromium, or set CHROME_PATH to the browser executable.',
      ].join(' '),
    );
  }

  return found;
}

function assertGeneratedPdf(pdfPath) {
  if (!existsSync(pdfPath)) {
    throw new Error(`Chrome did not create ${path.relative(rootDir, pdfPath)}.`);
  }

  const { size } = statSync(pdfPath);

  if (size < 10_000) {
    throw new Error(`Generated resume PDF looks too small (${size} bytes).`);
  }
}

// The resume must stay one page. Chrome writes an uncompressed page tree, so
// counting `/Type /Page` objects (not `/Type /Pages`) is enough to check it.
// Verified by mutation: before the layout was trimmed this counted 2.
function assertSinglePage(pdfPath) {
  const pdf = readFileSync(pdfPath, 'latin1');
  const pages = pdf.match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;

  if (pages !== 1) {
    throw new Error(
      pages === 0
        ? 'Could not count pages in the generated resume PDF, so the one-page rule is unverified.'
        : `Resume PDF is ${pages} pages. Trim content or mark it resume-print-optional until it fits one page.`,
    );
  }
}

const chromePath = findChrome();
const profileDir = path.join(tmpdir(), `resume-pdf-${process.pid}`);
const tempPdfPath = path.join(profileDir, 'vincent-congini-resume.pdf');
const disableSandbox = process.env.CHROME_NO_SANDBOX === '1';

mkdirSync(path.dirname(resumePdfPath), { recursive: true });
mkdirSync(profileDir, { recursive: true });

const args = [
  '--headless=new',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  ...(disableSandbox ? ['--no-sandbox'] : []),
  `--user-data-dir=${profileDir}`,
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=3000',
  '--no-pdf-header-footer',
  '--print-to-pdf-no-header',
  `--print-to-pdf=${tempPdfPath}`,
  pathToFileURL(resumeHtmlPath).href,
];

const child = spawn(chromePath, args, {
  cwd: rootDir,
  stdio: 'inherit',
});

let pdfReady = false;
let timedOut = false;
let lastPdfSize = 0;
let stablePdfChecks = 0;

const waitForChrome = new Promise((resolve, reject) => {
  child.once('error', reject);
  child.once('close', (status, signal) => resolve({ status, signal }));
});

const monitor = setInterval(() => {
  if (!existsSync(tempPdfPath)) {
    return;
  }

  const { size } = statSync(tempPdfPath);

  if (size > 10_000 && size === lastPdfSize) {
    stablePdfChecks += 1;
  } else {
    stablePdfChecks = 0;
    lastPdfSize = size;
  }

  if (stablePdfChecks >= 2) {
    pdfReady = true;
    clearInterval(monitor);
    child.kill('SIGTERM');
  }
}, 250);

const timeout = setTimeout(() => {
  timedOut = true;
  clearInterval(monitor);
  child.kill('SIGTERM');
}, 20_000);

const result = await waitForChrome;

clearInterval(monitor);
clearTimeout(timeout);

try {
  if (!pdfReady) {
    assertGeneratedPdf(tempPdfPath);
  }

  copyFileSync(tempPdfPath, resumePdfPath);
  assertGeneratedPdf(resumePdfPath);
  assertSinglePage(resumePdfPath);

  if (timedOut) {
    throw new Error('Chrome timed out after creating the resume PDF.');
  }

  if (result.status !== 0 && result.signal !== 'SIGTERM') {
    const exitDetail = result.signal
      ? `signal ${result.signal}`
      : `status ${result.status}`;

    throw new Error(`Chrome exited with ${exitDetail}.`);
  }

  console.log(`Generated ${path.relative(rootDir, resumePdfPath)}`);
} finally {
  rmSync(profileDir, { recursive: true, force: true });
}
