import{readFile}from'node:fs/promises';import assert from'node:assert/strict';
const d=JSON.parse(await readFile('data/playtest.json','utf8'));
if(d.state==='pending'){assert.equal(d.url,null);console.log('PASS: public playtest remains pending without an invented link.');}
else{assert.equal(d.state,'verified');for(const k of ['version','publishedDate','filename','executable','verification'])assert(d[k],`Missing ${k}`);assert(/^[a-f0-9]{64}$/.test(d.sha256));assert(d.bytes>0&&d.bytes<2147483648);assert(d.features.length&&d.knownLimits.length);const u=new URL(d.url);assert.equal(u.hostname,'github.com');assert(u.pathname.startsWith('/stevologic/winter-hunt-tracker/releases/download/'));assert(d.filename.endsWith('.zip'));assert(d.executable.endsWith('.exe'));console.log('PASS: complete public release manifest.');}

const p=JSON.parse(await readFile('data/private-playtest.json','utf8'));
assert.equal(p.state,'private-playtest');assert.equal(p.access,'github-private-draft');assert.equal(p.version,'aee0f8e');
assert.equal(p.url,'https://github.com/stevologic/operation-winter-steam-sale/releases/tag/untagged-9cd2a93d7678eeaf1eec');
assert.match(p.url,/^https:\/\/github\.com\/stevologic\/operation-winter-steam-sale\/releases\/tag\/untagged-[a-f0-9]+$/,'Resolve the actual new draft URL before publication');
assert.equal(p.filename,'WinterHunt-Win-Diagnostic-20261011-043708-aee0f8e.zip');assert.equal(p.bytes,161987739);
assert.equal(p.sha256,'06d0216779399accbd317dcee1bdfeb9ba5625dc1df0914b4a5805057843b098');assert.equal(p.launcher,'Start-Playtest.cmd');assert.equal(p.executable,'WinterHunt.exe');
assert.equal(p.sourceRevision,'aee0f8e66af2c8571a06032143c2de09c1e2bc65');
assert.deepEqual(p.nativeTests,{passed:506,failed:0,other:0,editMode:317,playMode:189});
assert.equal(p.packageChecks.required,9);
assert.equal(p.packageChecks.status,'passed','Nine terminal exact-package gates are required before publication');
assert.equal(p.rootVisualReviewComplete,true,'Actual new packaged image review must finish');
assert.equal(p.privateDownloadVerified,true,'Actual full authenticated download/hash verification must finish');
assert.match(p.verification,/nine exact-package gates passed/i,'Replace pending package wording only after terminal evidence; human acceptance may remain pending');
assert(p.knownLimits.some(x=>/Human listening/.test(x)));assert(p.knownLimits.some(x=>/Separate-PC.*Steam.*Deck\/controller/.test(x)));
assert.equal(d.version,'1d79ef7');assert.equal(d.bytes,158846801);assert.equal(d.sha256,'8dd4c9a6dae9c3587e6e36a2570b07113d6a828b1158a1396a3984eb0873e65e');
console.log('PASS: exact private draft handoff and preserved public baseline identity.');
