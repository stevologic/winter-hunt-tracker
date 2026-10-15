(() => {
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stat = value => value === null ? 'Unmeasured' : esc(value);
  fetch('data/production.json?v=tracker-refresh-20261014', {cache:'no-store'}).then(response => {
    if (!response.ok) throw Error('Production roadmap unavailable');
    return response.json();
  }).then(data => {
    const candidate = data.candidate;
    const historical = candidate.historicalDensity;
    document.querySelector('#production-summary').textContent = data.summary;
    document.querySelector('#candidate-evidence').innerHTML = `
      <span class="badge in-progress">${esc(candidate.state)}</span>
      <h3>${esc(candidate.label)}</h3>
      <p>Public test build. Human, Steam Deck/controller, sustained 30 FPS and separate-PC multiplayer acceptance remain open.</p>
      ${data.continuation ? `<aside class="current-work"><p class="eyebrow">${esc(data.continuation.label)}</p><h4>${esc(data.continuation.summary)}</h4><p class="subtext">${esc(data.continuation.asOf)}</p><p>${esc(data.continuation.passed)}</p><p>${esc(data.continuation.pending)}</p><details><summary>Density evidence and remaining hardware gates</summary><p>${esc(data.continuation.density)}</p><p>${esc(data.continuation.gates)}</p></details></aside>` : ''}
      <details class="build-evidence"><summary>Visual05 passed checks, failed diagnostics and historical evidence</summary>
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
      <details><summary>Exact public test source and payload</summary><p class="source-fingerprint">${esc(candidate.base)} + working-tree:${esc(candidate.fingerprint)}</p><p class="source-fingerprint">Payload: ${esc(candidate.payloadFingerprint)}</p><p class="subtext">${esc(candidate.identityNote)}</p></details></details>`;
    document.querySelector('#production-phases').innerHTML = data.phases.map(phase => `
      <li id="production-${esc(phase.id)}"><article><span class="badge ${phase.state === 'In progress' ? 'in-progress' : 'requested'}">${esc(phase.state)}</span><h3>${esc(phase.title)}</h3>
      <details><summary>Requested behavior and acceptance +</summary><ul>${phase.criteria.map(item => `<li>${esc(item)}</li>`).join('')}</ul></details>
      <p class="production-gate"><strong>Remaining gate:</strong> ${esc(phase.gate)}</p></article></li>`).join('');
  }).catch(() => {
    document.querySelector('#production-summary').textContent = 'The production roadmap could not load. Refresh or open the auditable production roadmap below.';
  });
})();
