(() => {
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stat = value => value === null ? 'â€”' : esc(value);
  fetch('data/production.json').then(response => {
    if (!response.ok) throw Error('Production roadmap unavailable');
    return response.json();
  }).then(data => {
    const candidate = data.candidate;
    document.querySelector('#production-summary').textContent = data.summary;
    document.querySelector('#candidate-evidence').innerHTML = `
      <span class="badge in-progress">${esc(candidate.state)}</span>
      <h3>Core8 / ${esc(candidate.base)} + uncommitted recovery</h3>
      <p>${esc(candidate.passed)}</p><p>${esc(candidate.limits)}</p>
      <p class="subtext">${esc(candidate.camp)}</p>
      <h4>Measured horde phases</h4>
      <div class="performance-scroll" role="region" aria-label="Measured horde phases" tabindex="0"><table class="performance-table">
        <caption>Staged ordinary-AI results; the overall Horde gate failed.</caption>
        <thead><tr><th scope="col">Target / actual live</th><th scope="col">Active / moving / proxies</th><th scope="col">Mean FPS</th><th scope="col">p95 frame</th><th scope="col">Result</th></tr></thead>
        <tbody>${candidate.performance.map(row => `<tr><th scope="row">${esc(row.target)} / ${esc(row.live)}</th><td>${stat(row.active)} / ${stat(row.moving)} / ${stat(row.proxies)}</td><td>${row.fps === null ? 'â€”' : row.fps.toFixed(2)}</td><td>${row.p95Ms === null ? 'â€”' : row.p95Ms.toFixed(3) + ' ms'}</td><td>${esc(row.state)}</td></tr>`).join('')}</tbody>
      </table></div>
      <p class="subtext">${esc(candidate.measurement)}</p>
      <p><strong>Route reliability:</strong> ${esc(candidate.route)}</p>
      <p class="subtext">${esc(candidate.optimization)}</p>
      ${data.routine ? `<div class="production-gate"><span class="badge in-progress">${esc(data.routine.label)}</span><h4>Later routine work, separate evidence</h4><p>${esc(data.routine.passed)}</p><p class="subtext">${esc(data.routine.visual)}</p><p>${esc(data.routine.limits)}</p><details><summary>Exact routine source</summary><p class="source-fingerprint">${esc(data.routine.source)}</p></details></div>` : ''}
      <details><summary>Exact diagnostic source</summary><p class="source-fingerprint">${esc(candidate.base)} + working-tree:${esc(candidate.fingerprint)}</p><p class="subtext">This identity describes the private diagnostic only. It is not a new downloadable release.</p></details>`;
    document.querySelector('#production-phases').innerHTML = data.phases.map(phase => `
      <li id="production-${esc(phase.id)}"><article><span class="badge ${phase.state === 'In progress' ? 'in-progress' : 'requested'}">${esc(phase.state)}</span><h3>${esc(phase.title)}</h3>
      <details><summary>Requested behavior and acceptance +</summary><ul>${phase.criteria.map(item => `<li>${esc(item)}</li>`).join('')}</ul></details>
      <p class="production-gate"><strong>Remaining gate:</strong> ${esc(phase.gate)}</p></article></li>`).join('');
  }).catch(() => {
    document.querySelector('#production-summary').textContent = 'The production roadmap could not load. Refresh or open the auditable production roadmap below.';
  });
})();
