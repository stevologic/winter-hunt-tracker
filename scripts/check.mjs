import{readFile,readdir}from'node:fs/promises';import assert from'node:assert/strict';
const d=JSON.parse(await readFile('data/checkpoints.json','utf8'));const latest=JSON.parse(await readFile('data/latest-playtest.json','utf8'));assert.equal(d.build.version,latest.version);assert.equal(d.build.publishedDatePhoenix,latest.publishedDatePhoenix);assert.equal(d.stages.length,5);
// Keep the store-page target separate from release-candidate/build review.
assert.deepEqual(d.targets[1],['Oct 19','Planned store-page review submission']);
assert.deepEqual(d.targets[3],['Nov 2','Planned release-candidate acceptance and build-review submission']);
for(const s of d.stages){assert(['requested','in-progress','verified'].includes(s.state));assert(s.criteria.length>0);if(s.state==='verified')assert(s.evidence?.length,'Verified checkpoint requires evidence');}
for(const[,u]of d.sources)assert.equal(new URL(u).hostname,'partner.steamgames.com');
const privatePlaytest=JSON.parse(await readFile('data/private-playtest.json','utf8'));
const authorizedPrivateUrl='https://github.com/stevologic/operation-winter-steam-sale/releases/tag/untagged-9cd2a93d7678eeaf1eec';
assert.equal(privatePlaytest.url,authorizedPrivateUrl,'Only the explicitly authorized private release-page link may be published');
assert.match(authorizedPrivateUrl,/^https:\/\/github\.com\/stevologic\/operation-winter-steam-sale\/releases\/tag\/untagged-[a-f0-9]+$/,'Resolve the actual new draft URL before publication');
assert.equal(d.build.sourceCandidate,'198DC281');
assert.equal(d.build.builtDatePhoenix,latest.builtDatePhoenix);
assert.equal(d.build.evidence[0].url,latest.releaseUrl);
assert.match(d.build.label,/Current public Windows diagnostic playtest on GitHub/);
assert.match(d.build.tested,/63 scoped native cases/);
assert.match(d.build.tested,/two-process no-purchase Zombie baseline/);
assert.match(d.build.sourceLabel,/Visual05 and older downloads remain archived/);
assert.match(d.build.sourceLabel,/winter-hunt\.com HTTPS was verified October 20, 2026\./);
async function walk(p){for(const f of await readdir(p,{withFileTypes:true})){const q=`${p}/${f.name}`;if(f.isDirectory())await walk(q);else if(/\.(html|css|js|json)$/.test(q)){let t=await readFile(q,'utf8');if(q==='dist/data/private-playtest.json'){assert.deepEqual(JSON.parse(t),privatePlaytest);t=t.replace(JSON.stringify(authorizedPrivateUrl),'"AUTHORIZED_PRIVATE_PLAYTEST_LINK"');}assert(!/operation-winter-steam-sale|steamcommunity\.com|password|ghp_|github_pat_|appID\s*[:=]\s*\d/i.test(t),`Private data risk: ${q}`);}}}await walk('dist');
await import('./check-playtest.mjs');
await import('./check-playtest-render.mjs');
console.log('PASS: checkpoint schema, evidence gates, official sources and public-content scan with one authorized private-link exception.');
await import('./check-production.mjs');
await import('./check-latest.mjs');
await import('./check-visual05-archive.mjs');
