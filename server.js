const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

function resolveFilePath(reqUrl) {
  const parsed = url.parse(reqUrl);
  let pathname = decodeURIComponent(parsed.pathname || '/');

  // Prevent directory traversal
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let fullPath = path.join(ROOT_DIR, safePath);

  // If path is a directory or ends with /, try index.html
  if (pathname.endsWith('/') || (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory())) {
    const indexPath = path.join(fullPath, 'index.html');
    if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
      return indexPath;
    }
  }

  // Exact file match
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return fullPath;
  }

  // VitePress cleanUrls support: /concepts/what-is-llm -> /concepts/what-is-llm.html
  if (fs.existsSync(fullPath + '.html') && fs.statSync(fullPath + '.html').isFile()) {
    return fullPath + '.html';
  }

  // Also check /concepts/what-is-llm/index.html
  const subIndexPath = path.join(fullPath, 'index.html');
  if (fs.existsSync(subIndexPath) && fs.statSync(subIndexPath).isFile()) {
    return subIndexPath;
  }

  return null;
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    // Only handle GET and HEAD
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      return res.end('Method Not Allowed');
    }

    const filePath = resolveFilePath(req.url);

    if (!filePath) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Internal Server Error');
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });

      if (req.method === 'HEAD') {
        return res.end();
      }

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      stream.on('error', () => {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
        }
        res.end();
      });
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log('\n======================================================');
    console.log('   AI 时代使用手册 - 本地预览服务器已启动');
    console.log(`   Local:   http://localhost:${port}`);
    console.log(`   Network: http://127.0.0.1:${port}`);
    console.log('======================================================\n');
  });
}

startServer(DEFAULT_PORT);
