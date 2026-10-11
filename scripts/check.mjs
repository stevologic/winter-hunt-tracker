import{readFile,readdir}from'node:fs/promises';import assert from'node:assert/strict';
const d=JSON.parse(await readFile('data/checkpoints.json','utf8'));assert.equal(d.build.version,'1d79ef7');assert.equal(d.stages.length,5);
for(const s of d.stages){assert(['requested','in-progress','verified'].includes(s.state));assert(s.criteria.length>0);if(s.state==='verified')assert(s.evidence?.length,'Verified checkpoint requires evidence');}
for(const[,u]of d.sources)assert.equal(new URL(u).hostname,'partner.steamgames.com');
const privatePlaytest=JSON.parse(await readFile('data/private-playtest.json','utf8'));
const authorizedPrivateUrl='https://github.com/stevologic/operation-winter-steam-sale/releases/tag/untagged-9cd2a93d7678eeaf1eec';
assert.equal(privatePlaytest.url,authorizedPrivateUrl,'Only the explicitly authorized private release-page link may be published');
assert.match(authorizedPrivateUrl,/^https:\/\/github\.com\/stevologic\/operation-winter-steam-sale\/releases\/tag\/untagged-[a-f0-9]+$/,'Resolve the actual new draft URL before publication');
assert.equal(d.build.sourceCandidate,'aee0f8e');
async function walk(p){for(const f of await readdir(p,{withFileTypes:true})){const q=`${p}/${f.name}`;if(f.isDirectory())await walk(q);else if(/\.(html|css|js|json)$/.test(q)){let t=await readFile(q,'utf8');if(q==='dist/data/private-playtest.json'){assert.deepEqual(JSON.parse(t),privatePlaytest);t=t.replace(JSON.stringify(authorizedPrivateUrl),'"AUTHORIZED_PRIVATE_PLAYTEST_LINK"');}assert(!/operation-winter-steam-sale|steamcommunity\.com|password|ghp_|github_pat_|appID\s*[:=]\s*\d/i.test(t),`Private data risk: ${q}`);}}}await walk('dist');
await import('./check-playtest.mjs');
await import('./check-playtest-render.mjs');
console.log('PASS: checkpoint schema, evidence gates, official sources and public-content scan with one authorized private-link exception.');
await import('./check-production.mjs');
