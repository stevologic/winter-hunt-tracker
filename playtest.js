(async () => {
  const safe = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list = items => items.map(x => `<li>${safe(x)}</li>`).join('');
  const load = async path => {
    const response = await fetch(path);
    if (!response.ok) throw Error('Playtest details unavailable');
    return response.json();
  };
  function privateCard(d) {
    if (d.state !== 'private-playtest' || d.access !== 'github-private-draft') return '';
    if (!/^https:\/\/github\.com\/stevologic\/[a-z0-9-]+\/releases\/tag\/untagged-[a-f0-9]+$/.test(d.url)) throw Error('Unapproved private release route');
    return `<div class="private-playtest" id="private-playtest">
      <p class="eyebrow">LATEST WINDOWS PLAYTEST · ${safe(d.version)}</p>
      <h2>Try the latest hunt.</h2>
      <p>${safe(d.summary)}</p>
      <p class="release-date">Built ${safe(d.builtDate)} · ${(d.bytes / 1048576).toFixed(1)} MiB · Work in progress</p>
      <span class="badge in-progress">Private playtest · acceptance pending</span>
      <p class="access-note" id="private-access"><strong>GitHub sign-in required.</strong> You also need existing permission to view the private draft release. GitHub may show a 404 if your account cannot access it.</p>
      <a class="button" href="${safe(d.url)}" aria-describedby="private-access">Open ${safe(d.version)} playtest <span aria-hidden="true">↗</span></a>
      <p class="launch-note">On GitHub, download the ZIP under <strong>Assets</strong>. Extract All, then double-click <strong>${safe(d.launcher)}</strong> to start ${safe(d.executable)} with separate playtest saves.</p>
      <p class="baseline-note">Human listening/gameplay, separate-PC Steam/network play and Steam Deck/controller checks are still pending. This playtest is not release-ready.</p>
      <details><summary>Checks and unfinished work +</summary><p>${safe(d.verification)}</p><ul>${list(d.knownLimits)}</ul></details>
      <details><summary>Verify the private ZIP +</summary><p class="hash">${safe(d.filename)}<br>${safe(d.bytes)} bytes<br>SHA-256<br>${safe(d.sha256)}</p></details>
    </div>`;
  }
  function publicCard(d) {
    if (d.state !== 'verified') return '';
    if (!/^https:\/\/github\.com\/stevologic\/winter-hunt-tracker\/releases\/download\/[^?#]+\.zip$/.test(d.url)) throw Error('Unapproved public download route');
    return `<div class="public-playtest" id="public-playtest">
      <p class="eyebrow">PUBLIC BASELINE · ${safe(d.version)}</p>
      <h2>The open trail.</h2>
      <p>The earlier public Windows ZIP stays available. No GitHub sign-in needed.</p>
      <p class="release-date">Published ${safe(d.publishedDate)} · ${(d.bytes / 1048576).toFixed(1)} MiB<br>Built ${safe(d.builtDate)}</p>
      <a class="button public-download" href="${safe(d.url)}">Download public ${safe(d.version)} ZIP <span aria-hidden="true">↓</span></a>
      <p class="baseline-note"><strong>Older tested baseline.</strong> Includes historical short AI video endings. The newer in-scene finale, Santa/Frost Harpoon/flamethrower and Zombie Mode are not in this ZIP. Steam Internet invites and physical Deck acceptance remain unverified.</p>
      <p class="launch-note">Extract All and double-click <strong>${safe(d.executable)}</strong>. Keep the whole game folder together.</p>
      <details><summary>What's in this baseline? +</summary><ul>${list(d.features)}</ul></details>
      <details><summary>Known rough edges +</summary><ul>${list(d.knownLimits)}</ul></details>
      <details><summary>Verify the public ZIP +</summary><p class="hash">${safe(d.filename)}<br>${safe(d.bytes)} bytes<br>SHA-256<br>${safe(d.sha256)}</p><p>${safe(d.verification)}</p></details>
    </div>`;
  }
  const results = await Promise.allSettled([load('data/private-playtest.json'), load('data/playtest.json')]);
  const renderers = [privateCard, publicCard];
  const cards = results.map((result, index) => {
    if (result.status !== 'fulfilled') return '';
    try { return renderers[index](result.value); } catch { return ''; }
  }).join('');
  if (cards) document.querySelector('#play').innerHTML = cards;
})();
