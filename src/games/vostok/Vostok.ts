import * as THREE from 'three';
import { createSfx } from '../shared/sfx';
import { clamp, createStage, dotTexture, h, makeToast } from '../shared/stage';
import type { GameCtx, GameResult, MountGame } from '../types';
import * as P from './physics';

/*
 * 东方一号 · 入轨 — Vostok 1, 12 April 1961.
 *
 * Scene units are kilometres in an inertial frame that equals the Earth-fixed frame at launch
 * (+y = north pole, +x = 0°E, −z = 90°E). The Earth group turns with sidereal time. The flight
 * itself is integrated in the orbital plane by ./physics and mapped into 3-D with orbitBasis().
 */

type Phase = 'pad' | 'ascent' | 'orbit' | 'reentry' | 'done';
const L = (lang: GameCtx['lang'], zh: string, en: string) => (lang === 'zh' ? zh : en);

const LAUNCH_UTC_MIN = 6 * 60 + 7; // 06:07 UTC
const SUN = new THREE.Vector3(...P.geo(8.6, 88.2)).normalize(); // subsolar point at launch
const TARGET_PERI = 150;
const TARGET_APO = 400;
/** Reference pitch program, shown as a ghost marker on the attitude dial. */
const guidePitch = (t: number) => (t < 10 ? 90 : t < 118 ? 90 - (t - 10) * (55 / 108) : t < 302 ? 35 - (t - 118) * (25 / 184) : 5 - (t - 302) * (10 / 372));

