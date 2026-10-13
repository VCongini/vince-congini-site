import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker from '../worker.mjs';

const bytes = new TextEncoder().encode('0123456789');
const assetHeaders = { 'Content-Type': 'video/mp4', 'Content-Length': '10', ETag: '"clip-v1"', 'Cache-Control': 'public, max-age=0, must-revalidate' };

async function fetchVideo(headers = {}, options = {}) {
  let assetRequest;
  const env = { ASSETS: { async fetch(request) {
    assetRequest = request;
    const status = options.assetStatus || 200;
    const body = request.method === 'HEAD' || status === 304 ? null : bytes;
    return new Response(body, { status, headers: assetHeaders });
  } } };
  const request = new Request('https://example.test' + (options.path || '/assets/video/film.mp4'), {
    method: options.method || 'GET', headers,
  });
  const response = await worker.fetch(request, env);
  return { response, assetRequest };
}

for (const [range, expected, contentRange] of [
  ['bytes=0-1', '01', 'bytes 0-1/10'],
  ['bytes=3-6', '3456', 'bytes 3-6/10'],
  ['bytes=7-', '789', 'bytes 7-9/10'],
  ['bytes=-3', '789', 'bytes 7-9/10'],
  ['bytes=8-99', '89', 'bytes 8-9/10'],
  ['bytes=-999999999999999999999', '0123456789', 'bytes 0-9/10'],
]) {
  test('serves ' + range, async () => {
    const { response, assetRequest } = await fetchVideo({ Range: range });
    assert.equal(response.status, 206);
    assert.equal(await response.text(), expected);
    assert.equal(response.headers.get('Content-Range'), contentRange);
    assert.equal(response.headers.get('Content-Length'), String(expected.length));
    assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
    assert.equal(response.headers.get('Content-Type'), 'video/mp4');
    assert.equal(response.headers.get('ETag'), '"clip-v1"');
    assert.equal(assetRequest.headers.get('Range'), null);
    assert.equal(assetRequest.headers.get('Accept-Encoding'), 'identity');
  });
}

for (const range of ['bytes=10-', 'bytes=-0', 'bytes=8-2', 'bytes=999999999999999999999-']) {
  test('rejects unsatisfiable ' + range, async () => {
    const { response } = await fetchVideo({ Range: range });
    assert.equal(response.status, 416);
    assert.equal(response.headers.get('Content-Range'), 'bytes */10');
    assert.equal((await response.arrayBuffer()).byteLength, 0);
  });
}

for (const range of ['', 'bytes=abc', 'items=0-1', 'bytes=0-1,5-6', 'bytes=-']) {
  test('serves full film for unsupported range: ' + range, async () => {
    const { response } = await fetchVideo(range ? { Range: range } : {});
    assert.equal(response.status, 200);
    assert.equal(await response.text(), '0123456789');
    assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
  });
}

for (const validator of ['"clip-v1"', '"old-clip"', 'W/"clip-v1"', 'Wed, 01 Jan 2025 00:00:00 GMT']) {
  test('honors If-Range validator: ' + validator, async () => {
    const { response, assetRequest } = await fetchVideo({ Range: 'bytes=0-1', 'If-Range': validator });
    const matches = validator === '"clip-v1"';
    assert.equal(response.status, matches ? 206 : 200);
    assert.equal(await response.text(), matches ? '01' : '0123456789');
    assert.equal(assetRequest.headers.get('If-Range'), null);
  });
}

test('preserves HEAD, other methods, and non-video requests', async () => {
  for (const options of [{ method: 'HEAD' }, { method: 'POST' }, { path: '/index.html' }]) {
    const { response, assetRequest } = await fetchVideo({ Range: 'bytes=0-1' }, options);
    assert.equal(response.status, 200);
    assert.equal(assetRequest.headers.get('Range'), 'bytes=0-1');
    if (options.method === 'HEAD') assert.equal((await response.arrayBuffer()).byteLength, 0);
  }
});

test('preserves asset errors and cache preconditions', async () => {
  for (const status of [304, 404, 500]) {
    const { response } = await fetchVideo({ Range: 'bytes=0-1', 'If-None-Match': '"clip-v1"' }, { assetStatus: status });
    assert.equal(response.status, status);
  }
});
