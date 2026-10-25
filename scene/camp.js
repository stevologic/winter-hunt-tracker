import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const base = new URL('../assets/showcase/', import.meta.url);
export async function createCamp(host, {onLost, onRestored}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'camp-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias: false, alpha: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true}); }
  catch (error) { canvas.remove(); throw error; }
  const world = new THREE.Scene();
  world.background = new THREE.Color('#24363d');
  world.fog = new THREE.Fog('#24363d', 25, 64);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.5, 100);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  // One pass. No dynamic shadows, postprocessing, controls dependency, or audio.
  const sky = new THREE.HemisphereLight('#9cbfd8', '#253238', 1.25);
  world.add(sky);
  const moon = new THREE.DirectionalLight('#bacbd6', 1.45);
  moon.position.set(-6, 12, 4);
  world.add(moon);
  const fireLight = new THREE.PointLight('#ff9b43', 95, 10, 2);
  fireLight.position.set(0, 1.5, 3);
  world.add(fireLight);
  const assets = new Map();
  let disposed = false, contextLost = false, visible = true, motion = false, snowEnabled = true;
  let yaw = 0.08, frame = 0, lastFrame = 0, elapsed = 0, drag;
  const geometries = new Set(), materials = new Set(), textures = new Set();
  const track = object => object.traverse(node => {
    if (node.geometry) geometries.add(node.geometry);
    for (const material of (Array.isArray(node.material) ? node.material : node.material ? [node.material] : [])) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  const clean = () => {
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    for (const texture of textures) { texture.dispose(); texture.source?.data?.close?.(); }
    geometries.clear(); materials.clear(); textures.clear();
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    canvas.removeEventListener('webglcontextlost', lost);
    canvas.removeEventListener('webglcontextrestored', restored);
    canvas.removeEventListener('pointerdown', down);
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointercancel', up);
    clean(); renderer.dispose(); canvas.remove();
  };
  const view = () => {
    camera.position.set(Math.sin(yaw) * 24, 10.5, Math.cos(yaw) * 24);
    camera.lookAt(0, 1.8, 0);
  };
  const render = () => {
    if (disposed || contextLost || !visible) return;
    view(); renderer.render(world, camera);
    host.dataset.drawCalls = String(renderer.info.render.calls);
    host.dataset.triangles = String(renderer.info.render.triangles);
    host.dataset.renderWidth = String(canvas.width);
    host.dataset.renderHeight = String(canvas.height);
  };
  const resize = () => {
    const {width, height} = host.getBoundingClientRect();
    if (!width || !height || disposed) return;
    // Cap both DPR and absolute pixels even on large, high-density screens.
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(1_200_000 / (width * height))));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width / height < 1.2 ? 48 : 36;
    camera.updateProjectionMatrix(); render();
  };
  const observer = new ResizeObserver(resize);
  const lost = event => { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); motion = false; onLost(); };
  const restored = () => { if (disposed) return; contextLost = false; resize(); onRestored(); };
  const down = event => { if (event.isPrimary && event.button === 0) { drag = {x: event.clientX, yaw}; canvas.setPointerCapture(event.pointerId); } };
  const move = event => { if (drag) { yaw = THREE.MathUtils.clamp(drag.yaw + (drag.x - event.clientX) * 0.003, -0.65, 0.65); render(); } };
  const up = () => { drag = undefined; };
  canvas.addEventListener('webglcontextlost', lost);
  canvas.addEventListener('webglcontextrestored', restored);
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  const loader = new GLTFLoader();
  try {
    // All seven files are a fixed, licensed first-party allowlist (774,108 B total).
    for (const name of ['WH_PonderosaPine_C', 'WH_PocketSpruce', 'WH_BoulderSnow', 'WH_CanvasTent', 'WH_Campfire', 'WH_CamperRV', 'WH_Lantern']) {
      const gltf = await loader.loadAsync(new URL(`${name}.glb`, base).href);
      track(gltf.scene);
      if (disposed) { clean(); throw Error('Scene disposed'); }
      assets.set(name, gltf.scene);
    }
    const put = (name, x, z, scale = 1, rotation = 0) => {
      const object = assets.get(name).clone(true);
      object.position.set(x, 0, z); object.scale.setScalar(scale); object.rotation.y = rotation;
      world.add(object); return object;
    };
    const snowMap = await new THREE.TextureLoader().loadAsync(new URL('WH_Tex_Snow_BaseColor.webp', base).href);
    textures.add(snowMap);
    if (disposed) { clean(); throw Error('Scene disposed'); }
    snowMap.colorSpace = THREE.SRGBColorSpace;
    snowMap.wrapS = snowMap.wrapT = THREE.RepeatWrapping;
    snowMap.repeat.set(6, 6);
    snowMap.anisotropy = 1;
    const groundMaterial = new THREE.MeshStandardMaterial({color: '#d6ded5', roughness: 1, map: snowMap});
    const ground = new THREE.Mesh(new THREE.CylinderGeometry(11.6, 10.8, 1, 64), groundMaterial);
    ground.position.y = -0.55; world.add(ground);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(11.6, 10.8, 1.05, 64), new THREE.MeshStandardMaterial({color: '#40524c', roughness: 1}));
    ring.position.y = -1.03; world.add(ring);
    put('WH_CanvasTent', 2.5, -1.7, 0.88, -0.28);
    put('WH_CamperRV', -5, -2.1, 0.85, 0.45);
    const fire = put('WH_Campfire', 0, 3, 1.05);
    put('WH_Lantern', 3.2, 3.6, 1.8, -0.3);
    for (const [x, z, scale, rotation] of [[-7,-4.8,1.2,0.2],[-4.5,-6.8,1.4,1.2],[0,-7.8,1.3,0.5],[4,-7,1.5,0],[7,-5.2,1.15,2],[-8,0,0.95,1],[8.6,-1,1.1,2.7]]) put('WH_PonderosaPine_C',x,z,scale,rotation);
    for (const [x,z,s] of [[-7.6,3,1.4],[7.8,3.1,1.5],[-3.5,-5,1.7],[5.6,2.7,1.1],[-6,5.1,1.1]]) put('WH_PocketSpruce',x,z,s,x);
    for (const [x,z,s] of [[-3,3.8,0.9],[5.8,4.9,1.4],[-7,1.4,1.1],[5,-5,1]]) put('WH_BoulderSnow',x,z,s,x);
    // Share repeated original tree/rock geometry in GPU instances.
    // The source GLBs, node names, material names and provenance stay intact.
    world.updateMatrixWorld(true);
    const repeats = new Map();
    world.traverse(node => {
      if (!node.isMesh) return;
      const key=node.geometry.uuid+':'+(Array.isArray(node.material)?node.material.map(m=>m.uuid).join(':'):node.material.uuid);
      if (!repeats.has(key)) repeats.set(key,[]);
      repeats.get(key).push(node);
    });
    for (const nodes of repeats.values()) {
      if (nodes.length<2) continue;
      const instances=new THREE.InstancedMesh(nodes[0].geometry,nodes[0].material,nodes.length);
      instances.name=nodes[0].name;
      nodes.forEach((node,index)=>{instances.setMatrixAt(index,node.matrixWorld);node.removeFromParent();});
      world.add(instances);
    }
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(120 * 3);
    for (let i=0; i<120; i++) { positions[i*3] = Math.sin(i*12.9898)*12; positions[i*3+1] = (i*0.731)%12; positions[i*3+2] = Math.cos(i*7.173)*11; }
    particles.setAttribute('position', new THREE.BufferAttribute(positions,3));
    const flakes = new THREE.Points(particles,new THREE.PointsMaterial({color:'#d9e9e7', size:0.055, transparent:true, opacity:0.62, depthWrite:false}));
    world.add(flakes); track(world);
    // Dispose any unused source resources too, including texture ImageBitmaps.
    const tick = time => {
      if (disposed || contextLost || !motion || !visible) return;
      frame = requestAnimationFrame(tick);
      if (time-lastFrame < 1000/24) return;
      const delta = Math.min((time-lastFrame)/1000,0.08); lastFrame=time; elapsed+=delta;
      fireLight.intensity = 95 + Math.sin(elapsed*5)*4;
      if (snowEnabled) {
        for (let i=1;i<positions.length;i+=3) { positions[i]-=delta*0.7; if (positions[i]<0) positions[i]=12; }
        particles.attributes.position.needsUpdate=true;
      }
      fire.rotation.y = Math.sin(elapsed*0.4)*0.015;
      render();
    };
    const setMotion = enabled => {
      motion=enabled; cancelAnimationFrame(frame);
      if (motion && visible && !contextLost && !disposed) {lastFrame=performance.now();frame=requestAnimationFrame(tick);}
      host.dataset.motion=String(motion);
    };
    host.append(canvas); observer.observe(host); resize();
    return {
      dispose,
      rotate: delta => {yaw=THREE.MathUtils.clamp(yaw+delta,-0.65,0.65);render();},
      reset: () => {yaw=0.08;render();},
      setMotion,
      setSnow: enabled => {snowEnabled=enabled;flakes.visible=enabled;render();},
      setVisible: value => {visible=value;setMotion(motion);if(visible) render();}
    };
  } catch (error) { dispose(); throw error; }
}
