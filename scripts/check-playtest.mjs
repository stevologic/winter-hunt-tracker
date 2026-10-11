import{readFile}from'node:fs/promises';import assert from'node:assert/strict';
const d=JSON.parse(await readFile('data/playtest.json','utf8'));
if(d.state==='pending'){assert.equal(d.url,null);console.log('PASS: public playtest remains pending without an invented link.');}
else{assert.equal(d.state,'verified');for(const k of ['version','publishedDate','filename','executable','verification'])assert(d[k],`Missing ${k}`);assert(/^[a-f0-9]{64}$/.test(d.sha256));assert(d.bytes>0&&d.bytes<2147483648);assert(d.features.length&&d.knownLimits.length);const u=new URL(d.url);assert.equal(u.hostname,'github.com');assert(u.pathname.startsWith('/stevologic/winter-hunt-tracker/releases/download/'));assert(d.filename.endsWith('.zip'));assert(d.executable.endsWith('.exe'));console.log('PASS: complete public release manifest.');}

const p=JSON.parse(await readFile('data/private-playtest.json','utf8'));
assert.equal(p.state,'private-playtest');assert.equal(p.access,'github-private-draft');assert.equal(p.version,'a047a9a');
assert.equal(p.url,'https://github.com/stevologic/operation-winter-steam-sale/releases/tag/untagged-1fa972a8f96404b34f94');
assert.equal(p.filename,'WinterHunt-Win-Diagnostic-20261011-010804-a047a9a.zip');assert.equal(p.bytes,162177359);
assert.equal(p.sha256,'6810f2f2fd2ef89738989833e6c04e25093a7958b4ea18cfe7f19bf758220f93');assert.equal(p.launcher,'Start-Playtest.cmd');assert.equal(p.executable,'WinterHunt.exe');
assert(p.knownLimits.some(x=>/Human listening/.test(x)));assert(p.knownLimits.some(x=>/Separate-PC.*Steam.*Deck\/controller/.test(x)));
assert.equal(d.version,'1d79ef7');assert.equal(d.bytes,158846801);assert.equal(d.sha256,'8dd4c9a6dae9c3587e6e36a2570b07113d6a828b1158a1396a3984eb0873e65e');
console.log('PASS: exact private draft handoff and preserved public baseline identity.');
