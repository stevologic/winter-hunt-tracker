(async () => {
  const safe = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list = items => items.map(x => `<li>${safe(x)}</li>`).join('');
  const load = async path => {
    const response = await fetch(path, {cache: 'no-store'});
    if (!response.ok) throw Error('Playtest details unavailable');
    return response.json();
  };
  function latestCard(d) {
    if (d.state !== 'public-test' || d.access !== 'public-release' || d.publicDownloadVerified !== true) return '';
    if (!/^https:\/\/github\.com\/stevologic\/winter-hunt-tracker\/releases\/download\/[^?#]+\.zip$/.test(d.url)) throw Error('Unapproved public test route');
    if (!/^https:\/\/github\.com\/stevologic\/winter-hunt-tracker\/releases\/tag\/[a-z0-9-]+$/.test(d.releaseUrl)) throw Error('Unapproved release page');
    return `<div class="latest-playtest" id="latest-playtest">
      <p class="eyebrow">LATEST PUBLIC WINDOWS DIAGNOSTIC PLAYTEST</p><h2>Download the latest hunt.</h2>
      <p>${safe(d.summary)}</p><p class="release-date">${safe(d.version)} | Build completed ${safe(d.builtDatePhoenix)} | ${(d.bytes / 1048576).toFixed(1)} MiB<br>Released for testing ${safe(d.publishedDatePhoenix)}</p>
      <span class="badge in-progress">Diagnostic playtest | broader acceptance open</span>
      <p class="access-note"><strong>No GitHub sign-in needed.</strong> Visual05 and earlier downloads remain archived below.</p>
      <a class="button latest-download" href="${safe(d.url)}">Download latest Windows test ZIP <span aria-hidden="true">&darr;</span></a>
      <p class="release-link"><a href="${safe(d.releaseUrl)}">Release notes and GitHub Assets</a></p>
      <p data-domain-status>Direct GitHub HTTPS download verified. winter-hunt.com certificate repair remains pending approval; custom-domain delivery is not claimed.</p>
      <h3 class="launch-title">Extract and launch</h3><p class="launch-scope">Source-derived steps; no-argument startup and interactive opening-menu acceptance remain open for this exact package.</p><ol class="latest-launch-steps">
        <li>Download <code>${safe(d.filename)}</code>, then choose <strong>Extract All</strong> into a new folder.</li>
        <li>Keep <code>WinterHunt_Data</code>, <code>WinterHunt.launch.json</code>, runtime folders, <code>Notices</code> and all DLLs together.</li>
        <li>Double-click <strong><code>${safe(d.executable)}</code></strong>. No CMD launcher, arguments or developer tools are required. Keep normal Windows security prompts.</li>
        <li>Choose Normal or Zombie, then Start New. Load/Resume retains its saved mode. Hunter is the current playable class. This build uses isolated saves; older saves are preserved, not migrated.</li>
      </ol>
      <details class="latest-friends"><summary>Play with friends / source-derived steps</summary><ol>
        <li>Every player uses this exact ZIP. Start or load a camp, then press <kbd>F2</kbd> for Friends. <kbd>Tab</kbd> or <kbd>F3</kbd> opens the camp board.</li>
        <li>For LAN play, the host selects <strong>HOST MY CAMP</strong>; guests select the local camp or enter its local IPv4 and select <strong>JOIN ADDRESS</strong>. See <code>START-HERE.txt</code> for controls and LAN/Internet prerequisites.</li>
        <li>The party limit is six including the host. The passed diagnostic used two headless processes on one PC; separate-PC/Internet and six-player reliability remain unverified. Steam invites/relay are unavailable in this diagnostic profile.</li>
      </ol><p>Keep the host running. Returning guests should load the same local saved camp before rejoining the same host/camp. Do not disable security settings or bypass certificate warnings.</p></details>
      <p class="baseline-note"><strong>Test build, not release-ready.</strong> Six-role/Horde/full-purchase, no-argument/menu/restart, human/controller/Deck, separate-PC and sustained 30 FPS gates remain open.</p>
      <p class="subtext">${safe(d.packagingNote ?? '')}</p>
      <details><summary>Included features and known limitations +</summary><ul>${list(d.features)}</ul><ul>${list(d.knownLimits)}</ul></details>
      <details><summary>Exact build, ZIP hash and verification +</summary><p class="hash">${safe(d.buildId)}<br>${safe(d.bytes)} bytes<br>SHA-256: ${safe(d.sha256)}<br>Source recorded in package: ${safe(d.sourceRevision)}<br>Later verified source commit: ${safe(d.verifiedSourceCommit ?? 'Not recorded')}<br>Payload: ${safe(d.payloadFingerprint)}<br>Protocol: ${safe(d.protocol)} / save schema ${safe(d.saveVersion)}</p><p>${safe(d.verification)}</p></details>
    </div>`;
  }
  function visual05Archive(d) {
    if (d.state !== 'public-test' || d.access !== 'public-release' || d.publicDownloadVerified !== true) return '';
    if (d.sha256 !== '6b81e6d98ad0fdafcceef0fc1ce2d90c5759b8b0852495a2b9599b0d1017be52' || d.bytes !== 162129007) throw Error('Visual05 archive identity changed');
    if (d.url !== 'https://github.com/stevologic/winter-hunt-tracker/releases/download/playtest-core9-visual05-334bfefe/WinterHunt-Win-Diagnostic-20261012-051434-aee0f8e-wt334BFEFE.zip') throw Error('Unapproved Visual05 archive route');
    if (d.protocol !== 'winter-hunt-party-58' || d.saveVersion !== 22) throw Error('Visual05 archive version changed');
    return `<details class="archived-visual05" id="visual05-archive"><summary>Preserved Visual05 / 334BFEFE public test download</summary>
      <p>Unchanged earlier public package. It remains available when a newer build becomes the primary download.</p>
      <p><a href="${safe(d.url)}">Download Visual05 / 334BFEFE ZIP</a> · No GitHub sign-in needed.</p>
      <p>Released ${safe(d.publishedDatePhoenix)}. Protocol 58 / save schema 22. Every friend must use this exact build; newer candidate instructions and content do not apply to it.</p>
      <p>Extract All into a separate folder, keep the full game folder together and double-click <code>WinterHunt.exe</code>. Open Friends to host a camp; LAN friends select that camp. Internet Host/Join requires a supplied reachable address. Separate-PC and separate-network human multiplayer remain unverified.</p>
      <p>The exact public package passed Solo smoke and bounded initialized Zombie presence, then failed its complete cooperative diagnostic. Horde/cooperative-purchase and interactive opening-menu, human/controller/Deck and performance acceptance remain open.</p>
      <p class="hash">${safe(d.filename)}<br>${safe(d.bytes)} bytes<br>SHA-256: ${safe(d.sha256)}</p>
    </details>`;
  }
  function privateCard(d) {
    if (d.state !== 'private-playtest' || d.access !== 'github-private-draft') return '';
    if (!/^https:\/\/github\.com\/stevologic\/[a-z0-9-]+\/releases\/tag\/untagged-[a-f0-9]+$/.test(d.url)) throw Error('Unapproved private release route');
    return `<div class="private-playtest" id="private-playtest">
      <p class="eyebrow">EARLIER PRIVATE WINDOWS PLAYTEST · ${safe(d.version)}</p>
      <h2>Earlier private playtest.</h2>
      <p>${safe(d.summary)}</p>
      <p class="release-date">Built ${safe(d.builtDate)} · ${(d.bytes / 1048576).toFixed(1)} MiB · Work in progress</p>
      <span class="badge in-progress">Earlier private draft · not publicly released</span>
      <p class="release-date">Private draft: not publicly released; no public release date.</p>
      <p class="access-note" id="private-access"><strong>GitHub sign-in required.</strong> You also need existing permission to view the private draft release. GitHub may show a 404 if your account cannot access it.</p>
      <a class="button" href="${safe(d.url)}" aria-describedby="private-access">Open ${safe(d.version)} playtest <span aria-hidden="true">↗</span></a>
      <h3 class="launch-title">Download and launch</h3>
      <ol class="launch-steps">
        <li><strong>Sign in to GitHub</strong> with the account that has access to this private playtest.</li>
        <li>Open the private release above, expand <strong>Assets</strong> and download <code>${safe(d.filename)}</code>.</li>
        <li>In File Explorer, choose <strong>Extract All</strong>. Keep the whole extracted game folder together.</li>
        <li>Inside that folder, double-click <code>${safe(d.launcher)}</code> to start the game with separate playtest saves and settings.</li>
        <li>At the opening menu, use <kbd>Up</kbd>/<kbd>Down</kbd> to select a row. On the mode row, <kbd>Left</kbd>/<kbd>Right</kbd> chooses Normal or Zombie. Select an action and press <kbd>Enter</kbd>.</li>
      </ol>
      <details id="saved-camp-help"><summary>Normal, Zombie and saved camps +</summary>
        <ul>
          <li><strong>Start New:</strong> creates a separate camp in the selected mode without overwriting an existing camp.</li>
          <li><strong>Resume:</strong> continues the saved camp in its saved mode, even if the selector shows the other mode.</li>
          <li><strong>Load Saved Game:</strong> choose an existing camp, then press <kbd>Enter</kbd>. Its saved mode and state are retained.</li>
        </ul>
        <p>The mode selector applies to Start New. This launcher keeps this build's saves separate; earlier builds' camps are not automatically listed here.</p>
      </details>
      <details id="lan-play-help"><summary>LAN / Steam Deck +</summary>
        <ol>
          <li>On each Windows PC, use this same build and the same local network. Start or load your camp, then press <kbd>F2</kbd> for Friends.</li>
          <li>The host selects <strong>HOST MY CAMP</strong>. Friends select the host's named <strong>JOIN CAMP</strong> row.</li>
          <li>If the camp is not listed, enter the host's local IP address in the manual address field and select <strong>JOIN ADDRESS</strong>.</li>
        </ol>
        <p>Separate-PC play is still unverified; automated co-op checks used multiple game processes on one computer. Internet play, Steam invites and voice still need a real playtest.</p>
        <p>Steam Deck/controller hardware has not been tested. Verified Deck installation steps are not available for this Windows build.</p>
      </details>
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
      <p class="release-date">Released ${safe(publicationDates[d.version]?.phoenix ?? d.publishedDate)} · ${(d.bytes / 1048576).toFixed(1)} MiB<br>Built ${safe(d.builtDate)}</p>
      <a class="button public-download" href="${safe(d.url)}">Download older ${safe(d.version)} ZIP (no Zombie Mode) <span aria-hidden="true">↓</span></a>
      <p class="baseline-note"><strong>Older tested baseline.</strong> Includes historical short AI video endings. The newer in-scene finale, Santa/Frost Harpoon/flamethrower and Zombie Mode are not in this ZIP. Steam Internet invites and physical Deck acceptance remain unverified.</p>
      <p class="launch-note">Extract All and double-click <strong>${safe(d.executable)}</strong>. Keep the whole game folder together.</p>
      <details><summary>What's in this baseline? +</summary><ul>${list(d.features)}</ul></details>
      <details><summary>Known rough edges +</summary><ul>${list(d.knownLimits)}</ul></details>
      <details><summary>Verify the public ZIP +</summary><p class="hash">${safe(d.filename)}<br>${safe(d.bytes)} bytes<br>SHA-256<br>${safe(d.sha256)}</p><p>${safe(d.verification)}</p></details>
    </div>`;
  }
  const results = await Promise.allSettled([load('data/latest-playtest.json?v=assets34-198dc281'), load('data/private-playtest.json'), load('data/playtest.json'), load('data/download-dates.json?v=assets34-198dc281'), load('data/visual05-playtest.json?v=visual05-334bfefe')]);
  const publicationDates = results[3]?.status === 'fulfilled' ? (results[3].value.publicReleaseDates ?? {}) : {};
  const renderers = [latestCard, privateCard, publicCard];
  const rendered = results.slice(0, 3).map((result, index) => {
    if (result.status !== 'fulfilled') return '';
    try { return renderers[index](result.value); } catch { return ''; }
  });
  let archive = '';
  if (results[4]?.status === 'fulfilled') { try { archive = visual05Archive(results[4].value); } catch { /* Preserve the static archive link below. */ } }
  const cards = rendered[0] + ((archive || rendered[1] || rendered[2]) ? `<details class="previous-builds"><summary>Previous builds / archived downloads and instructions</summary>${archive}${rendered[2]}${rendered[1]}</details>` : '');
  if (cards) {
    const target = document.querySelector('#play');
    const fallback = cards.includes('id="latest-playtest"') ? '' : (target.innerHTML.match(/<div[^>]*data-latest-fallback[^>]*>[\s\S]*?<\/div>/)?.[0] ?? '');
    const archiveFallback = archive ? '' : (target.innerHTML.match(/<p[^>]*data-visual05-archive[^>]*>[\s\S]*?<\/p>/)?.[0] ?? '');
    const olderFallback = rendered[2] ? '' : (target.innerHTML.match(/<p[^>]*data-older-public-fallback[^>]*>[\s\S]*?<\/p>/)?.[0] ?? '');
    target.innerHTML = fallback + cards + archiveFallback + olderFallback;
  }
})();
