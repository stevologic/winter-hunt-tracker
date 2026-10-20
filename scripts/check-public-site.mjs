import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile('dist/index.html','utf8');
const visible=html.replace(/<!--[^]*?-->/g,'').replace(/<[^>]*>/g,' ');
assert(!/Visual\d+|Assets\d+|Source\d+|Core\d+|198DC281|334BFEFE/i.test(visible),'Internal labels must not appear in page copy');
const links=[...html.matchAll(/href="([^"]*)"/g)].map(x=>x[1]);
assert(!links.some(x=>/releases\/|\.zip(?:$|[?#])|data\//i.test(x)),'Public page must not expose package or provenance links');
assert.equal(links.filter(x=>x==='https://www.gofundme.com/f/help-build-winterhunt-an-indie-coop-hunting-game').length,3);
assert.match(visible,/Testing access is being arranged/);
assert.match(visible,/access managed individually by the developer/);
assert.match(visible,/does not currently promise testing access or a copy of the game/);
assert(!/\$10|buy now|donate to (?:play|get access)/i.test(visible));
assert.match(visible,/no guaranteed release date/i);
assert.match(visible,/Steam Deck support is not verified/);
assert(!/<script[^>]+(?:app|playtest|production)\.js/.test(html),'Archived renderers must not restore public download links');
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
for(const url of links.filter(x=>x.startsWith('#')&&x.length>1)) assert(ids.has(url.slice(1)),url);
for(const [,src] of html.matchAll(/(?:src|href)="(assets\/[^"?]+)"/g)) await access(src);
for(const path of ['data/hero.json','data/scene.json','data/gallery.json','data/latest-playtest.json']) JSON.parse(await readFile(path,'utf8'));
assert.equal((html.match(/<!--/g)||[]).length,(html.match(/-->/g)||[]).length);
console.log('PASS: restricted testing copy, no public package links or internal labels, support links, anchors, images, preserved provenance and no paid-access promise.');

// Preserve the authentic cover and keep unapproved development captures off the landing page.
assert.match(html,/src="assets\/hero-gameplay-visual05.webp"/);
assert(!/camp-controls|hud24|coop-hero-v2/.test(html));
const imagery=JSON.parse(await readFile('data/site-imagery.json','utf8'));
assert.equal(imagery.kind,'Actual captured gameplay only');
assert.equal(imagery.images.length,3);
const {createHash}=await import('node:crypto');
for(const image of imagery.images){
  assert.equal(createHash('sha256').update(await readFile(image.fullFramePath)).digest('hex'),image.sourceSha256);
  for(const derivative of image.derivatives) assert.equal(createHash('sha256').update(await readFile(derivative.path)).digest('hex'),derivative.sha256);
}
console.log('PASS: original cover preserved, authentic image hashes verified, no HUD24 or generated promotional art published.');
