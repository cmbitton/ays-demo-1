// Development server only. Deploy dist/ to a static host; no server is deployed.
import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.xml':'application/xml','.txt':'text/plain','.woff2':'font/woff2','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png'};
const redirects = new Map((await readFile(path.join(root,'_redirects'),'utf8')).trim().split('\n').filter(l=>l&&!l.startsWith('#')).map(line=>{const [from,to,status]=line.split(/\s+/);return [from,{to,status:Number(status)}];}));
const headers = Object.fromEntries((await readFile(path.join(root,'_headers'),'utf8')).split('\n').filter(l=>l.startsWith('  ')).map(l=>{const index=l.indexOf(':');return [l.slice(0,index).trim(),l.slice(index+1).trim()];}));
const server = http.createServer(async(req,res)=>{
  try {
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
    const requested = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const redirect = redirects.get(requested);
    if (redirect && redirect.status !== 200) {res.writeHead(redirect.status,{'Location':redirect.to});res.end();return;}
    let file = path.resolve(root, '.'+ (redirect?.to || (requested==='/' ? '/index.html' : requested)));
    if (!file.startsWith(root+path.sep) || path.basename(file).startsWith('_')) {res.writeHead(404);res.end();return;}
    let status=200;
    try {if (!(await stat(file)).isFile()) throw new Error('not a file');}
    catch {file=path.join(root,'404.html');status=404;}
    const content = await readFile(file);
    res.writeHead(status,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache',...headers});
    res.end(req.method==='HEAD' ? undefined : content);
  } catch {res.writeHead(400);res.end('Bad request');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${port}`));
