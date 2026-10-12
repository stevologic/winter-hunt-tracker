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
      <p class="eyebrow">LATEST PUBLIC WINDOWS TEST BUILD</p><h2>Download the latest hunt.</h2>
      <p>${safe(d.summary)}</p><p class="release-date">${safe(d.version)} · Built ${safe(d.builtDatePhoenix)} · ${(d.bytes / 1048576).toFixed(1)} MiB<br>Released for testing ${safe(d.publishedDatePhoenix)}</p>
      <span class="badge in-progress">Test build · acceptance pending</span>
      <p class="access-note"><strong>No GitHub sign-in needed.</strong> Earlier working downloads remain below.</p>
      <a class="button latest-download" href="${safe(d.url)}">Download latest Windows test ZIP <span aria-hidden="true">↓</span></a>
      <p class="release-link"><a href="${safe(d.releaseUrl)}">Release notes and GitHub Assets</a></p>
      <h3 class="launch-title">Extract and launch</h3><ol class="latest-launch-steps">
        <li>Download <code>${safe(d.filename)}</code>, then choose <strong>Extract All</strong> in File Explorer.</li>
        <li>Keep the whole extracted game folder together, including <code>WinterHunt_Data</code>, <code>WinterHunt.launch.json</code>, <code>MonoBleedingEdge</code>, <code>D3D12</code>, <code>Notices</code> and all DLLs.</li>
        <li>Double-click <strong><code>${safe(d.executable)}</code></strong>. No CMD launcher, arguments or manual setup is required. Retain legitimate Windows security prompts.</li>
        <li>At the opening menu select the mode row, use Left/Right to choose <strong>Zombie</strong> or Normal, then select <strong>Start New</strong> and press Enter. Load Saved Game / Resume retain their saved mode. This build uses a separate profile, preserving older saves. Every co-op player needs this exact build.</li>
      </ol>
      <p class="baseline-note"><strong>Test candidate, not release-ready.</strong> The retained Zombie Horde and full cooperative-purchase gates remain failed/open. Full gameplay and human playtest, Internet/Steam and controller/Deck checks remain unfinished.</p>
      <p class="subtext">Bundled private-candidate wording predates the owner's authorization to share this test ZIP publicly. The archive is unchanged; previous downloads and their instructions remain separate below.</p>
      <details><summary>Included features and known limitations +</summary><ul>${list(d.features)}</ul><ul>${list(d.knownLimits)}</ul></details>
      <details><summary>Exact build, ZIP hash and verification +</summary><p class="hash">${safe(d.buildId)}<br>${safe(d.bytes)} bytes<br>SHA-256: ${safe(d.sha256)}<br>Source: ${safe(d.sourceRevision)}<br>Payload: ${safe(d.payloadFingerprint)}<br>Protocol: ${safe(d.protocol)} / save schema ${safe(d.saveVersion)}</p><p>${safe(d.verification)}</p></details>
    </div>`;
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
  const results = await Promise.allSettled([load('data/latest-playtest.json?v=visual05-334bfefe'), load('data/private-playtest.json'), load('data/playtest.json'), load('data/download-dates.json?v=visual05-334bfefe')]);
  const publicationDates = results[3]?.status === 'fulfilled' ? (results[3].value.publicReleaseDates ?? {}) : {};
  const renderers = [latestCard, privateCard, publicCard];
  const cards = results.slice(0, 3).map((result, index) => {
    if (result.status !== 'fulfilled') return '';
    try { return renderers[index](result.value); } catch { return ''; }
  }).join('');
  if (cards) {
    const target = document.querySelector('#play');
    const fallback = cards.includes('id="latest-playtest"') ? '' : (target.innerHTML.match(/<div[^>]*data-latest-fallback[^>]*>[\s\S]*?<\/div>/)?.[0] ?? '');
    target.innerHTML = fallback + cards;
  }
})();
