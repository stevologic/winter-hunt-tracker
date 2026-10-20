(() => {
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stat = value => value === null ? 'Unmeasured' : esc(value);
  fetch('data/production.json?v=assets34-https-20261020', {cache:'no-store'}).then(response => {
    if (!response.ok) throw Error('Production roadmap unavailable');
    return response.json();
  }).then(data => {
    const candidate = data.candidate;
    const historical = candidate.historicalDensity;
    const current = data.currentRelease ?? candidate;
    document.querySelector('#production-summary').textContent = data.summary;
    document.querySelector('#candidate-evidence').innerHTML = `
      <span class="badge in-progress">${esc(current.state)}</span>
      <h3>${esc(current.label)}</h3>
      <p>Public test build. Human, Steam Deck/controller, sustained 30 FPS and separate-PC multiplayer acceptance remain open.</p>
      ${data.continuation ? `<details class="current-work"><summary>Current Assets34 / exact source and diagnostic record</summary><p class="eyebrow">${esc(data.continuation.label)}</p><h4>${esc(data.continuation.summary)}</h4><p class="subtext">${esc(data.continuation.asOf)}</p><p>${esc(data.continuation.passed)}</p><p>${esc(data.continuation.pending)}</p>${data.continuation.sourceEvidence ? `<details><summary>Exact Assets34 source and scoped evidence</summary><p class="source-fingerprint">Source: ${esc(data.continuation.sourceEvidence.sourceManifestSha256)}</p><p class="source-fingerprint">Managed receipt: ${esc(data.continuation.sourceEvidence.managedReceiptSha256)}</p><p class="source-fingerprint">Scoped evidence: ${esc(data.continuation.sourceEvidence.scopedEvidenceSha256)}</p><p class="source-fingerprint">Build review: ${esc(data.continuation.sourceEvidence.scopedBuildReviewSha256)}</p><p class="subtext">Import, the exact 63 scoped native cases, Windows build and package/extraction integrity checks passed. Scoped packaged Solo and two-process Zombie checks also passed; full runtime, visual fit and human acceptance remain separate.</p></details>` : ''}${data.continuation.sourceEvidence?.package ? `<details><summary>Exact current Assets34 package</summary><p>${esc(data.continuation.sourceEvidence.package.buildId)}</p><p>${esc(data.continuation.sourceEvidence.package.archiveBytes.toLocaleString('en-US'))} bytes; ${esc(data.continuation.sourceEvidence.package.entries)} extracted files verified.</p><p class="source-fingerprint">ZIP SHA-256: ${esc(data.continuation.sourceEvidence.package.archiveSha256)}</p><p class="source-fingerprint">Payload: ${esc(data.continuation.sourceEvidence.package.payloadFingerprint)}</p><p class="subtext">Current Assets34: ${esc(data.continuation.sourceEvidence.package.protocol)}, save schema ${esc(data.continuation.sourceEvidence.package.saveVersion)}. Visual05 retains protocol 58 / save schema 22. The GitHub release date and download are verified. winter-hunt.com HTTPS was verified October 20, 2026.</p></details>` : ''}${data.continuation.sourceEvidence?.runtimeEvidence ? `<details><summary>Exact scoped runtime receipts / broader acceptance remains open</summary><p class="source-fingerprint">Solo: ${esc(data.continuation.sourceEvidence.runtimeEvidence.solo.summarySha256)}</p><p class="source-fingerprint">Two-process Zombie baseline: ${esc(data.continuation.sourceEvidence.runtimeEvidence.zombieBaseline.summarySha256)}</p><p>Headless same-PC baseline, no purchase branch: ${esc(data.continuation.sourceEvidence.runtimeEvidence.zombieBaseline.actualKills)} actual kills / ${esc(data.continuation.sourceEvidence.runtimeEvidence.zombieBaseline.actualBowShots)} bow shots. Both roles exited naturally with code 0; ${esc(data.continuation.sourceEvidence.runtimeEvidence.zombieBaseline.evidenceFilesVerified)} saved evidence files verified. Save readback within this diagnostic does not prove persistence across a process restart.</p></details>` : ''}${data.continuation.visualReview ? `<p>${esc(data.continuation.visualReview)}</p><p>${esc(data.continuation.visualLimits)}</p>` : ''}${data.continuation.assetStages ? `<ul>${data.continuation.assetStages.map(stage => `<li><strong>${esc(stage.label)}:</strong> ${esc(stage.detail)}</li>`).join('')}</ul>` : ''}<p>${esc(data.continuation.density)}</p><p>${esc(data.continuation.gates)}</p></details>` : ''}
      <details class="build-evidence"><summary>Archived Visual05 passed checks, failed diagnostics and historical evidence</summary>
      <p>${esc(candidate.passed)}</p><p>${esc(candidate.limits)}</p>
      <p class="subtext">${esc(candidate.camp)}</p>
      <h4>Recorded Visual05 Flight workload</h4>
      <p class="subtext">${esc(candidate.flight)}</p>
      <h4>${esc(historical.label)}</h4>
      <div class="performance-scroll" role="region" aria-label="Historical Core8 measured horde phases" tabindex="0"><table class="performance-table">
        <caption>Historical Core8 staged ordinary-AI results; the overall Horde gate failed. These are not Visual05 density results.</caption>
        <thead><tr><th scope="col">Target / actual live</th><th scope="col">Active / moving / proxies</th><th scope="col">Mean FPS</th><th scope="col">p95 frame</th><th scope="col">Result</th></tr></thead>
        <tbody>${historical.performance.map(row => `<tr><th scope="row">${esc(row.target)} / ${esc(row.live)}</th><td>${stat(row.active)} / ${stat(row.moving)} / ${stat(row.proxies)}</td><td>${row.fps === null ? 'Unmeasured' : row.fps.toFixed(2)}</td><td>${row.p95Ms === null ? 'Unmeasured' : row.p95Ms.toFixed(3) + ' ms'}</td><td>${esc(row.state)}</td></tr>`).join('')}</tbody>
      </table></div>
      <p class="subtext">${esc(historical.measurement)}</p>
      <p><strong>Historical route reliability:</strong> ${esc(historical.route)}</p>
      <p class="subtext">${esc(historical.optimization)}</p>
      <details><summary>Historical density source</summary><p class="source-fingerprint">${esc(historical.base)} + working-tree:${esc(historical.fingerprint)}</p></details>
      ${data.routine ? `<div class="production-gate"><span class="badge in-progress">${esc(data.routine.label)}</span><h4>Preserved historical staged evidence</h4><p>${esc(data.routine.passed)}</p><p class="subtext">${esc(data.routine.visual)}</p><p>${esc(data.routine.limits)}</p><details><summary>Exact historical routine source</summary><p class="source-fingerprint">${esc(data.routine.source)}</p></details></div>` : ''}
      <details><summary>Exact archived Visual05 source and payload</summary><p class="source-fingerprint">${esc(candidate.base)} + working-tree:${esc(candidate.fingerprint)}</p><p class="source-fingerprint">Payload: ${esc(candidate.payloadFingerprint)}</p><p class="subtext">${esc(candidate.identityNote)}</p></details></details>`;
    document.querySelector('#production-phases').innerHTML = data.phases.map(phase => `
      <li id="production-${esc(phase.id)}"><article><span class="badge ${phase.state === 'In progress' ? 'in-progress' : 'requested'}">${esc(phase.state)}</span><h3>${esc(phase.title)}</h3>
      <details><summary>Requested behavior and acceptance +</summary><ul>${phase.criteria.map(item => `<li>${esc(item)}</li>`).join('')}</ul></details>
      <p class="production-gate"><strong>Remaining gate:</strong> ${esc(phase.gate)}</p></article></li>`).join('');
  }).catch(() => {
    document.querySelector('#production-summary').textContent = 'The production roadmap could not load. Refresh or open the auditable production roadmap below.';
  });
})();
