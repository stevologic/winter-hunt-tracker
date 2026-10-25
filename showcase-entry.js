// The page and poster are complete before any 3D code or models are requested.
const root = document.querySelector('#camp-showcase');
const load = document.querySelector('#load-scene');
const status = document.querySelector('#scene-status');
const controls = document.querySelector('#scene-controls');
let scene;
let loading = false;
let inView = true;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const unavailable = message => {
  root.dataset.state = 'fallback';
  status.textContent = message;
  load.hidden = false;
  load.disabled = false;
  load.textContent = 'Try 3D again';
  controls.hidden = true;
};
if (root && load && status) {
  load.hidden = false;
  if (reduced.matches) status.textContent = 'Still view. 3D opens without automatic motion.';
  load.addEventListener('click', async () => {
    if (loading) return;
    loading = true;
    load.disabled = true;
    status.textContent = 'Opening camp…';
    try {
      scene?.dispose();
      const {createCamp} = await import('./static/showcase.js');
      scene = await createCamp(root, {
        reducedMotion: reduced.matches,
        onLost: () => { stopMotion(); unavailable('3D paused by your device. The still view is available.'); },
        onRestored: () => {
          status.textContent = '3D is ready again. Drag to look around, or use the view buttons.';
          root.dataset.state = 'ready';
          load.hidden = true;
          controls.hidden = false;
        }
      });
      stopMotion();
      scene.setSnow(document.querySelector('#scene-snow').getAttribute('aria-pressed') === 'true');
      root.dataset.state = 'ready';
      load.hidden = true;
      controls.hidden = false;
      status.textContent = 'Drag to look around, or use the view buttons. Motion starts paused.';
      document.querySelector('#view-reset').focus({preventScroll: true});
    } catch {
      scene?.dispose();
      scene = undefined;
      unavailable('3D is unavailable here. Enjoy the still view and gameplay below.');
    } finally { loading = false; }
  });
  document.querySelector('#view-left').addEventListener('click', () => scene?.rotate(-0.16));
  document.querySelector('#view-right').addEventListener('click', () => scene?.rotate(0.16));
  document.querySelector('#view-reset').addEventListener('click', () => scene?.reset());
  const motion = document.querySelector('#scene-motion');
  const stopMotion = () => { scene?.setMotion(false); motion.setAttribute('aria-pressed', 'false'); motion.textContent = 'Enable motion'; };
  motion.addEventListener('click', () => {
    const enabled = motion.getAttribute('aria-pressed') !== 'true';
    scene?.setMotion(enabled);
    motion.setAttribute('aria-pressed', String(enabled));
    motion.textContent = enabled ? 'Pause motion' : 'Enable motion';
  });
  const snow = document.querySelector('#scene-snow');
  snow.addEventListener('click', () => {
    const enabled = snow.getAttribute('aria-pressed') !== 'true';
    snow.setAttribute('aria-pressed', String(enabled));
    scene?.setSnow(enabled);
  });
  reduced.addEventListener('change', () => { if (reduced.matches) stopMotion(); });
  document.addEventListener('visibilitychange', () => scene?.setVisible(inView && !document.hidden));
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; scene?.setVisible(inView && !document.hidden); }, {threshold: 0.05}).observe(root);
  window.addEventListener('pagehide', () => { scene?.dispose(); scene = undefined; });
  window.addEventListener('pageshow', event => { if (event.persisted) { stopMotion(); unavailable('Still view. Open camp in 3D whenever you like.'); } });
}
