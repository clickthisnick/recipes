'use strict';

const { resolve, sep } = require('path');

// Keep the path from the request line. The WHATWG URL parser resolves ".."
// and percent-encoded dots before we can reject them.
function requestPath(url) {
    const raw = url || '/';
    const end = raw.search(/[?#]/);
    return end === -1 ? raw : raw.slice(0, end);
}

// Map a URL path onto a file inside root, or return null when it is unsafe.
function resolveSafePath(root, pathname) {
    if (typeof pathname !== 'string' || pathname.includes('\0')) return null;
    let decoded;
    try {
        decoded = decodeURIComponent(pathname);
    } catch {
        return null;
    }
    if (decoded.includes('\0')) return null;

    const rootResolved = resolve(root);
    const rootPrefix = rootResolved.endsWith(sep) ? rootResolved : rootResolved + sep;
    const relative = decoded === '/' ? '' : decoded.replace(/^[/\\]+/, '');
    const segments = relative.split(/[/\\]/).filter((segment) => segment.length > 0);
    if (segments.some((segment) => segment.startsWith('.'))) return null;

    const filePath = resolve(rootResolved, ...segments);
    if (filePath !== rootResolved && !filePath.startsWith(rootPrefix)) return null;
    return filePath;
}

module.exports = { requestPath, resolveSafePath };
