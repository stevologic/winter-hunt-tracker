import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';

const script=await readFile('playtest.js','utf8');
const privateData=JSON.parse(await readFile('data/private-playtest.json','utf8'));
const publicData=JSON.parse(await readFile('data/playtest.json','utf8'));
async function render(privateManifest=privateData,publicManifest=publicData){
  const target={innerHTML:'fallback'};
  await runInNewContext(script,{
    document:{querySelector:selector=>{assert.equal(selector,'#play');return target;}},
    fetch:async path=>{
      const data=path==='data/private-playtest.json'?privateManifest:publicManifest;
      return {ok:data!==null,json:async()=>data};
    }
  });
  return target.innerHTML;
}
const both=await render();
assert(both.includes(`href="${privateData.url}"`));assert(both.includes(`href="${publicData.url}"`));
assert(both.indexOf('id="private-playtest"')<both.indexOf('id="public-playtest"'));
assert(both.includes('GitHub sign-in required.'));assert(both.includes('existing permission to view the private draft release'));
assert(both.includes('aria-describedby="private-access"'));assert(both.includes('not release-ready'));
assert(both.includes('separate-PC Steam/network'));assert(both.includes('Steam Deck/controller'));
assert(both.includes('Start-Playtest.cmd'));assert(!/download="/.test(both),'Private release page must not masquerade as a direct ZIP');
const publicOnly=await render(null);assert(publicOnly.includes(publicData.url));assert(!publicOnly.includes(privateData.url));
const privateOnly=await render(privateData,null);assert(privateOnly.includes(privateData.url));assert(!privateOnly.includes(publicData.url));
const invalidPrivate=await render({...privateData,url:'https://example.invalid/fake.zip'});assert(!invalidPrivate.includes('example.invalid'));assert(invalidPrivate.includes(publicData.url));
const invalidPublic=await render(privateData,{...publicData,url:privateData.url});assert(!invalidPublic.includes('id="public-playtest"'));
assert.equal(await render(null,null),'fallback');
const escaped=await render({...privateData,summary:'<img src=x onerror="alert(1)">'});assert(escaped.includes('&lt;img'));assert(!escaped.includes('<img'));
console.log('PASS: separate access labels, both downloads, failed-fetch isolation, URL rejection and escaped data.');
