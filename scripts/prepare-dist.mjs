import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

const ignoredExtensions = new Set(['.scss', '.sass', '.map']);
const ignoredNames = new Set(['.DS_Store', 'Thumbs.db']);

function shouldCopy(name) {
  return !ignoredNames.has(name) && !ignoredExtensions.has(path.extname(name));
}

async function copyDirectory(fromDir, toDir) {
  await mkdir(toDir, { recursive: true });

  const entries = await readdir(fromDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!shouldCopy(entry.name)) {
      continue;
    }

    const fromPath = path.join(fromDir, entry.name);
    const toPath = path.join(toDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(fromPath, toPath);
    } else if (entry.isFile()) {
      await mkdir(path.dirname(toPath), { recursive: true });
      await copyFile(fromPath, toPath);
    }
  }
}

async function fingerprintAsset(relativePath) {
  const assetPath = path.join(distDir, relativePath);
  const asset = await readFile(assetPath);
  const hash = createHash('sha256').update(asset).digest('hex').slice(0, 12);
  const parsed = path.parse(relativePath);
  const fingerprintedRelativePath = path.join(parsed.dir, `${parsed.name}.${hash}${parsed.ext}`);
  const fingerprintedPath = path.join(distDir, fingerprintedRelativePath);

  await rename(assetPath, fingerprintedPath);

  return {
    original: relativePath.split(path.sep).join('/'),
    fingerprinted: fingerprintedRelativePath.split(path.sep).join('/'),
  };
}

async function getHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await getHtmlFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(entryPath);
    }
  }

  return files;
}

async function rewriteHtmlReferences(replacements) {
  const htmlFiles = await getHtmlFiles(distDir);

  for (const htmlPath of htmlFiles) {
    let html = await readFile(htmlPath, 'utf8');

    for (const { original, fingerprinted } of replacements) {
      html = html.replaceAll(original, fingerprinted);
    }

    await writeFile(htmlPath, html);
  }
}

async function assertFile(relativePath) {
  const filePath = path.join(distDir, relativePath);
  const fileStat = await stat(filePath);

  if (!fileStat.isFile() || fileStat.size === 0) {
    throw new Error(`Expected ${relativePath} to exist in dist.`);
  }
}

await rm(distDir, { recursive: true, force: true });
await copyDirectory(srcDir, distDir);

const replacements = [
  await fingerprintAsset('assets/styles/main.css'),
  await fingerprintAsset('assets/scripts/main.js'),
];

await rewriteHtmlReferences(replacements);

for (const { fingerprinted } of replacements) {
  await assertFile(fingerprinted);
}

console.log(
  replacements
    .map(({ original, fingerprinted }) => `${original} -> ${fingerprinted}`)
    .join('\n'),
);
