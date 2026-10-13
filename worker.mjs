export default {
  async fetch(request, env) {
    if (request.method !== 'GET' || !new URL(request.url).pathname.startsWith('/assets/video/')) {
      return env.ASSETS.fetch(request);
    }

    const range = request.headers.get('Range');
    const ifRange = request.headers.get('If-Range');
    const assetRequest = new Request(request);
    assetRequest.headers.delete('Range');
    assetRequest.headers.delete('If-Range');
    assetRequest.headers.set('Accept-Encoding', 'identity');
    const asset = await env.ASSETS.fetch(assetRequest);
    if (asset.status !== 200) return asset;

    const headers = new Headers(asset.headers);
    headers.set('Accept-Ranges', 'bytes');
    const match = /^bytes=(\d*)-(\d*)$/.exec(range || '');
    if (!match || (!match[1] && !match[2]) ||
        (ifRange && (!ifRange.startsWith('"') || ifRange !== headers.get('ETag')))) {
      return new Response(asset.body, { status: 200, headers });
    }

    // shortcut: buffer these sub-520 KB clips; use ranged object storage for longer films.
    const data = await asset.arrayBuffer();
    const length = BigInt(data.byteLength);
    const requestedStart = match[1] ? BigInt(match[1]) : length - BigInt(match[2]);
    const start = requestedStart < 0n ? 0n : requestedStart;
    const requestedEnd = match[1] && match[2] ? BigInt(match[2]) : length - 1n;
    const end = requestedEnd >= length ? length - 1n : requestedEnd;

    if (start >= length || start > end) {
      headers.set('Content-Range', `bytes */${length}`);
      headers.set('Content-Length', '0');
      return new Response(null, { status: 416, headers });
    }

    headers.set('Content-Range', `bytes ${start}-${end}/${length}`);
    headers.set('Content-Length', String(end - start + 1n));
    return new Response(data.slice(Number(start), Number(end + 1n)), { status: 206, headers });
  },
};
