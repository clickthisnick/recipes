'use strict';

const http = require('http');
const { createReadStream, statSync } = require('fs');
const { extname, join } = require('path');
const { requestPath, resolveSafePath } = require('./static-path');

const root = join(__dirname, '..');
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.mp3': 'audio/mpeg',
};

function send(res, status, body) {
    res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8', 'x-content-type-options': 'nosniff' });
    res.end(body);
}

const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.setHeader('allow', 'GET, HEAD');
        send(res, 405, 'Method not allowed');
        return;
    }

    const filePath = resolveSafePath(root, requestPath(req.url));
    if (!filePath) {
        send(res, 400, 'Bad request');
        return;
    }

    let stat;
    try {
        stat = statSync(filePath);
    } catch {
        send(res, 404, 'Not found');
        return;
    }

    let finalPath = filePath;
    if (stat.isDirectory()) {
        finalPath = join(filePath, 'index.html');
        try {
            stat = statSync(finalPath);
        } catch {
            send(res, 404, 'Not found');
            return;
        }
    }

    res.writeHead(200, {
        'content-type': types[extname(finalPath).toLowerCase()] ?? 'application/octet-stream',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
    });
    if (req.method === 'HEAD') {
        res.end();
        return;
    }

    const stream = createReadStream(finalPath);
    stream.on('error', () => {
        if (!res.headersSent) send(res, 500, 'Could not read file');
        else res.end();
    });
    stream.pipe(res);
});

server.on('error', (err) => {
    console.error(err.message);
    process.exitCode = 1;
});

server.listen(port, () => {
    const localUrl = `http://localhost:${port}/`;
    console.log(`Kitchen tools are ready at ${localUrl}`);
    console.log(`Recipe app: ${localUrl}dist/main.html`);
    console.log(`Serving ${root}`);
});
