import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';

const latest = JSON.parse(await readFile('data/latest-playtest.json', 'utf8'));
const archive = JSON.parse(await readFile('data/visual05-playtest.json', 'utf8'));
const old = JSON.parse(await readFile('data/playtest.json', 'utf8'));
const privateData = JSON.parse(await readFile('data/private-playtest.json', 'utf8'));
const dates = JSON.parse(await readFile('data/download-dates.json', 'utf8'));
const html = await readFile('index.html', 'utf8');
const script = await readFile('playtest.js', 'utf8');

const sourceManifest = '198DC2817C39C87ECC182B16D86E439C90870E60279F6119C8F54C67DC55F49D';
const sourceRevision = `e2df9bc87ff14da7625a82b7b4a0f2f70eda48d6+diagnostic-source-manifest:${sourceManifest}`;
const buildId = 'WinterHunt-Private-CoopHorde23-Assets34-20261016-2251';
assert.equal(latest.state, 'public-test');
assert.equal(latest.access, 'public-release');
assert.equal(latest.version, 'Assets34 / Source04 / 198DC281');
assert.equal(latest.buildId, buildId);
assert.equal(latest.filename, `${buildId}.zip`);
assert.equal(latest.url, `https://github.com/stevologic/winter-hunt-tracker/releases/download/playtest-assets34-198dc281/${buildId}.zip`);
assert.equal(latest.releaseUrl, 'https://github.com/stevologic/winter-hunt-tracker/releases/tag/playtest-assets34-198dc281');
assert.equal(latest.sha256, 'beb553565cd8de3c6ceeca81f5ef3478429203ddd308833a106352cfbd0b0eaf');
assert.equal(latest.bytes, 163351250);
assert.equal(latest.executable, 'WinterHunt.exe');
assert.equal(latest.sourceRevision, sourceRevision);
assert.equal(latest.effectiveSourceManifestSha256, sourceManifest);
assert.equal(latest.verifiedSourceCommit, 'a42a4013a71ba27bb0ac8a15394d4e99172bc26d');
assert.match(latest.verifiedSourceCommitNote, /immutable package retains its original diagnostic source provenance/);
assert.equal(latest.payloadFingerprint, 'A98CD9D613E87BDDB722E428A5190241323E7B353140914F323E3F6E71DB3E84');
assert.equal(latest.protocol, 'winter-hunt-party-61');
assert.equal(latest.saveVersion, 24);
for (const field of ['publicDownloadVerified', 'freshExtractionVerified', 'soloSmokePassed', 'zombiePresenceVerified', 'zombieNoPurchaseBaselinePassed']) {
  assert.equal(latest[field], true, field);
}
assert.equal(Object.hasOwn(latest, 'zombieDiagnosticCompletePassed'), false, 'Use the explicit no-purchase baseline field; do not imply broad Zombie acceptance');
for (const field of ['interactiveModeMenuVerified', 'restartPersistenceVerified', 'fullRuntimeAccepted', 'humanAccepted', 'separatePcMultiplayerAccepted', 'performanceAccepted', 'steamReleaseAccepted']) {
  assert.equal(latest[field], false, field);
}
assert.equal(latest.nativeCasesPassed, 63);
assert.deepEqual(latest.sourceEvidence, {
  managedAssembliesPassed: 4,
  soloReceiptSha256: 'FC6E9FDD51BAD9D280D6F8A01E13661E74E8C6B53A66A6514A34A47DED2123B8',
  zombieBaselineReceiptSha256: 'D0CDD6353313597B16D9C4B56C32083BC33FD6025312B9058CD413B8BDB5A601',
  zombieEvidenceFiles: 42
});
assert.match(latest.publicDownloadReceiptSha256, /^[A-Fa-f0-9]{64}$/);
assert(!/^0{64}$/.test(latest.publicDownloadReceiptSha256));
assert.equal(latest.delivery.githubDirectHttpsVerified, true);
assert.equal(latest.delivery.customDomainHttpsVerified, true);
assert.equal(latest.delivery.customDomainStatus, 'winter-hunt.com HTTPS was verified October 20, 2026.');
assert.equal(latest.delivery.lastCustomDomainCheckUtc, '2026-10-20T02:39:18.3882597Z');
assert.match(latest.verification, /headless same-PC two-process no-purchase Zombie baseline/);
assert.match(latest.verification, /same-process save readback, not restart persistence/);
assert.match(latest.verification, /anonymously fetched over normal HTTPS with HTTP 200/);
assert.match(latest.knownLimits.join(' '), /Historical Visual05.*failed evidence is preserved separately/);
assert.match(latest.knownLimits.join(' '), /no purchase branch and explicit fixture setup/);
assert.match(latest.knownLimits.join(' '), /raw licensed assets\/source and private evidence are not release assets/);

