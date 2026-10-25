import http from 'node:http';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
const root=path.resolve(process.env.PREVIEW_ROOT||'.');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.glb':'model/gltf-binary','.json':'application/json','.svg':'image/svg+xml'};
export const server=http.createServer(async(req,res)=>{
  try {
    const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/winter-hunt-tracker(?=\/)/,'');
    const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
    if(!file.startsWith(root+path.sep)) throw Error('Outside root');
    const bytes=await readFile(file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
  } catch {res.writeHead(404);res.end('Not found');}
});
if(process.argv[1]?.endsWith('preview.mjs')) {
  server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log(`Winter Hunt preview: http://127.0.0.1:${server.address().port}/`));
}
