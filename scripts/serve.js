'use strict';

const http = require('http');
const { readFileSync, statSync } = require('fs');
const { extname, join, normalize } = require('path');

const root = join(__dirname, '..', 'dist');
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    let filePath = normalize(join(root, pathname === '/' ? 'main.html' : pathname));
    if (!filePath.startsWith(root)) {
        res.writeHead(403).end('Forbidden');
        return;
    }

    let stat;
    try {
        stat = statSync(filePath);
    } catch {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
        return;
    }

    if (stat.isDirectory()) {
        filePath = join(filePath, 'index.html');
        try {
            stat = statSync(filePath);
        } catch {
            res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
            return;
        }
    }

    res.writeHead(200, {
        'content-type': types[extname(filePath)] ?? 'application/octet-stream',
        'cache-control': 'no-store',
    });
    res.end(readFileSync(filePath));
});

server.listen(port, () => {
    const localUrl = `http://localhost:${port}/`;
    console.log(`Recipes are ready at ${localUrl}`);
    console.log(`Serving ${root}`);
});
