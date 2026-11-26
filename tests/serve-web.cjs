const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('.expo/test-dist');
const types = { '.js': 'application/javascript', '.html': 'text/html', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json' };
http.createServer((req, res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  fs.createReadStream(file).pipe(res);
}).listen(4173, '127.0.0.1');
