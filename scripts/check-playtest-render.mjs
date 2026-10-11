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
const launchSteps=both.match(/<ol class="launch-steps">([\s\S]*?)<\/ol>/)?.[1];
assert(launchSteps,'Private playtest needs an ordered launch guide');
assert.equal((launchSteps.match(/<li>/g)||[]).length,5);
assert(launchSteps.indexOf('Sign in to GitHub')<launchSteps.indexOf('Assets'));
assert(launchSteps.includes(privateData.filename));assert(launchSteps.includes('Extract All'));
assert(launchSteps.includes('whole extracted game folder together'));assert(launchSteps.includes(privateData.launcher));
assert(launchSteps.includes('On the mode row'));for(const key of ['Up','Down','Left','Right','Enter'])assert(launchSteps.includes(`<kbd>${key}</kbd>`));
const savedHelp=both.match(/<details id="saved-camp-help">([\s\S]*?)<\/details>/)?.[1];
assert(savedHelp,'Saved camps need a compact expandable explanation');
for(const text of ['Start New:','Resume:','Load Saved Game:','without overwriting','saved mode','earlier builds'])assert(savedHelp.includes(text));
const lanHelp=both.match(/<details id="lan-play-help">([\s\S]*?)<\/details>/)?.[1];
assert(lanHelp,'LAN and hardware limits need an expandable section');
for(const text of ['<kbd>F2</kbd>','same build','same local network','HOST MY CAMP','JOIN CAMP','local IP address','JOIN ADDRESS','one computer','has not been tested'])assert(lanHelp.includes(text));
const publicOnly=await render(null);assert(publicOnly.includes(publicData.url));assert(!publicOnly.includes(privateData.url));
assert(!publicOnly.includes('launch-steps'));assert(!publicOnly.includes('saved-camp-help'));assert(!publicOnly.includes('lan-play-help'));
const privateOnly=await render(privateData,null);assert(privateOnly.includes(privateData.url));assert(!privateOnly.includes(publicData.url));
const invalidPrivate=await render({...privateData,url:'https://example.invalid/fake.zip'});assert(!invalidPrivate.includes('example.invalid'));assert(invalidPrivate.includes(publicData.url));
const invalidPublic=await render(privateData,{...publicData,url:privateData.url});assert(!invalidPublic.includes('id="public-playtest"'));
assert.equal(await render(null,null),'fallback');
const escaped=await render({...privateData,summary:'<img src=x onerror="alert(1)">'});assert(escaped.includes('&lt;img'));assert(!escaped.includes('<img'));
const escapedLaunch=await render({...privateData,filename:'<svg onload="alert(1)">.zip',launcher:'<img src=x>.cmd'});
assert(escapedLaunch.includes('&lt;svg'));assert(escapedLaunch.includes('&lt;img'));assert(!escapedLaunch.includes('<svg'));assert(!escapedLaunch.includes('<img'));
console.log('PASS: separate access labels, launch/menu/LAN instructions, hardware limits, both downloads, failed-fetch isolation, URL rejection and escaped data.');
