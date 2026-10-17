import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';

const latestText = await readFile('data/latest-playtest.json', 'utf8');
const archiveBytes = await readFile('data/visual05-playtest.json');
const archiveText = archiveBytes.toString('utf8');
assert.equal(createHash('sha256').update(archiveBytes).digest('hex').toUpperCase(),
  'DC4F3163135677CF4E73B7AE6297511F850AD0F3916F0BCCCBF38B03AFE2B7E6',
  'Visual05 must retain its exact archived manifest bytes after a new latest release');
assert.notEqual(archiveText, latestText, 'Assets34 must have its own current manifest');
const latest = JSON.parse(latestText), archive = JSON.parse(archiveText);
assert.equal(latest.version, 'Assets34 / Source04 / 198DC281');
assert.equal(archive.protocol, 'winter-hunt-party-58');
assert.equal(archive.saveVersion, 22);
assert.equal(archive.zombieDiagnosticCompletePassed, false);
assert.equal(archive.interactiveModeMenuVerified, false);
assert.equal(latest.zombieNoPurchaseBaselinePassed, true);
assert.notEqual(latest.url, archive.url);
const older = JSON.parse(await readFile('data/playtest.json', 'utf8'));
const privateData = JSON.parse(await readFile('data/private-playtest.json', 'utf8'));
const dates = JSON.parse(await readFile('data/download-dates.json', 'utf8'));
const html = await readFile('index.html', 'utf8');
const script = await readFile('playtest.js', 'utf8');
const initial = html.match(/<section id="play"[^>]*>([\s\S]*?)<\/section>/)[1];
assert.match(initial, /data-visual05-archive/);
assert(initial.includes(archive.url), 'The no-JavaScript view must retain the archive link');

async function render({current=latest, archived=archive, oldPublic=older, earlierPrivate=privateData, failAll=false}={}) {
  const target = {innerHTML: initial};
  await runInNewContext(script, {
    document: {querySelector: selector => {assert.equal(selector, '#play'); return target;}},
    fetch: async path => {
      if (failAll) throw Error('Simulated offline metadata');
      const data = {
        'data/latest-playtest.json': current,
        'data/visual05-playtest.json': archived,
        'data/playtest.json': oldPublic,
        'data/private-playtest.json': earlierPrivate,
        'data/download-dates.json': dates
      }[path.split('?')[0]];
      return {ok: data !== null && data !== undefined, json: async () => data};
    }
  });
  return target.innerHTML;
}

const current = await render();
assert(current.includes('id="latest-playtest"'));
assert(current.includes('id="visual05-archive"'));
assert(current.includes(older.url) && current.includes(privateData.url));
assert(current.indexOf(latest.url) < current.indexOf(archive.url), 'Current Assets34 must precede the preserved Visual05 archive');
const archivedSection = current.match(/<details class="archived-visual05"[^>]*>([\s\S]*?)<\/details>/)[1];
assert(archivedSection.includes('Protocol 58 / save schema 22'));
assert(!archivedSection.includes('party-61') && !archivedSection.includes('schema 24'));
assert(archivedSection.includes('separate-network human multiplayer remain unverified'));
assert(archivedSection.includes('failed its complete cooperative diagnostic'));
assert.equal((current.match(/id="visual05-archive"/g) || []).length, 1);

// In-memory fixture only: no new release identity is written to public manifests.
const future = {...latest,
  version: 'future-release-test-fixture',
  url: 'https://github.com/stevologic/winter-hunt-tracker/releases/download/future-fixture/future-fixture.zip',
  releaseUrl: 'https://github.com/stevologic/winter-hunt-tracker/releases/tag/future-fixture',
  filename: 'future-fixture.zip', protocol: 'future-test-protocol', saveVersion: 999};
const futureOutput = await render({current: future});
assert(futureOutput.includes(future.url) && futureOutput.includes(archive.url), 'Replacing latest must preserve Visual05');
assert(futureOutput.indexOf(future.url) < futureOutput.indexOf(archive.url));
const missingArchive = await render({current: future, archived: null});
assert(missingArchive.includes(future.url) && missingArchive.includes(archive.url));
assert(missingArchive.includes('data-visual05-archive'), 'Missing archive JSON must preserve its static link');
const missingLatest = await render({current: null});
assert(missingLatest.includes('data-latest-fallback') && missingLatest.includes('id="visual05-archive"'));
assert.equal(await render({failAll: true}), initial, 'Offline metadata must preserve all static download content');
const archiveOnly = await render({current: null, oldPublic: null, earlierPrivate: null});
assert(archiveOnly.includes('data-latest-fallback') && archiveOnly.includes('id="visual05-archive"'));
assert(archiveOnly.includes('data-older-public-fallback') && archiveOnly.includes(older.url), 'Archive-only metadata must retain the older public link');
const latestOnly = await render({current: future, archived: null, oldPublic: null, earlierPrivate: null});
assert(latestOnly.includes(future.url) && latestOnly.includes(archive.url) && latestOnly.includes(older.url));
assert(latestOnly.includes('data-visual05-archive') && latestOnly.includes('data-older-public-fallback'));
const archiveAndLatest = await render({oldPublic: null, earlierPrivate: null});
assert(archiveAndLatest.includes('id="visual05-archive"') && archiveAndLatest.includes(older.url));
const privateOnly = await render({current: null, archived: null, oldPublic: null});
assert(privateOnly.includes(privateData.url) && privateOnly.includes(archive.url) && privateOnly.includes(older.url));
const olderOnly = await render({current: null, archived: null, earlierPrivate: null});
assert(olderOnly.includes('id="public-playtest"') && olderOnly.includes(archive.url));
assert(!olderOnly.includes('data-older-public-fallback'), 'A rendered old-public card must not duplicate its static fallback');
for (const change of [
  {url: 'https://example.invalid/replacement.zip'},
  {sha256: '0'.repeat(64)}, {bytes: 1},
  {protocol: 'winter-hunt-party-61'}, {saveVersion: 24}
]) {
  const result = await render({archived: {...archive, ...change}});
  assert(!result.includes('id="visual05-archive"'));
  assert(result.includes('data-visual05-archive') && result.includes(archive.url));
  assert(!result.includes('example.invalid'));
}
const escaped = await render({archived: {...archive, filename: '<img src=x>.zip'}});
assert(escaped.includes('&lt;img') && !escaped.includes('<img'));
console.log('PASS: immutable Visual05 archive, future latest replacement, offline/static fallback, archive identity/version rejection and escaped data.');
