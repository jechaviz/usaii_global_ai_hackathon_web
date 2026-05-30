import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 4197);
const root = process.cwd();

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.vue': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
};

function safePath(url) {
  const path = decodeURIComponent(new URL(url, `http://127.0.0.1:${port}`).pathname);
  const rel = path === '/' ? 'index.html' : path.slice(1);
  const full = normalize(join(root, rel));
  return full.startsWith(root) ? full : join(root, 'index.html');
}

createServer(async (request, response) => {
  const path = safePath(request.url);
  try {
    const body = await readFile(path);
    response.writeHead(200, {
      'content-type': types[extname(path)] || 'application/octet-stream',
      'cache-control': 'no-cache',
    });
    response.end(body);
  } catch {
    const fallback = await readFile(join(root, 'index.html'));
    response.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-cache',
    });
    response.end(fallback);
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`AI Study-to-Work Coach running at http://127.0.0.1:${port}/`);
});