export const mount: MountGame = (root, ctx) => {
  const { lang } = ctx;
  const stage = createStage(root, { bloom: { strength: 0.6, radius: 0.45, threshold: 0.92 }, fov: 50, logDepth: true });
  const { scene, camera, renderer } = stage;
  camera.near = 0.0005;
  camera.far = 120000;
  camera.updateProjectionMatrix();
  const sfx = createSfx();
  const basis = P.orbitBasis();
  const E1 = new THREE.Vector3(...basis.e1);
  const E2 = new THREE.Vector3(...basis.e2);
  const NRM = new THREE.Vector3().crossVectors(E1, E2).normalize();
  const tex = new THREE.TextureLoader();
  const BASE = import.meta.env.BASE_URL;
  const dayMap = tex.load(`${BASE}textures/earth-blue-marble.jpg`);
  dayMap.colorSpace = THREE.SRGBColorSpace;
  dayMap.anisotropy = 8;
  const waterMap = tex.load(`${BASE}textures/earth-water.png`);

  // ---------- Earth ----------
  const earth = new THREE.Group();
  scene.add(earth);
  const earthUniforms = { uMap: { value: dayMap }, uWater: { value: waterMap }, uSun: { value: SUN.clone() }, uCamPos: { value: camera.position }, uHaze: { value: new THREE.Color('#79a9dc') } };
  const earthMat = new THREE.ShaderMaterial({
    uniforms: earthUniforms,
    vertexShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_vertex>
      varying vec2 vUv; varying vec3 vN; varying vec3 vW;
      void main(){
        vUv = uv;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
        // modelViewMatrix is composed in double precision on the CPU; going through world space
        // in float32 would lose ~0.5 m at Earth-radius distances
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform sampler2D uMap; uniform sampler2D uWater; uniform vec3 uSun; uniform vec3 uCamPos; uniform vec3 uHaze;
      varying vec2 vUv; varying vec3 vN; varying vec3 vW;
      void main(){
        #include <logdepthbuf_fragment>
        vec3 N = normalize(vN);
        vec3 V = normalize(uCamPos - vW);
        vec3 day = texture2D(uMap, vUv).rgb;
        float water = texture2D(uWater, vUv).r;
        float ndl = dot(N, uSun);
        float lit = smoothstep(-0.08, 0.3, ndl);
        vec3 c = day * (0.03 + 0.95 * lit);
        // a thin warm line along the terminator
        c += vec3(0.6, 0.28, 0.1) * exp(-pow(ndl * 22.0, 2.0)) * 0.05;
        vec3 R = reflect(-uSun, N);
        c += vec3(1.0, 0.95, 0.85) * pow(max(dot(R, V), 0.0), 220.0) * water * lit * 0.35;
        // the limb glow belongs to the view from space; near the ground it only washes the steppe out
        float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0) * smoothstep(1.0, 60.0, length(uCamPos) - 6371.0);
        c = mix(c, vec3(0.35, 0.6, 1.0) * (0.15 + lit), fres * 0.55 * smoothstep(-0.25, 0.2, ndl));
        // aerial perspective while still low: the far steppe fades into the sky
        float camAlt = length(uCamPos) - 6371.0;
        float hz = (1.0 - exp(-length(uCamPos - vW) / 70.0)) * (1.0 - smoothstep(3.0, 45.0, camAlt));
        c = mix(c, uHaze, hz * 0.85);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(P.RE - 3, 160, 80), earthMat);
  earth.add(globe);
  // High-resolution patch around Baikonur, on the true radius, so the pad and the climb sit on a
  // smooth surface rather than on the coarse sphere's 250 km facets.
  {
    // vertices are stored relative to the patch centre: at Earth-radius magnitudes float32 would
    // jitter them by ~0.5 m, enough to fight the pad deck
    const patch = new THREE.Mesh(patchGeometry(P.BAIKONUR.lat, P.BAIKONUR.lon, 0.32, 90, 128), earthMat);
    patch.position.set(...P.geo(P.BAIKONUR.lat, P.BAIKONUR.lon)).multiplyScalar(P.RE);
    earth.add(patch);
  }

  // Atmosphere: a back-face shell glowing at the limb, plus the sky colour from inside it.
  const atmoMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uSun: { value: SUN.clone() }, uCamPos: { value: camera.position } },
    vertexShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_vertex>
      varying vec3 vW; varying vec3 vN;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vN = normalize(w.xyz); gl_Position = projectionMatrix * viewMatrix * w;
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform vec3 uSun; uniform vec3 uCamPos; varying vec3 vW; varying vec3 vN;
      void main(){
        #include <logdepthbuf_fragment>
        vec3 V = normalize(vW - uCamPos);
        float rim = pow(1.0 - abs(dot(V, vN)), 5.0);
        float lit = smoothstep(-0.3, 0.4, dot(vN, uSun));
        gl_FragColor = vec4(vec3(0.3, 0.55, 1.0) * rim * lit * 1.4, 1.0);
      }`,
  });
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(P.RE + 90, 96, 48), atmoMat);
  scene.add(atmo);

  // Stars.
  {
    const n = 3000;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(90000);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 1.4, sizeAttenuation: false, transparent: true, opacity: 0 }));
    stars.name = 'stars';
    scene.add(stars);
  }
  const stars = scene.getObjectByName('stars') as THREE.Points;
  const sunLight = new THREE.DirectionalLight(0xfff4e0, 3);
  sunLight.position.copy(SUN).multiplyScalar(100000);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0x6688aa, 0.35));
  const sky = new THREE.Color();
  const SKY_LOW = new THREE.Color('#79a9dc');
  const SKY_HIGH = new THREE.Color('#02030a');
  scene.background = sky;

  // ---------- the pad (on the Earth, so it turns away with it) ----------
  const padUp = new THREE.Vector3(...P.geo(P.BAIKONUR.lat, P.BAIKONUR.lon));
  const pad = new THREE.Group();
  pad.position.copy(padUp).multiplyScalar(P.RE);
  pad.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), padUp);
  earth.add(pad);
  const padM = new THREE.Group();
  padM.scale.setScalar(0.001); // build in metres
  pad.add(padM);
  const concrete = new THREE.MeshStandardMaterial({ color: 0x8d8a80, roughness: 1 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x5a5c60, roughness: 0.6, metalness: 0.4 });
  // deck top sits 0.6 m proud of the ground so the two never z-fight
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(40, 46, 4, 40), concrete);
  deck.position.y = -1.4;
  padM.add(deck);
  const pit = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 34), new THREE.MeshStandardMaterial({ color: 0x1c1b18 }));
  pit.position.set(0, -1.3, 20);
  padM.add(pit);
  // The four support arms ("tulip") that fall back at lift-off.
  const arms: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) {
    const a = new THREE.Group();
    const beam = new THREE.Mesh(new THREE.BoxGeometry(1.6, 26, 1.6), steel);
    beam.position.y = 13;
    a.add(beam);
    const ang = (i / 4) * Math.PI * 2 + Math.PI / 4;
    a.position.set(Math.cos(ang) * 7.5, 0, Math.sin(ang) * 7.5);
    a.rotation.y = -ang;
    a.rotation.z = 0.08;
    padM.add(a);
    arms.push(a);
  }

  // ---------- rocket ----------
  const R7 = buildR7();
  scene.add(R7.root);
  const plumeMat = plumeMaterial();
  const plumes: THREE.Mesh[] = [];
  const addPlume = (parent: THREE.Object3D, x: number, y: number, z: number, r: number) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, 1, 20, 1, true), plumeMat.clone());
    m.geometry.translate(0, -0.5, 0);
    m.position.set(x, y, z);
    parent.add(m);
    plumes.push(m);
    return m;
  };
  const boosterPlumes = R7.boosters.map((b) => addPlume(b, 0, 0, 0, 1.3));
  const corePlume = addPlume(R7.core, 0, 0, 0, 1.1);
  const upperPlume = addPlume(R7.upper, 0, 0, 0, 0.7);
  upperPlume.visible = false;

  // Smoke / contrail, in world coordinates, left behind by the rocket.
  const smoke = new WorldPuffs(1400, dotTexture(0.55));
  scene.add(smoke.points);

  // ---------- markers & tracks on the globe ----------
  const trackPast = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffc56a, transparent: true, opacity: 0.95 }));
  const trackNext = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({ color: 0xbfd8ff, dashSize: 60, gapSize: 50, transparent: true, opacity: 0.7 }));
  earth.add(trackPast, trackNext);
  const PAST_MAX = 4000;
  const pastBuf = new Float32Array(PAST_MAX * 3);
  trackPast.geometry.setAttribute('position', new THREE.BufferAttribute(pastBuf, 3));
  trackPast.geometry.setDrawRange(0, 0);
  trackPast.frustumCulled = false;
  trackNext.frustumCulled = false;
  let pastN = 0;
  const marker = (color: number, size: number) => {
    const m = new THREE.Mesh(new THREE.RingGeometry(size * 0.7, size, 40), new THREE.MeshBasicMaterial({ color, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    m.renderOrder = 3;
    return m;
  };
  const placeOn = (m: THREE.Object3D, lat: number, lon: number, lift = 6) => {
    const v = new THREE.Vector3(...P.geo(lat, lon));
    m.position.copy(v).multiplyScalar(P.RE + lift);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), v);
  };
  const targetMk = marker(0xffd36a, 170);
  placeOn(targetMk, P.LANDING.lat, P.LANDING.lon);
  const predictMk = marker(0xff5a4a, 130);
  predictMk.visible = false;
  const baikonurMk = marker(0x9fd0ff, 110);
  placeOn(baikonurMk, P.BAIKONUR.lat, P.BAIKONUR.lon);
  earth.add(targetMk, predictMk, baikonurMk);
  targetMk.visible = baikonurMk.visible = false;
  let markersOn = false;
  let predictOn = false;
  const craftGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture(0.25), color: 0xffe8b0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: false }));
  craftGlow.scale.setScalar(0.018);
  craftGlow.visible = false;
  scene.add(craftGlow);
  // The descent module's own parachute (Gagarin came down separately under his).
  const chute = buildChute();
  chute.visible = false;
  scene.add(chute);
  let chuteK = 0; // 0 → 1 as the canopy opens
  const plasma = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture(0.3), color: 0xff8a3a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  plasma.scale.setScalar(0.012);
  scene.add(plasma);

  // ---------- HUD ----------
  const hud = h('div', 'g-hud vk-hud', root);
  h('div', 'g-title', hud, L(lang, '东方一号 · 入轨', 'Vostok 1 · Into Orbit'));
  const toast = makeToast(hud);
  const left = h('div', 'vk-tele g-panel-sm', hud);
  const right = h('div', 'vk-orbit g-panel-sm', hud);
  const orbitCv = h('canvas', '', right) as HTMLCanvasElement;
  orbitCv.width = orbitCv.height = 220 * 2;
  const orbitTxt = h('div', 'vk-orbit-txt', right);
  const dial = h('canvas', 'vk-dial', hud) as HTMLCanvasElement;
  dial.width = dial.height = 150 * 2;
  const controls = h('div', 'vk-controls', hud);
  const btnDown = h('button', 'g-btn ghost vk-pitch', controls, L(lang, '◀ 压低', '◀ Pitch down')) as HTMLButtonElement;
  const btnAct = h('button', 'g-btn vk-act', controls, L(lang, '关机', 'Cut engine')) as HTMLButtonElement;
  const btnUp = h('button', 'g-btn ghost vk-pitch', controls, L(lang, '抬高 ▶', 'Pitch up ▶')) as HTMLButtonElement;
  const clock = h('div', 'vk-clock', hud);
  const tag = h('div', 'vk-tag', hud);
  const style = h('style', '', hud);
  style.textContent = `
    .vk-tele { position: absolute; left: 20px; top: calc(max(16px, env(safe-area-inset-top)) + 30px); display: grid; grid-template-columns: auto auto; gap: 3px 14px; font-size: 12.5px; min-width: 200px; }
    .vk-tele b { color: #e8f1ff; font-variant-numeric: tabular-nums; text-align: right; font-weight: 600; }
    .vk-tele .warn { color: #ff8a6a; }
    .vk-tele .ok { color: #8ef0b0; }
    .vk-tele .stagebar { grid-column: 1 / -1; margin-top: 6px; font-size: 11px; letter-spacing: .08em; color: var(--accent); }
    .vk-orbit { position: absolute; right: 18px; top: calc(max(14px, env(safe-area-inset-top)) + 54px); padding: 8px; text-align: center; }
    .vk-orbit canvas { width: 220px; height: 220px; display: block; }
    .vk-orbit-txt { font-size: 12px; line-height: 1.6; font-variant-numeric: tabular-nums; }
    .vk-orbit-txt b { color: #e8f1ff; }
    .vk-orbit-txt .ok { color: #8ef0b0; } .vk-orbit-txt .warn { color: #ffb07a; }
    .vk-dial { position: absolute; left: 20px; bottom: max(22px, env(safe-area-inset-bottom)); width: 150px; height: 150px; }
    .vk-controls { position: absolute; left: 50%; bottom: max(22px, env(safe-area-inset-bottom)); transform: translateX(-50%); display: flex; gap: 10px; }
    .vk-pitch { min-width: 116px; touch-action: none; user-select: none; -webkit-user-select: none; }
    .vk-pitch.held { border-color: var(--accent); color: #fff; }
    .vk-act { min-width: 120px; }
    .vk-clock { position: absolute; left: 50%; top: max(16px, env(safe-area-inset-top)); transform: translateX(-50%); font-size: 12px; color: var(--ink-2); letter-spacing: .08em; text-shadow: 0 1px 4px #000; font-variant-numeric: tabular-nums; pointer-events: none; text-align: center; }
    .vk-clock b { display: block; font-family: var(--serif); font-size: 22px; color: #fff; letter-spacing: .04em; }
    .vk-tag { position: absolute; left: 0; top: 0; pointer-events: none; font-size: 12px; color: #ffe6b0; white-space: nowrap; text-shadow: 0 1px 4px #000; transform: translate(-9999px, 0); }
    .vk-tag.target { color: #ffd36a; }
    @media (max-width: 760px) {
      .vk-orbit { top: auto; bottom: calc(max(22px, env(safe-area-inset-bottom)) + 60px); right: 10px; padding: 4px; }
      .vk-orbit canvas { width: 120px; height: 120px; }
      .vk-orbit-txt { font-size: 10.5px; }
      .vk-tele { font-size: 11px; min-width: 0; left: 12px; }
      .vk-dial { width: 96px; height: 96px; left: 10px; bottom: calc(max(22px, env(safe-area-inset-bottom)) + 60px); }
      .vk-pitch { min-width: 90px; } .vk-act { min-width: 84px; }
    }`;

  // ---------- state ----------
  let phase: Phase = 'pad';
  let padT = ctx.reduced ? 2.2 : 4.2; // countdown
  const s: P.State = { x: 0, y: P.RE, vx: basis.freeSpeed, vy: 0, t: 0 };
  let stageIdx = 0;
  let stageT = 0;
  let pitch = 90;
  let engineOn = true;
  let maxQ = 0;
  let failure: '' | 'crash' | 'maxq' | 'suborbital' = '';
  let insertion: P.Elements | null = null;
  let boostersGone = false;
  let fairingGone = false;
  let coreGone = false;
  let retroAt = -1;
  let windowState: 'before' | 'in' | 'after' = 'before';
  let bestPredict = Infinity;
  let landing: { lat: number; lon: number } | null = null;
  let peakG = 0;
  let lastSpeed = 0;
  let ejected = false;
  let moduleGone = false;
  let shadowSaid = false;
  let sunriseSaid = false;
  let pacificSaid = false;
  let zoomT = 0; // seconds since orbit began, for the reveal shot
  let cine = 0; // booster-separation camera
  let ended = false;
  let predictTimer = 0;
  let predicted: { d: number; ll: { lat: number; lon: number } } | null = null;
  const held = { down: false, up: false };
  const engine = sfx.bed(220, 0.8);
  const rumble = sfx.bed(90, 0.6);

  const pos3 = new THREE.Vector3();
  const dir3 = new THREE.Vector3();
  const up3 = new THREE.Vector3();
  const hz3 = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();
  const Y = new THREE.Vector3(0, 1, 0);
  const to3 = (x: number, y: number, out: THREE.Vector3) => out.copy(E1).multiplyScalar(x).addScaledVector(E2, y);

  // ---------- input ----------
  const onKey = (e: KeyboardEvent, down: boolean) => {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') held.down = down;
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') held.up = down;
    else if (k === ' ' && down && !e.repeat) {
      e.preventDefault();
      act();
    } else return;
    e.preventDefault();
  };
  const kd = (e: KeyboardEvent) => onKey(e, true);
  const ku = (e: KeyboardEvent) => onKey(e, false);
  window.addEventListener('keydown', kd);
  window.addEventListener('keyup', ku);
  const hold = (btn: HTMLButtonElement, k: 'down' | 'up') => {
    const on = (e: PointerEvent) => {
      e.preventDefault();
      held[k] = true;
      btn.classList.add('held');
      btn.setPointerCapture(e.pointerId);
    };
    const off = () => {
      held[k] = false;
      btn.classList.remove('held');
    };
    btn.addEventListener('pointerdown', on);
    btn.addEventListener('pointerup', off);
    btn.addEventListener('pointercancel', off);
    btn.addEventListener('lostpointercapture', off);
  };
  hold(btnDown, 'down');
  hold(btnUp, 'up');
  btnAct.onclick = () => act();

  function act() {
    if (phase === 'ascent' && engineOn && stageIdx === 2) cutoff(false);
    else if (phase === 'orbit' && retroAt < 0) fireRetro();
  }

  function cutoff(auto: boolean) {
    engineOn = false;
    const el = P.elements(s);
    sfx.noise({ dur: 0.6, freq: 180, type: 'lowpass', gain: 0.5 });
    if (el.peri < 100) {
      failure = 'suborbital';
      toast(L(lang, '未能入轨', 'Orbit not reached'), auto ? L(lang, '燃料耗尽，近地点仍在大气层内', 'Propellant gone, perigee still inside the atmosphere') : L(lang, '关机过早，近地点仍在大气层内', 'Cut too early: perigee still inside the atmosphere'), 3600);
      setTimeout(() => finish(), 3200);
      return;
    }
    insertion = el;
    phase = 'orbit';
    // the spacecraft separates from the spent upper stage a few seconds after cut-off
    for (const c of R7.upper.children) if (c !== R7.capsule) c.visible = false;
    toast(L(lang, '入轨！', 'Orbit!'), `${L(lang, '近地点', 'Perigee')} ${el.peri.toFixed(0)} km · ${L(lang, '远地点', 'Apogee')} ${Number.isFinite(el.apo) ? el.apo.toFixed(0) : '∞'} km`, 3800);
    sfx.tone({ freq: 660, to: 990, dur: 0.6, gain: 0.12 });
    markersOn = true;
    btnAct.textContent = L(lang, '制动点火', 'Fire retro');
    btnDown.style.visibility = btnUp.style.visibility = 'hidden';
  }

  function fireRetro() {
    retroAt = s.t;
    const r = P.retro(s);
    s.vx = r.vx;
    s.vy = r.vy;
    phase = 'reentry';
    camInit = false; // cut straight from the orbit view to the capsule
    predictOn = true;
    toast(L(lang, '制动点火', 'Retro-fire'), L(lang, 'TDU-1 制动发动机工作约 40 秒', 'The TDU-1 retro-rocket burns for about 40 s'), 3000);
    sfx.noise({ dur: 2.2, freq: 260, type: 'lowpass', gain: 0.5, attack: 0.1 });
    btnAct.disabled = true;
    btnAct.style.visibility = 'hidden';
    lastSpeed = P.speed(s);
  }

  // Dev-only hook so scripted runs can fly the reference program (see scripts in the PR notes).
  if (import.meta.env.DEV)
    (window as unknown as Record<string, unknown>).__vostok = {
      state: () => ({ phase, t: s.t, stageIdx, peri: P.elements(s).peri, apo: P.elements(s).apo, windowState, d: predicted?.d ?? null }),
      setPitch: (p: number) => (pitch = p),
      act,
    };

  // ---------- frame ----------
  stage.onFrame((dt, t) => {
    if (ended) return;
    // --- time warp ---
    let warp = 1;
    // real time for the last seconds of the burn, when every second adds ~40 km of apogee
    if (phase === 'ascent') warp = s.t < 25 ? 3 : stageIdx === 2 && P.elements(s).peri > 30 ? 1 : 8;
    else if (phase === 'orbit') warp = zoomT < 5 ? 10 : windowState === 'in' ? 10 : 95;
    else if (phase === 'reentry') warp = chuteK > 0 ? 45 : P.alt(s) > 110 ? 60 : P.alt(s) > 40 ? 16 : 12;
    if (phase === 'done') warp = 0;

    if (phase === 'pad') {
      padT -= dt;
      const n = Math.ceil(padT - 1.2);
      if (n >= 1 && n <= 3) setHtml(clock, `<b>${n}</b>${L(lang, '倒计时', 'Countdown')}`);
      if (padT <= 1.2 && padT + dt > 1.2) {
        toast('Поехали!', L(lang, '“我们出发了！”', '“Let’s go!”'), 2600);
        sfx.noise({ dur: 2.5, freq: 120, type: 'lowpass', gain: 0.9, attack: 0.3 });
      }
      if (padT <= 0) phase = 'ascent';
      for (const a of arms) a.rotation.z = padT < 1.2 ? Math.min(0.9, a.rotation.z + dt * 0.6) : 0.08;
    }

    // --- pitch control ---
    if (phase === 'ascent' && s.t > 6) pitch = clamp(pitch + ((held.up ? 1 : 0) - (held.down ? 1 : 0)) * 16 * dt, -15, 90);

    // --- integrate ---
    let simLeft = dt * warp;
    while (simLeft > 1e-6 && (phase === 'ascent' || phase === 'orbit' || phase === 'reentry')) {
      const h = P.alt(s);
      const maxStep = phase === 'ascent' ? 0.05 : P.coastDt(h);
      const d = Math.min(simLeft, maxStep);
      simLeft -= d;
      if (phase === 'ascent') {
        const S = P.STAGES[stageIdx];
        const a = engineOn ? P.stageAccel(S, stageT) : 0;
        P.step(s, d, a, pitch, P.DRAG_ROCKET);
        stageT += d;
        const q = P.qPressure(s);
        maxQ = Math.max(maxQ, q);
        if (q > 72 && !failure) {
          failure = 'maxq';
          toast(L(lang, '动压超限，箭体解体', 'Aerodynamic overload'), L(lang, '在稠密大气中压得太平、飞得太快', 'Too flat, too fast, too low in the thick air'), 4200);
          explode();
          return;
        }
        if (P.alt(s) < -0.002 && s.t > 3 && !failure) {
          failure = 'crash';
          toast(L(lang, '火箭坠地', 'The rocket came down'), L(lang, '俯仰压得太早太低', 'Pitched over too far, too soon'), 4200);
          explode();
          return;
        }
        if (stageT >= S.T) {
          if (stageIdx === 0) separateBoosters();
          else if (stageIdx === 1) separateCore();
          else {
            cutoff(true);
            break;
          }
          stageIdx++;
          stageT = 0;
        }
        if (stageIdx === 1 && !fairingGone && s.t >= 156) dropFairing();
      } else {
        P.step(s, d, 0, 0, phase === 'reentry' ? P.DRAG_CAPSULE : 0);
        if (phase === 'reentry') {
          const v = P.speed(s);
          peakG = Math.max(peakG, Math.abs(lastSpeed - v) / d / P.G0);
          lastSpeed = v;
          if (!ejected && P.alt(s) < 7) {
            ejected = true;
            toast(L(lang, '约 7 公里 · 弹射', 'About 7 km · ejection'), L(lang, '加加林弹射出舱，与返回舱分别伞降', 'Gagarin ejects and parachutes down separately from the capsule'), 3200);
          }
          if (!moduleGone && s.t - retroAt > 12) {
            // the instrument module is cut loose after the burn (on the real flight a cable
            // held on and set the pair tumbling for ten minutes)
            moduleGone = true;
            // drift away from the camera, so it never swallows the view
            const away = tmp.copy(pos3).sub(camera.position).normalize().addScaledVector(up3, -0.5).normalize();
            detach(R7.instrument, away, 0, new THREE.Vector3(0.8, 0, 0.5));
            debris[debris.length - 1].t = 8; // gone after ~6 s
            toast(L(lang, '仪器舱分离', 'Instrument module separates'), L(lang, '只剩球形返回舱迎着大气', 'Only the spherical descent module meets the air'), 2600);
          }
          if (ejected && chuteK === 0 && P.alt(s) < 4) {
            chuteK = 0.001;
            chute.visible = true;
            sfx.noise({ dur: 0.6, freq: 900, type: 'bandpass', gain: 0.25, attack: 0.02 });
          }
          if (chuteK > 0) {
            // under the canopy the capsule settles to ~8.5 m/s straight down
            const fr = P.frame(s);
            const k = 1 - Math.exp(-d / 5);
            s.vx += (-fr.ux * 0.0085 - s.vx) * k;
            s.vy += (-fr.uy * 0.0085 - s.vy) * k;
            lastSpeed = P.speed(s);
          }
          if (P.alt(s) <= 0) {
            landing = P.subPoint(s, basis);
            for (let i = 0; i < 10; i++) smoke.emit(pos3, up3, hz3, 0.002 + Math.random() * 0.002, 3, false, 0.004);
            sfx.noise({ dur: 0.5, freq: 200, type: 'lowpass', gain: 0.5, attack: 0.01 });
            phase = 'done';
            setTimeout(() => finish(), 2600);
            break;
          }
        }
      }
    }

    // --- 3-D placement ---
    earth.rotation.y = P.OMEGA * s.t;
    to3(s.x, s.y, pos3);
    up3.copy(pos3).normalize();
    const f = P.frame(s);
    to3(f.hx, f.hy, hz3);
    const pr = THREE.MathUtils.degToRad(phase === 'ascent' || phase === 'pad' ? pitch : P.fpa(s));
    dir3.copy(hz3).multiplyScalar(Math.cos(pr)).addScaledVector(up3, Math.sin(pr)).normalize();
    if (phase === 'pad') pos3.copy(up3).multiplyScalar(P.RE);
    R7.root.position.copy(pos3);
    R7.root.quaternion.setFromUnitVectors(Y, dir3);
    if (insertion) {
      // once only the capsule is left, centre it (not the old stack's base) on the craft position
      R7.root.updateMatrixWorld();
      R7.ball.getWorldPosition(tmp);
      R7.root.position.add(tmp.sub(pos3).negate());
    }

    const altKm = Math.max(0, P.alt(s));
    // engines & plumes: plumes swell as the air thins
    const thin = clamp(altKm / 60, 0, 1);
    const firing = phase === 'ascent' && engineOn;
    const flick = 0.92 + Math.sin(t * 60) * 0.05 + Math.random() * 0.05;
    for (const p of boosterPlumes) setPlume(p, firing && !boostersGone, (14 + thin * 30) * flick, 1 + thin * 2.4, t);
    setPlume(corePlume, firing && !coreGone, (14 + thin * 34) * flick, 1 + thin * 2.6, t);
    setPlume(upperPlume, firing && coreGone, (8 + 14 * thin) * flick, 1.6 + thin * 2, t);
    if (phase === 'pad' && padT < 1.4) {
      for (const p of [...boosterPlumes, corePlume]) setPlume(p, true, 6 + Math.random() * 3, 1.2, t);
      for (let i = 0; i < 6; i++) smoke.emit(pos3, up3, dir3, 0.018 + Math.random() * 0.03, 3.5);
    }
    if (firing && altKm < 28) {
      const n = altKm < 3 ? 5 : 2;
      for (let i = 0; i < n; i++) smoke.emit(pos3, up3, dir3, altKm < 2 ? 0.03 : 0.012 + altKm * 0.001, altKm < 3 ? 9 : 16);
    }
    smoke.setScale((stage.size.h * renderer.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))));
    smoke.update(dt);
    const engineLevel = firing ? (1 - thin * 0.85) * (coreGone ? 0.5 : 1) : phase === 'pad' && padT < 1.4 ? 0.6 : 0;
    engine.set(engineLevel * 0.55, 160 + engineLevel * 200);
    rumble.set(phase === 'reentry' ? clamp(peakG / 9, 0, 1) * 0.4 * (altKm < 100 && altKm > 10 ? 1 : 0.1) : engineLevel * 0.4);

    animateDebris(dt);

    // --- sky & stars ---
    const camAlt = camera.position.length() - P.RE;
    const sunUp = clamp(up3.dot(SUN) * 3 + 0.4, 0, 1);
    sky.copy(SKY_HIGH).lerp(SKY_LOW, (1 - smoothstep(4, 70, camAlt)) * sunUp);
    earthUniforms.uHaze.value.copy(sky);
    (stars.material as THREE.PointsMaterial).opacity = smoothstep(25, 90, camAlt) * 0.9;
    atmo.visible = camAlt > 40;

    // --- camera ---
    placeCamera(dt);

    // --- orbit-phase logic: window, prediction, narration ---
    if (phase === 'orbit') {
      zoomT += dt;
      const sub = P.subPoint(s, basis);
      if (!pacificSaid && sub.lon > 150) {
        pacificSaid = true;
        toast(L(lang, '飞越太平洋', 'Over the Pacific'), L(lang, '由北向南，飞向南半球', 'Heading south across the ocean'), 2600);
      }
      const inSun = up3.dot(SUN) > -0.05;
      if (!shadowSaid && !inSun) {
        shadowSaid = true;
        toast(L(lang, '进入地球阴影', 'Into the Earth’s shadow'), '', 2400);
      } else if (shadowSaid && !sunriseSaid && inSun) {
        sunriseSaid = true;
        toast(L(lang, '日出', 'Sunrise'), L(lang, '飞船驶出地影，越过南大西洋', 'Out of the shadow, over the South Atlantic'), 2400);
      }
      predictTimer -= dt;
      if (predictTimer <= 0) {
        predictTimer = windowState === 'in' ? 0.05 : 0.3;
        const g = P.propagateToGround(P.retro(s), P.DRAG_CAPSULE);
        if (g.landed) {
          const ll = P.subPoint(g.s, basis);
          predicted = { d: P.gcDist(ll, P.LANDING), ll };
        } else predicted = null;
        const d = predicted?.d ?? Infinity;
        if (windowState === 'before' && d < 2600 && s.t > 3000) {
          windowState = 'in';
          toast(L(lang, '进入制动窗口', 'Retro-fire window'), L(lang, '飞船正越过非洲西海岸 · 看准时机点火', 'Over the west coast of Africa · time the burn'), 3000);
          sfx.tone({ freq: 880, dur: 0.25, gain: 0.1 });
          setTimeout(() => sfx.tone({ freq: 880, dur: 0.25, gain: 0.1 }), 300);
        } else if (windowState === 'in') {
          bestPredict = Math.min(bestPredict, d);
          if (d > bestPredict + 1600 && d > 2600) {
            windowState = 'after';
            toast(L(lang, '错过制动窗口', 'Window missed'), L(lang, '飞船只能靠大气阻力慢慢降轨', 'Now only drag can bring the capsule down'), 3400);
            phase = 'done';
            setTimeout(() => finish(), 3000);
          }
        }
      }
      predictOn = windowState === 'in' && !!predicted;
      if (predicted) placeOn(predictMk, predicted.ll.lat, predicted.ll.lon, 8);
    }
    if (phase === 'reentry' || phase === 'done') {
      if (!landing) {
        predictTimer -= dt;
        if (predictTimer <= 0) {
          predictTimer = 0.5;
          const g = P.propagateToGround(s, P.DRAG_CAPSULE);
          if (g.landed) placeOn(predictMk, ...latlon(P.subPoint(g.s, basis)), 8);
        }
      }
    }

    // --- tracks ---
    if ((phase === 'orbit' || phase === 'reentry' || phase === 'ascent') && Math.floor(s.t / 20) !== Math.floor((s.t - dt * warp) / 20)) {
      const ef = new THREE.Vector3(...P.toEarthFixed([pos3.x, pos3.y, pos3.z], s.t)).normalize().multiplyScalar(P.RE + 6);
      if (pastN < PAST_MAX) {
        pastBuf.set([ef.x, ef.y, ef.z], pastN * 3);
        pastN++;
        trackPast.geometry.setDrawRange(0, pastN);
        trackPast.geometry.attributes.position.needsUpdate = true;
      }
    }
    if (phase === 'orbit' && Math.floor(t * 2) !== Math.floor((t - dt) * 2)) {
      const c = { ...s };
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k < 120; k++) {
        for (let j = 0; j < 6; j++) P.step(c, 5, 0, 0, 0);
        const v = P.toEarthFixed(P.toInertial(c, basis), c.t);
        pts.push(new THREE.Vector3(...v).normalize().multiplyScalar(P.RE + 6));
      }
      trackNext.geometry.setFromPoints(pts);
      trackNext.computeLineDistances();
    }
    trackNext.visible = phase === 'orbit';
    craftGlow.visible = phase === 'orbit' || (phase === 'reentry' && camera.position.distanceTo(pos3) > 50);
    craftGlow.position.copy(pos3);
    const glowK = phase === 'reentry' && altKm < 100 && altKm > 15 ? clamp((P.speed(s) - 1.5) / 5, 0, 1) : 0;
    plasma.position.copy(pos3).addScaledVector(dir3, -0.001);
    (plasma.material as THREE.SpriteMaterial).opacity = glowK * (0.75 + Math.random() * 0.25);
    plasma.scale.setScalar(0.004 + glowK * 0.007);
    if (chuteK > 0) {
      chuteK = Math.min(1, chuteK + dt * 0.7);
      const open = 1 - Math.pow(1 - chuteK, 3);
      chute.position.copy(pos3);
      chute.quaternion.setFromUnitVectors(Y, up3);
      chute.scale.set(0.25 + 0.75 * open, 0.5 + 0.5 * open, 0.25 + 0.75 * open);
    }
    // the globe overlays are drawn at map scale; from close to the ground they are just huge bands
    const overlays = camAlt > 400;
    trackPast.visible = overlays;
    targetMk.visible = baikonurMk.visible = markersOn && overlays;
    predictMk.visible = predictOn && overlays;

    // --- HUD ---
    updateHud();
    updateTags();
  });

  const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
  function smoothstep(a: number, b: number, x: number) {
    const k = clamp((x - a) / (b - a), 0, 1);
    return k * k * (3 - 2 * k);
  }

  /** Camera offset from the craft (smoothed), and the look target. */
  const camOff = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  let camInit = false;
  function placeCamera(dt: number) {
    const altKm = Math.max(0, P.alt(s));
    let smooth = true;
    if (phase === 'pad' || phase === 'ascent' || (phase === 'done' && !insertion && !landing)) {
      const D = clamp(0.085 + altKm * 0.002, 0.085, 0.22);
      if (cine > 0) {
        cine -= dt;
        // ahead and above, looking back down the stack: the four boosters peel away as a cross
        // against the Earth below
        tmp.copy(dir3).multiplyScalar(0.11).addScaledVector(up3, 0.07).addScaledVector(NRM, 0.025);
      } else {
        // near the ground "behind the rocket" is underground: blend from a raised side view
        const low = 1 - smoothstep(0.2, 2, altKm);
        tmp.copy(NRM).multiplyScalar(D).addScaledVector(dir3, -D * 0.25 * (1 - low)).addScaledVector(up3, lerpN(-D * 0.08, D * 0.18, low));
      }
      tmp2.copy(pos3).addScaledVector(dir3, 0.012 * clamp(1 - altKm / 3, 0, 1));
      camera.up.copy(up3);
    } else if (phase === 'orbit' || (phase === 'done' && insertion && !landing && retroAt < 0)) {
      // reveal: pull out from the capsule to see the whole Earth, then ride along the ground track
      const k = smoothstep(0, 6, zoomT);
      const far = tmp.copy(pos3).normalize().multiplyScalar(P.RE * 2.75).addScaledVector(NRM, P.RE * 0.9).sub(pos3);
      const near = tmp2.copy(NRM).multiplyScalar(0.03).addScaledVector(up3, 0.006).addScaledVector(dir3, -0.01);
      tmp.lerpVectors(near, far, Math.pow(k, 2.4));
      tmp2.copy(pos3).multiplyScalar(1 - k * 0.85);
      camera.up.copy(up3).lerp(Y, k).normalize();
      smooth = false;
    } else {
      // re-entry: back in close behind the capsule
      const D = 0.022;
      if (ejected || (phase === 'reentry' && P.speed(s) < 1.2) || (phase === 'done' && landing)) {
        // once the fireball is over, and under the canopy: a side view with the steppe below
        tmp.copy(NRM).multiplyScalar(0.07).addScaledVector(hz3, -0.03).addScaledVector(up3, 0.004);
        tmp2.copy(pos3).addScaledVector(up3, 0.016);
      } else {
        tmp.copy(NRM).multiplyScalar(D).addScaledVector(dir3, -D * 1.4).addScaledVector(up3, D * 0.5);
        tmp2.copy(pos3);
      }
      camera.up.copy(up3);
    }
    if (!camInit || !smooth) camOff.copy(tmp);
    else camOff.lerp(tmp, 1 - Math.exp(-dt * 3));
    camInit = true;
    camLook.copy(tmp2);
    camera.position.copy(pos3).add(camOff);
    camera.lookAt(camLook);
    const camAlt = camera.position.length() - P.RE;
    camera.near = camAlt > 2000 ? 5 : 0.0005;
    camera.updateProjectionMatrix();
  }

  // ---------- staging / debris ----------
  type Debris = { obj: THREE.Object3D; rel: THREE.Vector3; vel: THREE.Vector3; spin: THREE.Vector3; t: number };
  const debris: Debris[] = [];
  function detach(obj: THREE.Object3D, outward: THREE.Vector3, back: number, spin: THREE.Vector3) {
    // keep its current world transform, then fly it in the rocket's frame
    obj.updateMatrixWorld();
    const wp = new THREE.Vector3();
    const wq = new THREE.Quaternion();
    obj.getWorldPosition(wp);
    obj.getWorldQuaternion(wq);
    obj.removeFromParent();
    scene.add(obj);
    obj.position.copy(wp);
    obj.quaternion.copy(wq);
    obj.scale.setScalar(0.001);
    const rel = wp.clone().sub(R7.root.position);
    debris.push({ obj, rel, vel: outward.clone().multiplyScalar(0.012).addScaledVector(dir3, -back), spin, t: 0 });
  }
  function animateDebris(dt: number) {
    for (const d of debris) {
      d.t += dt;
      d.vel.addScaledVector(dir3, -0.004 * dt * (phase === 'ascent' ? 8 : 1));
      d.rel.addScaledVector(d.vel, dt);
      d.obj.position.copy(R7.root.position).add(d.rel);
      d.obj.rotateX(d.spin.x * dt);
      d.obj.rotateZ(d.spin.z * dt);
      if (d.t > 14) d.obj.visible = false;
    }
  }
  function separateBoosters() {
    boostersGone = true;
    cine = ctx.reduced ? 0 : 3.2;
    toast(L(lang, '助推器分离', 'Booster separation'), L(lang, '四台助推器向外散开——“科罗廖夫十字”', 'The four boosters fall away — the “Korolev cross”'), 3200);
    sfx.noise({ dur: 0.8, freq: 300, type: 'lowpass', gain: 0.6 });
    R7.boosters.forEach((b, i) => {
      const ang = (i / 4) * Math.PI * 2;
      const out = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang)).applyQuaternion(R7.root.quaternion);
      detach(b, out, 0.002, new THREE.Vector3(0, 0, (i % 2 ? 1 : -1) * 0.6));
    });
  }
  function dropFairing() {
    fairingGone = true;
    toast(L(lang, '整流罩抛离', 'Fairing jettisoned'), L(lang, '球形的东方号返回舱露了出来', 'The spherical Vostok capsule is uncovered'), 2400);
    R7.fairing.forEach((f, i) => {
      const out = new THREE.Vector3(i ? 1 : -1, 0, 0).applyQuaternion(R7.root.quaternion);
      detach(f, out, 0.001, new THREE.Vector3(0, 0, i ? 1.2 : -1.2));
    });
  }
  function separateCore() {
    coreGone = true;
    toast(L(lang, '芯级分离 · 末级点火', 'Core stage away · upper stage ignites'), L(lang, '最后一级：现在由你决定何时关机', 'Last stage: you decide when to cut the engine'), 3200);
    sfx.noise({ dur: 0.6, freq: 260, type: 'lowpass', gain: 0.5 });
    detach(R7.core, new THREE.Vector3(), 0.003, new THREE.Vector3(0.15, 0, 0.1));
    upperPlume.visible = true;
  }
  function explode() {
    phase = 'done';
    engine.set(0);
    sfx.noise({ dur: 2.4, freq: 100, type: 'lowpass', gain: 1, attack: 0.01 });
    for (let i = 0; i < 80; i++) smoke.emit(pos3, up3, dir3, 0.04 + Math.random() * 0.05, 6, true);
    R7.root.visible = false;
    setTimeout(() => finish(), 3200);
  }

  // ---------- HUD ----------
  const dctx = dial.getContext('2d')!;
  const octx = orbitCv.getContext('2d')!;
  function updateHud() {
    const el = P.elements(s);
    const altKm = P.alt(s);
    const utc = LAUNCH_UTC_MIN + s.t / 60;
    const hh = Math.floor(utc / 60) % 24;
    const mm = Math.floor(utc % 60);
    const msk = (hh + 3) % 24;
    const tt = Math.max(0, s.t);
    const tPlus = `T+${String(Math.floor(tt / 3600)).padStart(1, '0')}:${String(Math.floor((tt % 3600) / 60)).padStart(2, '0')}:${String(Math.floor(tt % 60)).padStart(2, '0')}`;
    if (phase !== 'pad') setHtml(clock, `<b>${tPlus}</b>${L(lang, '莫斯科时间', 'Moscow time')} ${String(msk).padStart(2, '0')}:${String(mm).padStart(2, '0')}`);
    const q = P.qPressure(s);
    const stageName = phase === 'ascent' ? [L(lang, '一级 · 助推器＋芯级', 'Stage 1 · boosters + core'), L(lang, '二级 · 芯级', 'Stage 2 · core'), L(lang, '三级 · 末级', 'Stage 3 · upper stage')][stageIdx] : phase === 'orbit' ? L(lang, '轨道飞行', 'In orbit') : phase === 'reentry' ? L(lang, '返回', 'Re-entry') : '';
    const rows = [
      [L(lang, '高度', 'Altitude'), `${altKm.toFixed(altKm < 10 ? 2 : 0)} km`],
      [L(lang, '速度', 'Speed'), `${P.speed(s).toFixed(2)} km/s`],
      [L(lang, '航迹角', 'Flight path'), `${P.fpa(s).toFixed(1)}°`],
      ...(phase === 'ascent' || phase === 'pad' ? [[L(lang, '俯仰角', 'Pitch'), `${pitch.toFixed(0)}°`], [L(lang, '动压', 'Dyn. pressure'), `<span class="${q > 50 ? 'warn' : ''}">${q.toFixed(0)} kPa</span>`]] : []),
      ...(phase === 'reentry' ? [[L(lang, '过载', 'Load'), `${peakG.toFixed(1)} g`]] : []),
    ];
    setHtml(left, rows.map(([a, b]) => `<span>${a}</span><b>${b}</b>`).join('') + `<span class="stagebar">${stageName}</span>`);
    const periOk = el.peri >= TARGET_PERI;
    const apoOk = el.apo <= TARGET_APO;
    let txt = `${L(lang, '近地点', 'Perigee')} <b class="${periOk ? 'ok' : 'warn'}">${el.peri < -999 ? '—' : el.peri.toFixed(0)}</b> km · ${L(lang, '远地点', 'Apogee')} <b class="${apoOk && el.apo > 0 ? 'ok' : 'warn'}">${Number.isFinite(el.apo) ? el.apo.toFixed(0) : '∞'}</b> km`;
    if (phase === 'ascent') txt += `<br>${L(lang, `目标：近地点 ≥ ${TARGET_PERI} · 远地点 ≤ ${TARGET_APO}`, `Target: perigee ≥ ${TARGET_PERI} · apogee ≤ ${TARGET_APO}`)}`;
    if (phase === 'orbit' && windowState === 'in' && predicted) txt = `${L(lang, '预计落点距目标', 'Predicted landing from target')}<br><b class="${predicted.d < 150 ? 'ok' : 'warn'}" style="font-size:20px">${predicted.d.toFixed(0)} km</b>`;
    else if (phase === 'orbit') txt += `<br>${L(lang, '等待制动窗口……', 'Waiting for the retro window…')}`;
    setHtml(orbitTxt, txt);
    right.style.display = phase === 'pad' ? 'none' : '';
    btnAct.disabled = !((phase === 'ascent' && engineOn && stageIdx === 2) || (phase === 'orbit' && windowState === 'in'));
    dial.style.display = phase === 'ascent' || phase === 'pad' ? '' : 'none';
    controls.style.display = phase === 'done' ? 'none' : '';
    drawDial();
    drawOrbit(el);
  }

  function drawDial() {
    const W = dial.width;
    const c = dctx;
    c.clearRect(0, 0, W, W);
    const cx = W / 2;
    const r = W * 0.42;
    c.fillStyle = 'rgba(8,10,16,.55)';
    c.beginPath();
    c.arc(cx, cx, r + 10, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,.18)';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(cx, cx, r, Math.PI, 0);
    c.stroke();
    // horizon
    c.strokeStyle = 'rgba(140,190,255,.6)';
    c.beginPath();
    c.moveTo(cx - r - 6, cx);
    c.lineTo(cx + r + 6, cx);
    c.stroke();
    const arrow = (deg: number, color: string, w: number, len: number) => {
      const a = THREE.MathUtils.degToRad(deg);
      c.strokeStyle = color;
      c.lineWidth = w;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(cx, cx);
      c.lineTo(cx + Math.cos(a) * len, cx - Math.sin(a) * len);
      c.stroke();
    };
    if (phase === 'ascent') arrow(guidePitch(s.t), 'rgba(255,211,106,.45)', 6, r * 0.95);
    arrow(P.fpa(s), 'rgba(160,200,255,.8)', 3, r * 0.7);
    arrow(pitch, '#ffffff', 7, r * 0.9);
    c.fillStyle = '#fff';
    c.font = `${W * 0.085}px Inter, sans-serif`;
    c.textAlign = 'center';
    c.fillText(`${pitch.toFixed(0)}°`, cx, cx + r * 0.42);
    c.fillStyle = 'rgba(255,211,106,.8)';
    c.font = `${W * 0.06}px Inter, sans-serif`;
    c.fillText(L(lang, '金：参考 · 蓝：航迹', 'gold: guide · blue: path'), cx, cx + r * 0.68);
  }

  function drawOrbit(el: P.Elements) {
    const W = orbitCv.width;
    const c = octx;
    c.clearRect(0, 0, W, W);
    const cx = W / 2;
    const Rd = W * 0.24; // Earth radius on the diagram
    const k = (W * 0.22) / 400; // px per km of altitude (exaggerated)
    const rd = (r: number) => Rd + Math.max(-Rd, (r - P.RE) * k);
    // the diagram's "up" is the launch site
    const toXY = (ang: number, r: number) => [cx + Math.sin(ang) * rd(r), cx - Math.cos(ang) * rd(r)];
    // target band
    c.fillStyle = 'rgba(142,240,176,.12)';
    c.beginPath();
    c.arc(cx, cx, rd(P.RE + TARGET_APO), 0, Math.PI * 2);
    c.arc(cx, cx, rd(P.RE + TARGET_PERI), 0, Math.PI * 2, true);
    c.fill();
    // Earth
    const g = c.createRadialGradient(cx - Rd * 0.3, cx - Rd * 0.3, Rd * 0.1, cx, cx, Rd);
    g.addColorStop(0, '#3d6fae');
    g.addColorStop(1, '#16304f');
    c.fillStyle = g;
    c.beginPath();
    c.arc(cx, cx, Rd, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = 'rgba(120,180,255,.5)';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(cx, cx, rd(P.RE + 100), 0, Math.PI * 2);
    c.setLineDash([6, 8]);
    c.stroke();
    c.setLineDash([]);
    // predicted orbit / trajectory: sample the conic
    const r0 = Math.hypot(s.x, s.y);
    const th0 = P.downrangeAngle(s);
    if (el.e < 0.999 && el.hmom !== 0) {
      const p = (el.hmom * el.hmom) / P.MU;
      // true anomaly of the craft now
      const rv = (s.x * s.vx + s.y * s.vy) / r0;
      const nu0 = Math.atan2((rv * Math.abs(el.hmom)) / P.MU, p / r0 - 1);
      const dirSign = el.hmom < 0 ? 1 : -1; // hmom < 0: moving toward +downrange angle
      c.strokeStyle = '#ffd36a';
      c.lineWidth = 3.5;
      c.beginPath();
      for (let i = 0; i <= 200; i++) {
        const dnu = (i / 200) * Math.PI * 2;
        const r = p / (1 + el.e * Math.cos(nu0 + dnu));
        if (r < P.RE - 50) break;
        const [x, y] = toXY(th0 + dirSign * dnu, Math.min(r, P.RE + 900));
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
    }
    const [px, py] = toXY(th0, r0);
    c.fillStyle = '#fff';
    c.beginPath();
    c.arc(px, py, 6, 0, Math.PI * 2);
    c.fill();
  }

  const tagV = new THREE.Vector3();
  function updateTags() {
    if ((phase !== 'orbit' && phase !== 'reentry') || !targetMk.visible) {
      tag.style.transform = 'translate(-9999px,0)';
      return;
    }
    targetMk.getWorldPosition(tagV);
    const visible = tagV.clone().sub(camera.position).dot(tagV) < 0;
    tagV.project(camera);
    tag.className = 'vk-tag target';
    tag.textContent = L(lang, '◎ 目标：斯梅洛夫卡（萨拉托夫州）', '◎ Target: Smelovka (Saratov)');
    tag.style.transform = visible ? `translate(${((tagV.x + 1) / 2) * stage.size.w + 12}px, ${((1 - tagV.y) / 2) * stage.size.h - 8}px)` : 'translate(-9999px,0)';
  }

  // ---------- result ----------
  function finish() {
    if (ended) return;
    ended = true;
    engine.set(0);
    rumble.set(0);
    const lines: GameResult['lines'] = [];
    let ascentScore = 0;
    let landScore = 0;
    if (failure === 'crash' || failure === 'maxq') {
      lines.push({ zh: failure === 'crash' ? '上升段失败：俯仰压得太早，火箭坠地' : '上升段失败：在稠密大气中速度过快，动压超限', en: failure === 'crash' ? 'Ascent failed: pitched over too far, too soon' : 'Ascent failed: too fast in the thick lower air' });
      lines.push({ zh: '诀窍：先垂直爬升，离开稠密大气后再逐渐压平', en: 'Tip: climb steeply first, then lean over gradually once out of the thick air' });
    } else if (failure === 'suborbital' || !insertion) {
      const el = P.elements(s);
      lines.push({ zh: `未能入轨：近地点 ${el.peri.toFixed(0)} km，仍在大气层内`, en: `No orbit: perigee ${el.peri.toFixed(0)} km, still inside the atmosphere` });
      lines.push({ zh: '诀窍：上升到约 200 公里后把俯仰压到接近水平，用推力换速度', en: 'Tip: by ~200 km, hold the nose near the horizon and turn thrust into speed' });
      ascentScore = 5;
    } else {
      const el = insertion;
      ascentScore = 50;
      if (el.peri < TARGET_PERI) ascentScore -= (TARGET_PERI - el.peri) * 0.6;
      if (el.apo > TARGET_APO) ascentScore -= Math.min(30, (el.apo - TARGET_APO) * 0.06);
      ascentScore = clamp(ascentScore, 10, 50);
      lines.push({ zh: `入轨：近地点 ${el.peri.toFixed(0)} km · 远地点 ${Number.isFinite(el.apo) ? el.apo.toFixed(0) : '∞'} km（史实约 169 × 327）`, en: `Orbit: ${el.peri.toFixed(0)} × ${Number.isFinite(el.apo) ? el.apo.toFixed(0) : '∞'} km (the real one: about 169 × 327)` });
      if (el.apo > 500) lines.push({ zh: '轨道偏高：若制动火箭失灵，飞船要很久才会自然坠落', en: 'High orbit: if the retro-rocket failed, natural decay would take a long time' });
      if (landing) {
        const d = P.gcDist(landing, P.LANDING);
        landScore = Math.round(50 * clamp(1 - (d - 40) / 1400, 0, 1));
        lines.push({ zh: `落点距斯梅洛夫卡 ${d.toFixed(0)} km · 最大过载 ${peakG.toFixed(1)} g`, en: `Landed ${d.toFixed(0)} km from Smelovka · peak load ${peakG.toFixed(1)} g` });
        if (retroAt > 0) lines.push({ zh: `制动点火于 T+${(retroAt / 60).toFixed(1)} 分（史实约 T+78 分，安哥拉外海上空）`, en: `Retro-fire at T+${(retroAt / 60).toFixed(1)} min (historically about T+78 min, off Angola)` });
      } else lines.push({ zh: '错过了制动窗口', en: 'The retro-fire window was missed' });
    }
    const score = Math.round(ascentScore + landScore);
    const stars = (score >= 85 ? 3 : score >= 60 ? 2 : score >= 30 ? 1 : 0) as GameResult['stars'];
    const headline = landing
      ? score >= 85
        ? { zh: '“我很好，感觉良好”', en: 'Home in 108 minutes' }
        : { zh: '平安着陆', en: 'Safely down' }
      : insertion
        ? { zh: '滞留轨道', en: 'Stranded in orbit' }
        : { zh: '发射失败', en: 'Launch failure' };
    ctx.end({ score, stars, headline, lines });
  }

  return {
    dispose() {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      engine.stop();
      rumble.stop();
      sfx.dispose();
      stage.dispose();
      hud.remove();
    },
  };
};

// ---------- helpers ----------

const latlon = (p: { lat: number; lon: number }) => [p.lat, p.lon] as [number, number];

const htmlCache = new WeakMap<HTMLElement, string>();
function setHtml(el: HTMLElement, html: string) {
  if (htmlCache.get(el) === html) return;
  htmlCache.set(el, html);
  el.innerHTML = html;
}

/** A polar grid of the sphere around (lat, lon), dense at the centre, for the launch area. */
function patchGeometry(lat: number, lon: number, maxAng: number, rings: number, segs: number) {
  const c = new THREE.Vector3(...P.geo(lat, lon));
  const la = THREE.MathUtils.degToRad(lat);
  const lo = THREE.MathUtils.degToRad(lon);
  const n = new THREE.Vector3(-Math.sin(la) * Math.cos(lo), Math.cos(la), Math.sin(la) * Math.sin(lo));
  const e = new THREE.Vector3(-Math.sin(lo), 0, -Math.cos(lo));
  const pos: number[] = [];
  const uv: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const v = new THREE.Vector3();
  for (let i = 0; i <= rings; i++) {
    const th = maxAng * Math.pow(i / rings, 2.6);
    for (let j = 0; j <= segs; j++) {
      const ph = (j / segs) * Math.PI * 2;
      v.copy(c)
        .multiplyScalar(Math.cos(th))
        .addScaledVector(n, Math.sin(th) * Math.cos(ph))
        .addScaledVector(e, Math.sin(th) * Math.sin(ph))
        .normalize();
      pos.push((v.x - c.x) * P.RE, (v.y - c.y) * P.RE, (v.z - c.z) * P.RE);
      nor.push(v.x, v.y, v.z);
      const ll = P.toLatLon([v.x, v.y, v.z]);
      uv.push((ll.lon + 180) / 360, (ll.lat + 90) / 180);
    }
  }
  for (let i = 0; i < rings; i++)
    for (let j = 0; j < segs; j++) {
      const a = i * (segs + 1) + j;
      const b = a + segs + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1); // counter-clockwise seen from above
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

/** The descent module's main parachute: an orange-and-white canopy on shroud lines, in km. */
function buildChute() {
  const root = new THREE.Group();
  const m = new THREE.Group();
  m.scale.setScalar(0.001); // built in metres; the capsule hangs at the origin
  root.add(m);
  const gores = 16;
  const R = 13;
  const H = 34; // capsule to canopy skirt
  for (let i = 0; i < gores; i++) {
    const g = new THREE.SphereGeometry(R, 3, 10, (i / gores) * Math.PI * 2, (Math.PI * 2) / gores, 0, Math.PI * 0.42);
    const mat = new THREE.MeshStandardMaterial({ color: i % 2 ? 0xf2efe6 : 0xff7a2a, roughness: 0.9, side: THREE.DoubleSide });
    const gore = new THREE.Mesh(g, mat);
    gore.position.y = H - R * Math.cos(Math.PI * 0.42);
    m.add(gore);
  }
  const lines: number[] = [];
  const skirt = R * Math.sin(Math.PI * 0.42);
  for (let i = 0; i < gores; i++) {
    const a = (i / gores) * Math.PI * 2;
    lines.push(0, 1.2, 0, Math.sin(a) * skirt, H, Math.cos(a) * skirt);
  }
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
  m.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xd8d2c4, transparent: true, opacity: 0.7 })));
  return root;
}

/** R-7 / Vostok-K, built in metres, scaled to km. Origin at the base of the core stage. */
function buildR7() {
  const root = new THREE.Group();
  const m = new THREE.Group();
  m.scale.setScalar(0.001);
  root.add(m);
  const white = new THREE.MeshStandardMaterial({ color: 0xd9d9d2, roughness: 0.55, metalness: 0.1 });
  const grey = new THREE.MeshStandardMaterial({ color: 0x8f9188, roughness: 0.6, metalness: 0.2 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2c2e2f, roughness: 0.5, metalness: 0.5 });
  const lathe = (pts: [number, number][], mat: THREE.Material) => new THREE.Mesh(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 32), mat);

  // core (Block A): narrow at the base, widest just above the boosters' tips
  const core = new THREE.Group();
  core.add(lathe([[0.9, 0], [1.0, 2], [1.2, 9], [1.47, 19], [1.47, 27.5], [1.3, 28.2]], white));
  const band = lathe([[1.48, 20], [1.48, 21.2]], grey);
  core.add(band);
  m.add(core);
  // upper stage (Block E) on its truss, then the payload and the fairing
  const upper = new THREE.Group();
  upper.position.y = 28.2;
  upper.add(lathe([[0.9, 0], [1.3, 0.6], [1.3, 3.2], [1.25, 3.4]], grey));
  // the truss
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 4), dark);
    bar.position.set(Math.cos(a) * 1.1, -0.4, Math.sin(a) * 1.1);
    bar.rotation.z = 0.3 * Math.cos(a);
    upper.add(bar);
  }
  const capsule = new THREE.Group();
  capsule.position.y = 3.4;
  const instrument = lathe([[1.2, 0], [1.25, 0.6], [0.7, 1.9], [0.3, 2.1]], grey); // instrument module
  capsule.add(instrument);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1.15, 28, 20), new THREE.MeshStandardMaterial({ color: 0x9a8f7a, roughness: 0.8 }));
  ball.position.y = 3.0;
  capsule.add(ball);
  upper.add(capsule);
  const fairing: THREE.Object3D[] = [];
  for (const side of [0, 1]) {
    const half = new THREE.Mesh(
      new THREE.LatheGeometry(
        [[1.32, 0], [1.32, 4.4], [1.0, 6.3], [0.35, 7.6], [0.05, 7.9]].map(([r, y]) => new THREE.Vector2(r, y)),
        24,
        side * Math.PI,
        Math.PI,
      ),
      white,
    );
    half.position.y = 3.3;
    upper.add(half);
    fairing.push(half);
  }
  m.add(upper);

  // four boosters: cones leaning on the core, nozzles at the base
  const boosters: THREE.Object3D[] = [];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const b = new THREE.Group();
    b.position.set(Math.cos(a) * 2.2, 0, Math.sin(a) * 2.2);
    const body = lathe([[1.34, 0], [1.3, 3], [0.95, 12], [0.4, 18], [0.1, 19.6]], white);
    b.add(body);
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.2, 1.4), grey);
    fin.position.set(Math.cos(a) * 1.3, 1.1, Math.sin(a) * 1.3);
    fin.rotation.y = -a;
    b.add(fin);
    for (let k = 0; k < 4; k++) {
      const noz = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 0.9, 12, 1, true), dark);
      noz.position.set(Math.cos((k * Math.PI) / 2) * 0.55, -0.4, Math.sin((k * Math.PI) / 2) * 0.55);
      b.add(noz);
    }
    m.add(b);
    boosters.push(b);
  }
  for (let k = 0; k < 4; k++) {
    const noz = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 0.9, 12, 1, true), dark);
    noz.position.set(Math.cos((k * Math.PI) / 2) * 0.5, -0.4, Math.sin((k * Math.PI) / 2) * 0.5);
    core.add(noz);
  }
  return { root, core, upper, boosters, fairing, capsule, ball, instrument };
}

function plumeMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uK: { value: 1 } },
    vertexShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_vertex>
      varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.0); vV = -normalize(mv.xyz); vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * mv;
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform float uTime; uniform float uK; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        #include <logdepthbuf_fragment>
        float along = 1.0 - vUv.y;            // 0 at the nozzle … 1 at the tip
        float edge = pow(abs(dot(normalize(vN), normalize(vV))), 1.5);
        float shock = 0.75 + 0.25 * sin(along * 38.0 - uTime * 40.0);
        float a = edge * pow(1.0 - along, 1.6) * shock * uK;
        vec3 c = mix(vec3(1.0, 0.95, 0.8), vec3(1.0, 0.45, 0.12), smoothstep(0.0, 0.5, along));
        gl_FragColor = vec4(c * a * 2.2, a);
      }`,
  });
}

function setPlume(m: THREE.Mesh, on: boolean, len: number, widen: number, t: number) {
  m.visible = on;
  if (!on) return;
  m.scale.set(widen, len, widen);
  const u = (m.material as THREE.ShaderMaterial).uniforms;
  u.uTime.value = t;
}

/** Smoke puffs that stay where they were emitted (the contrail and the launch cloud). */
class WorldPuffs {
  points: THREE.Points;
  private pos: Float32Array;
  private vel: Float32Array;
  private life: Float32Array;
  private max: Float32Array;
  private size: Float32Array;
  private aLife: Float32Array;
  private next = 0;
  constructor(
    private n: number,
    tex: THREE.Texture,
  ) {
    this.pos = new Float32Array(n * 3);
    this.vel = new Float32Array(n * 3);
    this.life = new Float32Array(n).fill(1);
    this.max = new Float32Array(n).fill(1);
    this.size = new Float32Array(n);
    this.aLife = new Float32Array(n).fill(1);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute('aLife', new THREE.BufferAttribute(this.aLife, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTex: { value: tex }, uScale: { value: 900 } },
      vertexShader: /* glsl */ `
        #include <common>
        #include <logdepthbuf_pars_vertex>
        attribute float aLife; attribute float aSize; varying float vLife; uniform float uScale;
        void main(){ vLife = aLife; vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = aLife >= 1.0 ? 0.0 : min(900.0, aSize * (0.5 + aLife * 2.5) * uScale / -mv.z);
          gl_Position = projectionMatrix * mv;
          #include <logdepthbuf_vertex>
        }`,
      fragmentShader: /* glsl */ `
        #include <common>
        #include <logdepthbuf_pars_fragment>
        uniform sampler2D uTex; varying float vLife;
        void main(){
          #include <logdepthbuf_fragment>
          float a = texture2D(uTex, gl_PointCoord).a;
          vec3 c = mix(vec3(1.0, 0.85, 0.6), vec3(0.92, 0.93, 0.95), smoothstep(0.0, 0.08, vLife));
          gl_FragColor = vec4(c, a * 0.55 * (1.0 - vLife));
        }`,
    });
    this.points = new THREE.Points(g, mat);
    this.points.frustumCulled = false;
  }
  /** `near` > 0: a local puff of that radius (km) at `p`, e.g. dust at touchdown. */
  emit(p: THREE.Vector3, up: THREE.Vector3, dir: THREE.Vector3, size: number, life: number, burst = false, near = 0) {
    const i = this.next;
    this.next = (this.next + 1) % this.n;
    const back = burst || near ? 0 : 0.03 + Math.random() * 0.01;
    const j = near || 0.02;
    const rx = (Math.random() - 0.5) * j;
    const rz = (Math.random() - 0.5) * j;
    this.pos.set([p.x - dir.x * back + rx, p.y - dir.y * back, p.z - dir.z * back + rz], i * 3);
    const spread = near ? near * 0.5 : burst ? 0.05 : 0.004;
    this.vel.set([(Math.random() - 0.5) * spread + up.x * 0.001, (Math.random() - 0.5) * spread + up.y * 0.001, (Math.random() - 0.5) * spread + up.z * 0.001], i * 3);
    this.life[i] = 0;
    this.max[i] = life;
    this.size[i] = size;
  }
  setScale(px: number) {
    (this.points.material as THREE.ShaderMaterial).uniforms.uScale.value = px;
  }
  update(dt: number) {
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] >= 1) {
        this.aLife[i] = 1;
        continue;
      }
      this.life[i] += dt / this.max[i];
      const j = i * 3;
      this.pos[j] += this.vel[j] * dt;
      this.pos[j + 1] += this.vel[j + 1] * dt;
      this.pos[j + 2] += this.vel[j + 2] * dt;
      this.aLife[i] = Math.min(1, this.life[i]);
    }
    const g = this.points.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.aLife.needsUpdate = true;
    g.attributes.aSize.needsUpdate = true;
  }
}