// Public dates come from the confirmed release; the build-completion date is a different fact.
function phoenix(utc) {
  const date = new Date(utc);
  assert(!Number.isNaN(date.valueOf()), `Invalid recorded date: ${utc}`);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Phoenix', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  }).formatToParts(date).map(part => [part.type, part.value]));
  return `${parts.month} ${parts.day}, ${parts.year}, ${parts.hour}:${parts.minute} ${parts.dayPeriod.toLowerCase() === 'am' ? 'a.m.' : 'p.m.'} Phoenix (MST / UTC-7)`;
}
assert.equal(latest.builtDateUtc, '2026-10-16T22:50:16.7973934Z');
assert.match(latest.publishedDate, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/);
assert(new Date(latest.publishedDate) >= new Date(latest.builtDateUtc));
assert.equal(latest.builtDatePhoenix, phoenix(latest.builtDateUtc));
assert.equal(latest.publishedDatePhoenix, phoenix(latest.publishedDate));
assert.equal(dates.timezone, 'America/Phoenix');
assert.deepEqual(dates.publicReleaseDates[latest.version], {utc: latest.publishedDate, phoenix: latest.publishedDatePhoenix});
assert.deepEqual(dates.publicReleaseDates[archive.version], {utc: archive.publishedDate, phoenix: archive.publishedDatePhoenix});
assert.equal(dates.publicReleaseDates[old.version].utc, '2026-10-10T08:05:48Z');
assert.equal(dates.privateDraft.publicReleaseDate, null);
assert.equal(archive.protocol, 'winter-hunt-party-58');
assert.equal(archive.saveVersion, 22);
assert.equal(archive.zombieDiagnosticCompletePassed, false);
assert.notEqual(latest.url, archive.url);

assert(html.includes('playtest.js?v=assets34-https-20261020'));
assert(script.includes("cache: 'no-store'"));
const initial = html.match(/<section id="play"[^>]*>([\s\S]*?)<\/section>/)[1];
const fallback = initial.match(/<div[^>]*data-latest-fallback[^>]*>([\s\S]*?)<\/div>/)[1];
for (const value of [latest.url, latest.filename, latest.sha256, String(latest.bytes), latest.publishedDatePhoenix, latest.builtDatePhoenix]) {
  assert(fallback.includes(value), `Static latest fallback must match release identity: ${value}`);
}
assert(fallback.includes('F2 opens Friends; Tab/F3 opens the camp board'));
assert(fallback.includes('Hunter is the current playable class'));
assert(fallback.includes('winter-hunt.com HTTPS was verified October 20, 2026.'));

async function render(next = latest) {
  const target = {innerHTML: initial};
  await runInNewContext(script, {
    document: {querySelector: selector => {assert.equal(selector, '#play'); return target;}},
    fetch: async path => {
      const data = {
        'data/latest-playtest.json': next, 'data/visual05-playtest.json': archive,
        'data/playtest.json': old, 'data/private-playtest.json': privateData,
        'data/download-dates.json': dates
      }[path.split('?')[0]];
      return {ok: data !== null && data !== undefined, json: async () => data};
    }
  });
  return target.innerHTML;
}
const output = await render();
assert(output.indexOf('id="latest-playtest"') < output.indexOf('id="visual05-archive"'));
assert(output.indexOf('id="latest-playtest"') < output.indexOf('id="private-playtest"'));
const current = output.match(/<div class="latest-playtest" id="latest-playtest">([\s\S]*?)<\/div>/)[1];
for (const text of ['No GitHub sign-in needed', 'WinterHunt.exe', 'Extract All', 'WinterHunt.launch.json', 'Notices', 'Hunter is the current playable class', '<kbd>F2</kbd>', '<kbd>Tab</kbd>', '<kbd>F3</kbd>', 'HOST MY CAMP', 'JOIN ADDRESS', 'START-HERE.txt', 'separate-PC/Internet', 'not release-ready', 'Source-derived steps', 'winter-hunt.com HTTPS was verified October 20, 2026.', latest.publishedDatePhoenix, latest.sourceRevision, latest.verifiedSourceCommit]) {
  assert(current.includes(text), `Current playtest card must include ${text}`);
}
assert(!current.includes('failed its complete cooperative diagnostic'), 'Do not label the new scoped baseline with the archived failure');
assert(output.includes('failed its complete cooperative diagnostic'), 'Preserve the historical Visual05 failure');
assert(output.includes('no Zombie Mode'));
assert(output.includes(dates.publicReleaseDates[old.version].phoenix));
for (const invalid of [null, {...latest, url: privateData.url}, {...latest, releaseUrl: 'https://example.invalid/release'}, {...latest, publicDownloadVerified: false}]) {
  const failed = await render(invalid);
  assert(!failed.includes('id="latest-playtest"'));
  assert(failed.includes('data-latest-fallback') && failed.includes(latest.url), 'Failed or invalid metadata must preserve the verified static current download');
  assert(failed.includes(archive.url) && failed.includes(old.url));
}
const escaped = await render({...latest, summary: '<img src=x onerror=alert(1)>'});
assert(escaped.includes('&lt;img') && !escaped.includes('<img'));
const support = JSON.parse(await readFile('data/support.json', 'utf8'));
assert.equal(support.dogecoin.address, 'DTW2M5oEW97WbmYJRM71qD7uE6xfJs1MUK');
assert.equal(support.xMoney.url, 'https://x.com/i/money/pay/MadeItHappenX');
assert.equal(support.transactionsPerformed, false);
assert(html.includes(support.dogecoin.address) && html.includes(support.xMoney.url));
assert(!html.includes('src="world.js"') && !html.includes('href="world.css"'));
assert(!html.includes('AI-generated concept illustration'));
console.log('PASS: exact public Assets34 identity, scoped no-purchase baseline, source/release dates, source-derived controls, verified HTTPS status, safe fallback and preserved archive/support/theme.');
