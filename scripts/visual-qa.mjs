import {readFile,mkdir,writeFile} from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const hash=b=>createHash('sha256').update(b).digest('hex');
const root=path.resolve('dist'),out='website-qa';
await mkdir(out,{recursive:true});
const latest=JSON.parse(await readFile('data/latest-playtest.json','utf8'));
const expected='6b81e6d98ad0fdafcceef0fc1ce2d90c5759b8b0852495a2b9599b0d1017be52';
assert.equal(latest.sha256,expected);assert.equal(latest.bytes,162129007);assert.equal(latest.publishedDate,'2026-10-12T05:40:39Z');
const report={commit:process.env.GITHUB_SHA??'local',checkedUtc:new Date().toISOString(),gameProcessesLaunched:false,imagesChanged:false,checks:[]};
const hero=JSON.parse(await readFile('data/hero.json','utf8')),scene=JSON.parse(await readFile('data/scene.json','utf8')),gallery=JSON.parse(await readFile('data/gallery.json','utf8'));
const images=[{path:hero.webImage,sha256:hero.webSha256},{path:scene.webImage,sha256:scene.webSha256},{path:scene.additionalImage.webImage,sha256:scene.additionalImage.webSha256},...gallery.images.flatMap(i=>i.derivatives)];
for(const image of images)assert.equal(hash(await readFile(image.path)),image.sha256,image.path);
report.originalImageManifestHashes='PASS';
const server=http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep))throw Error('outside root');const b=await readFile(file);res.setHeader('content-type',file.endsWith('.json')?'application/json':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':'text/html');res.end(b)}catch{res.statusCode=404;res.end('Missing')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const local='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
try{
 const bases=[['local',local]];
 if(process.env.VERIFY_LIVE==='true'){
  const live='https://stevologic.github.io/winter-hunt-tracker/';
  let ready=false;
  for(let n=0;n<24;n++){try{const r=await fetch(live+'index.html',{cache:'no-store'});if(r.ok&&hash(Buffer.from(await r.arrayBuffer()))===hash(await readFile('index.html'))){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,15000));}
  assert(ready,'Live HTML did not reach the tested source within six minutes');
  const served=[];
  for(const file of ['index.html','site-refresh.css','app.js','playtest.js','production.js','data/checkpoints.json','data/production.json','data/latest-playtest.json','data/download-dates.json']){
   const r=await fetch(live+file,{cache:'no-store'});assert(r.ok,file);const bytes=Buffer.from(await r.arrayBuffer());assert.equal(hash(bytes),hash(await readFile(file)),file);served.push({path:file,http:r.status,sha256:hash(bytes)});
  }
  report.liveFiles=served;bases.push(['live',live]);
 }
 for(const [mode,base]of bases){
  for(const [label,width,height]of [['desktop',1440,1000],['mobile',390,844],['narrow',320,800]]){
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>{window.__copied=[];Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.__copied.push(text)},configurable:true})});
   await page.goto(base,{waitUntil:'networkidle'});await page.waitForSelector('#latest-playtest');await page.waitForSelector('#production-phases article');await page.waitForFunction(()=>document.querySelector('#build-data h3')?.textContent.includes('visual05'));
   await page.screenshot({path:out+'/'+mode+'-'+label+'-hero.png'});
   for(const [target,suffix]of [['#latest-playtest','download'],['.camp-snap','encounter'],['#production','production'],['.developer-support','support']])await page.locator(target).screenshot({path:out+'/'+mode+'-'+label+'-'+suffix+'.png'});
   await page.locator('#copy-doge').click();assert.equal(await page.evaluate(()=>window.__copied[0]),'DTW2M5oEW97WbmYJRM71qD7uE6xfJs1MUK');
   await page.locator('#copy-doge').focus();assert(await page.locator('#copy-doge').evaluate(el=>document.activeElement===el&&getComputedStyle(el).outlineWidth!=='0px'));
   const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,latestHref:document.querySelector('.latest-download').href,releaseText:document.querySelector('#latest-playtest').innerText,ledger:document.querySelector('#build-data').innerText,phaseCount:document.querySelectorAll('#production-phases article').length,currentWork:document.querySelector('.current-work').innerText,caption:document.querySelector('.hero figcaption').innerText,heroRatio:(()=>{const r=document.querySelector('.hero-art img').getBoundingClientRect();return r.width/r.height})(),xMoney:document.querySelector('.support-link').href,historyCollapsed:!document.querySelector('.previous-builds').open,galleryCollapsed:!document.querySelector('.archive-gallery').open}));
   assert(!result.overflow);assert.equal(result.latestHref,latest.url);assert(result.releaseText.includes(latest.publishedDatePhoenix));assert(result.ledger.includes(latest.version));assert(!result.ledger.includes('Owner-only candidate'));assert.equal(result.phaseCount,8);assert(result.currentWork.includes('No new downloadable build'));assert(result.currentWork.includes('Six players remains the default'));assert(!result.currentWork.includes('185 cases passed'));assert(result.caption.includes('October 11, 2026'));assert(Math.abs(result.heroRatio-1.6)<.01);assert.equal(result.xMoney,'https://x.com/i/money/pay/MadeItHappenX');assert(result.historyCollapsed&&result.galleryCollapsed);assert.equal(errors.length,0);
   await page.locator('.archive-gallery').evaluate(el=>el.open=true);await page.locator('.night-capture').evaluate(el=>el.open=true);for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode())}const decoded=await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({src:new URL(i.src).pathname,alt:i.alt,width:i.naturalWidth,loaded:i.complete&&i.naturalWidth>0})));assert(decoded.every(i=>i.alt&&i.loaded));assert.equal(decoded.length,9);
   if(label==='desktop')await writeFile(out+'/'+mode+'-visible-status.txt',await page.locator('#production').innerText());
   report.checks.push({mode,label,width,height,errors,images:decoded,...result});await page.close();
  }
  for(const fallback of ['no-js','latest-fetch-failed']){const p=await browser.newPage({javaScriptEnabled:fallback!=='no-js',viewport:{width:390,height:844}});if(fallback==='latest-fetch-failed')await p.route('**/data/latest-playtest.json*',r=>r.abort());await p.goto(base,{waitUntil:'networkidle'});assert.equal(await p.locator('.latest-download').getAttribute('href'),latest.url);assert((await p.locator('#play').innerText()).includes(latest.publishedDatePhoenix));report.checks.push({mode,fallback,latestPreserved:true});await p.close();}
 }
 const releaseResponse=await fetch('https://api.github.com/repos/stevologic/winter-hunt-tracker/releases/tags/playtest-core9-visual05-334bfefe');assert(releaseResponse.ok);const release=await releaseResponse.json();const asset=release.assets.find(a=>a.name===latest.filename);assert(asset);assert.equal(asset.size,latest.bytes);assert.equal(asset.digest,'sha256:'+expected);assert.equal(release.published_at,latest.publishedDate);
 report.publicRelease={url:release.html_url,publishedAt:release.published_at,bytes:asset.size,sha256:expected};
 if(process.env.VERIFY_LIVE==='true'){const r=await fetch(latest.url);assert.equal(r.status,200);const h=createHash('sha256');let bytes=0;for await(const part of r.body){bytes+=part.length;h.update(part)}assert.equal(bytes,latest.bytes);assert.equal(h.digest('hex'),expected);report.anonymousDownload={http:r.status,bytes,sha256:expected,fullFetch:true};}
 await writeFile(out+'/receipt.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({commit:report.commit,checks:report.checks.length,originalImages:'PASS',publicRelease:'PASS',liveFiles:report.liveFiles?.length??0,anonymousFullHash:!!report.anonymousDownload}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
