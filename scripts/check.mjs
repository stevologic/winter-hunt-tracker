import{readFile,readdir}from'node:fs/promises';import assert from'node:assert/strict';
const d=JSON.parse(await readFile('data/checkpoints.json','utf8'));assert.equal(d.build.version,'1d79ef7');assert.equal(d.stages.length,5);
for(const s of d.stages){assert(['requested','in-progress','verified'].includes(s.state));assert(s.criteria.length>0);if(s.state==='verified')assert(s.evidence?.length,'Verified checkpoint requires evidence');}
for(const[,u]of d.sources)assert.equal(new URL(u).hostname,'partner.steamgames.com');
async function walk(p){for(const f of await readdir(p,{withFileTypes:true})){const q=`${p}/${f.name}`;if(f.isDirectory())await walk(q);else if(/\.(html|css|js|json)$/.test(q)){const t=await readFile(q,'utf8');assert(!/operation-winter-steam-sale|steamcommunity\.com|password|ghp_|github_pat_|appID\s*[:=]\s*\d/i.test(t),`Private data risk: ${q}`);}}}await walk('dist');console.log('PASS: checkpoint schema, evidence gates, official sources and public-content scan.');
