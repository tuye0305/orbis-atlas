import type { RegionKey } from '../types';

/**
 * Code-synthesised regional scores (Web Audio). Every score shares the tonic D so a
 * crossfade between regions stays consonant: transitions are marked by harmony and
 * timbre, never by a jump in loudness.
 */

type ScoreKey = RegionKey | 'ocean';
const D3 = 146.83;
const semi = (root: number, n: number) => root * 2 ** (n / 12);
const cents = (root: number, c: number) => root * 2 ** (c / 1200);

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Voices {
  constructor(
    public ctx: AudioContext,
    public out: AudioNode,
    public send: AudioNode,
  ) {}

  private env(t: number, peak: number, attack: number, decay: number) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    return g;
  }

  private connect(node: AudioNode, wet = 0.35) {
    node.connect(this.out);
    if (wet > 0) {
      const s = this.ctx.createGain();
      s.gain.value = wet;
      node.connect(s).connect(this.send);
    }
  }

  /** Plucked string: guzheng, oud, lute, kora, sitar, dombra depending on params. */
  pluck(t: number, freq: number, o: { vol?: number; decay?: number; bright?: number; bend?: number; type?: OscillatorType; shimmer?: number; wet?: number } = {}) {
    const { vol = 0.18, decay = 1.6, bright = 6, bend = 0, type = 'sawtooth', shimmer = 0, wet = 0.35 } = o;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = type;
    if (bend) {
      osc.frequency.setValueAtTime(freq * 2 ** (bend / 12), t);
      osc.frequency.exponentialRampToValueAtTime(freq, t + 0.09);
    } else osc.frequency.setValueAtTime(freq, t);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = 1.2;
    lp.frequency.setValueAtTime(Math.min(16000, freq * bright), t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(200, freq * 1.3), t + decay * 0.8);
    const g = this.env(t, vol, 0.004, decay);
    osc.connect(lp).connect(g);
    this.connect(g, wet);
    osc.start(t);
    osc.stop(t + decay + 0.1);
    if (shimmer > 0) {
      const o2 = ctx.createOscillator();
      o2.type = 'sine';
      o2.frequency.setValueAtTime(freq * 2.01, t);
      const g2 = this.env(t + 0.02, vol * shimmer, 0.05, decay * 1.4);
      o2.connect(g2);
      this.connect(g2, 0.8);
      o2.start(t);
      o2.stop(t + decay * 1.5 + 0.1);
    }
  }

  /** Soft sustained chord (organ / pad). */
  pad(t: number, freqs: number[], dur: number, o: { vol?: number; cutoff?: number; type?: OscillatorType } = {}) {
    const { vol = 0.05, cutoff = 1200, type = 'sawtooth' } = o;
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + Math.min(1.5, dur * 0.4));
    g.gain.setValueAtTime(vol, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 1.2);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = cutoff;
    lp.connect(g);
    this.connect(g, 0.6);
    for (const f of freqs) {
      for (const det of [-5, 5]) {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = f;
        osc.detune.value = det;
        osc.connect(lp);
        osc.start(t);
        osc.stop(t + dur + 1.3);
      }
    }
  }

  /** Metallophone / bell with inharmonic partials. */
  bell(t: number, freq: number, o: { vol?: number; decay?: number; partials?: number[] } = {}) {
    const { vol = 0.12, decay = 2.5, partials = [1, 2.0, 2.76, 5.4] } = o;
    partials.forEach((p, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * p;
      const g = this.env(t, vol / (1 + i * 1.6), 0.002, decay / (1 + i * 0.7));
      osc.connect(g);
      this.connect(g, 0.5);
      osc.start(t);
      osc.stop(t + decay + 0.1);
    });
  }

  /** Hand drum: pitched thump plus a filtered noise slap. */
  drum(t: number, o: { pitch?: number; vol?: number; decay?: number; noise?: number; hp?: number } = {}) {
    const { pitch = 90, vol = 0.35, decay = 0.35, noise = 0.15, hp = 1800 } = o;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch * 2.4, t);
    osc.frequency.exponentialRampToValueAtTime(pitch, t + 0.045);
    const g = this.env(t, vol, 0.002, decay);
    osc.connect(g);
    this.connect(g, 0.15);
    osc.start(t);
    osc.stop(t + decay + 0.05);
    if (noise > 0) {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx);
      const f = ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = hp;
      const gn = this.env(t, noise, 0.001, 0.08);
      src.connect(f).connect(gn);
      this.connect(gn, 0.2);
      src.start(t);
      src.stop(t + 0.12);
    }
  }

  /** Bowed string with vibrato (morin khuur / rebab). */
  bowed(t: number, freq: number, dur: number, vol = 0.06) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 5.2;
    const lg = ctx.createGain();
    lg.gain.value = freq * 0.006;
    lfo.connect(lg).connect(osc.frequency);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = freq * 4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.3);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    osc.connect(lp).connect(g);
    this.connect(g, 0.5);
    osc.start(t);
    lfo.start(t);
    osc.stop(t + dur + 0.05);
    lfo.stop(t + dur + 0.05);
  }
  /** End-blown / duct flute: breathy sine with a chiff, delayed vibrato and breath noise. */
  flute(t: number, freq: number, dur: number, o: { vol?: number; vib?: number; breath?: number; bend?: number } = {}) {
    const { vol = 0.07, vib = 0.012, breath = 0.25, bend = 0 } = o;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    if (bend) {
      osc.frequency.setValueAtTime(freq * 2 ** (bend / 12), t);
      osc.frequency.exponentialRampToValueAtTime(freq, t + 0.12);
    } else osc.frequency.setValueAtTime(freq, t);
    const o2 = ctx.createOscillator();
    o2.type = 'triangle';
    o2.frequency.value = freq * 2;
    const g2 = ctx.createGain();
    g2.gain.value = 0.18;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 4.8;
    const lg = ctx.createGain();
    lg.gain.setValueAtTime(0, t);
    lg.gain.linearRampToValueAtTime(freq * vib, t + Math.min(0.6, dur * 0.5));
    lfo.connect(lg).connect(osc.frequency);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.06);
    g.gain.setValueAtTime(vol * 0.85, t + dur * 0.75);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    o2.connect(g2).connect(g);
    this.connect(g, 0.55);
    if (breath > 0) {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx);
      src.loop = true;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq * 2;
      bp.Q.value = 2.5;
      const gn = ctx.createGain();
      gn.gain.setValueAtTime(0.0001, t);
      gn.gain.linearRampToValueAtTime(vol * breath * 1.6, t + 0.02); // chiff
      gn.gain.linearRampToValueAtTime(vol * breath * 0.4, t + 0.12);
      gn.gain.linearRampToValueAtTime(0.0001, t + dur);
      src.connect(bp).connect(gn);
      this.connect(gn, 0.5);
      src.start(t);
      src.stop(t + dur + 0.05);
    }
    for (const n of [osc, o2, lfo]) {
      n.start(t);
      n.stop(t + dur + 0.05);
    }
  }
}

let _noise: AudioBuffer | null = null;
function noiseBuffer(ctx: AudioContext) {
  if (!_noise) {
    _noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = _noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return _noise;
}

abstract class Score {
  bus: GainNode;
  v: Voices;
  step = 0;
  nextTime = 0;
  rng: () => number;
  sustained: AudioScheduledSourceNode[] = [];
  abstract stepsPerBeat: number;
  abstract bpm: number;
  constructor(
    public ctx: AudioContext,
    dest: AudioNode,
    send: AudioNode,
    seed: number,
  ) {
    this.bus = ctx.createGain();
    this.bus.gain.value = 0;
    this.bus.connect(dest);
    this.v = new Voices(ctx, this.bus, send);
    this.rng = mulberry32(seed);
  }
  get stepDur() {
    return 60 / this.bpm / this.stepsPerBeat;
  }
  begin(t: number) {
    this.step = 0;
    this.nextTime = t + 0.05;
    this.startSustained(t);
  }
  startSustained(_t: number) {}
  stopSustained(t: number) {
    for (const s of this.sustained) {
      try {
        s.stop(t);
      } catch {}
    }
    this.sustained = [];
  }
  abstract play(t: number, step: number): void;
  pick<T>(arr: T[]) {
    return arr[Math.floor(this.rng() * arr.length)];
  }
  /** A melodic random walk over scale degrees that cadences on the tonic each phrase. */
  walker(scale: number[], span = 10) {
    let i = Math.floor(span / 2);
    return (phrasePos: number, phraseLen: number) => {
      if (phrasePos === phraseLen - 1) {
        i = Math.round(i / scale.length) * scale.length; // land on a tonic
      } else {
        const r = this.rng();
        i += r < 0.35 ? -1 : r < 0.7 ? 1 : r < 0.82 ? -2 : r < 0.94 ? 2 : 0;
        i = Math.max(0, Math.min(span, i));
      }
      const oct = Math.floor(i / scale.length);
      return scale[i % scale.length] + 12 * oct;
    };
  }
}

// ----- East Asia: gong-mode pentatonic on D, guzheng with slides -----
class EastAsia extends Score {
  bpm = 62;
  stepsPerBeat = 2;
  mel = this.walker([0, 2, 4, 7, 9], 11);
  play(t: number, s: number) {
    const bar = 16;
    if (s % bar === 0) {
      this.v.pluck(t, D3 / 2, { vol: 0.2, decay: 4, bright: 3, type: 'triangle', wet: 0.4 });
      this.v.pluck(t + 0.02, semi(D3 / 2, 7), { vol: 0.12, decay: 3.5, bright: 3, type: 'triangle' });
    }
    if (s % 64 === 0) this.v.pad(t, [D3, semi(D3, 7), semi(D3, 14)], 14, { vol: 0.025, cutoff: 700, type: 'triangle' });
    const pos = s % 8;
    if (this.rng() < (pos === 0 ? 0.95 : 0.55)) {
      const n = this.mel(pos, 8);
      const bend = this.rng() < 0.22 ? (this.rng() < 0.5 ? -2 : 2) : 0;
      this.v.pluck(t, semi(D3 * 2, n), { vol: 0.13, decay: 2.2, bright: 9, bend, type: 'sawtooth', shimmer: 0.15 });
      // tremolo (摇指) on a phrase-final note
      if (pos === 7 && this.rng() < 0.4) for (let k = 1; k < 6; k++) this.v.pluck(t + k * 0.07, semi(D3 * 2, n), { vol: 0.05, decay: 0.5, bright: 7 });
    }
  }
}

// ----- Europe: D dorian, organ pad + lute arpeggios -----
class Europe extends Score {
  bpm = 72;
  stepsPerBeat = 2;
  chords = [
    [0, 3, 7],
    [-2, 2, 5],
    [-7, -3, 0],
    [0, 3, 7],
  ]; // Dm – C – G – Dm (i–VII–IV–i)
  play(t: number, s: number) {
    const barSteps = 8;
    const ci = Math.floor(s / (barSteps * 2)) % this.chords.length;
    const chord = this.chords[ci];
    if (s % (barSteps * 2) === 0) {
      this.v.pad(t, chord.map((n) => semi(D3, n)).concat([semi(D3 / 2, chord[0])]), this.stepDur * 16, { vol: 0.03, cutoff: 1500, type: 'square' });
    }
    const arp = [0, 1, 2, 1, 2, 0, 1, 2];
    const n = chord[arp[s % 8]] + (s % 16 >= 8 ? 12 : 0);
    if (this.rng() < 0.85) this.v.pluck(t, semi(D3 * 2, n), { vol: 0.1, decay: 1.2, bright: 7, type: 'triangle' });
    if (s % 32 === 28 && this.rng() < 0.6) this.v.bell(t, semi(D3 * 4, this.pick([0, 7, 9])), { vol: 0.05, decay: 3 });
  }
}

// ----- West Asia: maqam Hijaz on D, oud + daf (maqsum) over a drone -----
class WestAsia extends Score {
  bpm = 84;
  stepsPerBeat = 2;
  mel = this.walker([0, 1, 4, 5, 7, 8, 10], 12);
  startSustained(t: number) {
    for (const [f, vol] of [
      [D3 / 2, 0.05],
      [semi(D3 / 2, 7), 0.03],
    ] as const) {
      const o = this.ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      const lp = this.ctx.createBiquadFilter();
      lp.frequency.value = 500;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 3);
      o.connect(lp).connect(g).connect(this.bus);
      o.start(t);
      this.sustained.push(o);
    }
  }
  play(t: number, s: number) {
    const p = s % 8; // maqsum: D T . T D . T .
    if (p === 0 || p === 4) this.v.drum(t, { pitch: 70, vol: 0.32, decay: 0.45, noise: 0.05 });
    if (p === 1 || p === 3 || p === 6) this.v.drum(t, { pitch: 220, vol: 0.08, decay: 0.12, noise: 0.18, hp: 2500 });
    if (this.rng() < (p % 2 === 0 ? 0.8 : 0.4)) {
      const n = this.mel(s % 16, 16);
      const bend = this.rng() < 0.3 ? -1 : 0;
      this.v.pluck(t, semi(D3 * 2, n), { vol: 0.13, decay: 0.9, bright: 5, bend, type: 'sawtooth' });
      if (this.rng() < 0.18) this.v.pluck(t + this.stepDur / 2, semi(D3 * 2, n + 1), { vol: 0.07, decay: 0.4, bright: 5 });
    }
  }
}

// ----- South Asia: raga Yaman on D, tanpura cycle + sitar alap -----
class SouthAsia extends Score {
  bpm = 56;
  stepsPerBeat = 2;
  mel = this.walker([0, 2, 4, 6, 7, 9, 11], 10);
  play(t: number, s: number) {
    // Tanpura: Pa – Sa – Sa – Sa(low), one string per beat.
    if (s % 2 === 0) {
      const beat = (s / 2) % 4;
      const f = [semi(D3 / 2, 7), D3, D3, D3 / 2][beat];
      this.v.pluck(t, f, { vol: 0.09, decay: 3.8, bright: 14, type: 'sawtooth', shimmer: 0.25, wet: 0.5 });
    }
    // Sitar: slow phrases with meend (slides) and sympathetic shimmer.
    if (s % 4 === 0 && this.rng() < 0.75) {
      const n = this.mel((s / 4) % 8, 8);
      const bend = this.rng() < 0.45 ? this.pick([-2, -1, 2]) : 0;
      this.v.pluck(t, semi(D3 * 2, n), { vol: 0.12, decay: 2.6, bright: 12, bend, type: 'sawtooth', shimmer: 0.35 });
    }
  }
}

// ----- Africa: kora ostinato (kumbengo) + improvised runs, djembe in 12/8 -----
class Africa extends Score {
  bpm = 96;
  stepsPerBeat = 3; // 12/8 feel
  ost = [0, 7, 12, 4, 7, 16, 2, 7, 11, 4, 9, 14];
  bellPat = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
  mel = this.walker([0, 2, 4, 5, 7, 9, 11], 12);
  play(t: number, s: number) {
    const p = s % 12;
    const shift = Math.floor(s / 48) % 2 === 1 ? -2 : 0; // I – bVII alternation
    this.v.pluck(t, semi(D3, this.ost[p] + shift), { vol: 0.1, decay: 1.1, bright: 6, type: 'triangle' });
    if (this.rng() < 0.3 && s % 48 > 24) this.v.pluck(t, semi(D3 * 2, this.mel(p, 12) + shift), { vol: 0.08, decay: 0.8, bright: 8, type: 'triangle' });
    if (this.bellPat[p]) this.v.bell(t, 1650, { vol: 0.025, decay: 0.12, partials: [1, 2.7] });
    if (p === 0 || p === 7) this.v.drum(t, { pitch: 65, vol: 0.34, decay: 0.4, noise: 0.03 });
    if (p === 3 || p === 9) this.v.drum(t, { pitch: 190, vol: 0.12, decay: 0.15, noise: 0.22, hp: 2200 });
    if (p === 10 && this.rng() < 0.5) this.v.drum(t, { pitch: 320, vol: 0.06, decay: 0.08, noise: 0.25, hp: 3000 });
  }
}

// ----- Central Asia: overtone drone, galloping dombra, morin khuur -----
class CentralAsia extends Score {
  bpm = 104;
  stepsPerBeat = 3;
  startSustained(t: number) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = D3 / 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.06, t + 3);
    // Two resonant formants sweep the harmonic series like khöömei.
    for (const q of [14, 18]) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = q;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.07 + this.rng() * 0.05;
      const lg = ctx.createGain();
      lg.gain.value = 500;
      bp.frequency.value = 1100;
      lfo.connect(lg).connect(bp.frequency);
      o.connect(bp).connect(g);
      lfo.start(t);
      this.sustained.push(lfo);
    }
    const lp = ctx.createBiquadFilter();
    lp.frequency.value = 300;
    o.connect(lp).connect(g);
    g.connect(this.bus);
    o.start(t);
    this.sustained.push(o);
  }
  play(t: number, s: number) {
    const p = s % 3; // gallop: long-short-short
    const fifth = Math.floor(s / 12) % 2 === 0 ? [0, 7] : [-2, 5];
    if (p === 0 || this.rng() < 0.7) {
      for (const n of fifth) this.v.pluck(t, semi(D3, n), { vol: p === 0 ? 0.09 : 0.05, decay: 0.45, bright: 6 });
    }
    if (s % 24 === 0 && this.rng() < 0.7) this.v.bowed(t, semi(D3 * 2, this.pick([0, 3, 5, 7, 10, 12])), this.stepDur * 18, 0.05);
  }
}

// ----- Southeast Asia: slendro gamelan with gong cycle -----
class SoutheastAsia extends Score {
  bpm = 76;
  stepsPerBeat = 2;
  sl = [0, 231, 474, 717, 955];
  core = [2, 1, 2, 4, 2, 1, 0, 3, 4, 3, 2, 1, 2, 3, 1, 0];
  tone(deg: number, base: number) {
    const o = Math.floor(deg / 5);
    return cents(base, this.sl[((deg % 5) + 5) % 5] + o * 1200);
  }
  play(t: number, s: number) {
    const beat = Math.floor(s / 2);
    const cyc = beat % 16;
    if (s % 2 === 0) this.v.bell(t, this.tone(this.core[cyc], D3 * 2), { vol: 0.1, decay: 1.8 });
    // bonang kotekan: two interlocking parts on the off- and on-beats
    const part = s % 2 === 0 ? 0 : 1;
    const deg = this.core[(cyc + 1) % 16] + (part ? 1 : 0);
    if (this.rng() < 0.85) this.v.bell(t, this.tone(deg, D3 * 4), { vol: 0.045, decay: 0.6, partials: [1, 3.9] });
    if (s % 32 === 0) this.v.bell(t, D3 / 2, { vol: 0.28, decay: 7, partials: [1, 1.01, 2.4] }); // gong ageng
    if (s % 8 === 4) this.v.bell(t, this.tone(0, D3), { vol: 0.08, decay: 2.5, partials: [1, 1.02, 2.9] }); // kempul
  }
}

// ----- North America: cedar flute in D minor pentatonic over a heartbeat frame drum -----
class NorthAmerica extends Score {
  bpm = 66;
  stepsPerBeat = 2;
  mel = this.walker([0, 3, 5, 7, 10], 10);
  held = 0;
  play(t: number, s: number) {
    // Frame drum "heartbeat": strong–weak on each beat pair.
    if (s % 4 === 0) this.v.drum(t, { pitch: 58, vol: 0.3, decay: 0.6, noise: 0.04, hp: 900 });
    if (s % 4 === 1) this.v.drum(t, { pitch: 62, vol: 0.14, decay: 0.4, noise: 0.03, hp: 900 });
    if (s % 32 === 0) this.v.pad(t, [D3 / 2, semi(D3 / 2, 7)], this.stepDur * 32, { vol: 0.02, cutoff: 500, type: 'triangle' });
    if (this.held > 0) {
      this.held--;
      return;
    }
    const pos = s % 16;
    if (this.rng() < (pos % 4 === 0 ? 0.8 : 0.3)) {
      const n = this.mel(pos, 16);
      const len = this.pick([2, 3, 4, 6]);
      const bend = this.rng() < 0.3 ? -2 : 0;
      this.v.flute(t, semi(D3 * 2, n), this.stepDur * len + 0.2, { vol: 0.075, vib: 0.01, breath: 0.35, bend });
      this.held = len - 1;
    }
  }
}

// ----- Mesoamerica: two-tone teponaztli slit drum, clay ocarinas, seed rattles -----
class Mesoamerica extends Score {
  bpm = 88;
  stepsPerBeat = 2;
  mel = this.walker([0, 2, 5, 7, 9], 10);
  slit = [1, 0, 0, 2, 0, 1, 2, 0, 1, 0, 0, 2, 0, 2, 1, 0];
  play(t: number, s: number) {
    const p = s % 16;
    const hit = this.slit[p];
    // Teponaztli: a wooden slit drum with two tongues (here the tonic and the fifth).
    if (hit) this.v.bell(t, hit === 1 ? D3 : semi(D3, 7), { vol: 0.16, decay: 0.35, partials: [1, 2.95, 4.1] });
    if (p === 0) this.v.drum(t, { pitch: 55, vol: 0.32, decay: 0.7, noise: 0.05, hp: 700 }); // huehuetl
    // ayoyote / seed rattle
    if (s % 2 === 1 && this.rng() < 0.7) this.v.drum(t, { pitch: 900, vol: 0.001, decay: 0.05, noise: 0.07, hp: 5200 }); // noise only
    if (s % 4 === 0 && this.rng() < 0.7) {
      const n = this.mel((s / 4) % 8, 8);
      this.v.flute(t, semi(D3 * 4, n), this.stepDur * (this.rng() < 0.5 ? 2 : 4), { vol: 0.05, vib: 0.004, breath: 0.15 });
    }
    // conch call at the top of each long cycle
    if (s % 128 === 0) this.v.bowed(t, D3, this.stepDur * 10, 0.05);
  }
}

// ----- South America: huayno — siku panpipes in hocket, strummed charango, bombo -----
class SouthAmerica extends Score {
  bpm = 100;
  stepsPerBeat = 2;
  mel = this.walker([0, 3, 5, 7, 10], 12);
  chords = [
    [0, 3, 7],
    [-2, 2, 5],
    [-9, -5, -2],
    [-5, -2, 2],
  ]; // Dm – C – F – Am: the minor/relative-major swing typical of huayno
  play(t: number, s: number) {
    const ci = Math.floor(s / 16) % this.chords.length;
    const chord = this.chords[ci];
    const p = s % 4; // huayno: long – short-short
    if (p === 0) this.v.drum(t, { pitch: 60, vol: 0.32, decay: 0.45, noise: 0.06, hp: 1000 });
    if (p === 3) this.v.drum(t, { pitch: 140, vol: 0.12, decay: 0.15, noise: 0.15, hp: 2000 });
    // charango: quick strum, brighter on the downbeat
    if (p !== 1) chord.forEach((n, k) => this.v.pluck(t + k * 0.012, semi(D3 * 2, n), { vol: p === 0 ? 0.07 : 0.045, decay: 0.5, bright: 10, type: 'triangle' }));
    // siku: two players share one melody in hocket, each pipe row sounding every other note
    if (this.rng() < 0.75) {
      const n = this.mel(s % 8, 8);
      this.v.flute(t, semi(D3 * 2, n + 12), this.stepDur * 1.6, { vol: s % 2 ? 0.055 : 0.07, vib: 0.006, breath: 0.45 });
    }
  }
}

// ----- Oceania: didgeridoo drone with pulsing formants, clapsticks -----
class Oceania extends Score {
  bpm = 92;
  stepsPerBeat = 2;
  formant: BiquadFilterNode | null = null;
  startSustained(t: number) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = D3 / 2; // ~73 Hz, a typical didgeridoo drone
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 6;
    bp.frequency.value = 420;
    this.formant = bp;
    const lp = ctx.createBiquadFilter();
    lp.frequency.value = 260;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.09, t + 3);
    o.connect(bp).connect(g);
    o.connect(lp).connect(g);
    g.connect(this.bus);
    o.start(t);
    this.sustained.push(o);
  }
  play(t: number, s: number) {
    // Shape the drone rhythmically, like circular-breathing mouth movements.
    if (this.formant && s % 2 === 0) {
      const f = this.formant.frequency;
      f.setTargetAtTime(this.pick([380, 520, 700, 450]), t, 0.05);
      f.setTargetAtTime(400, t + this.stepDur, 0.12);
    }
    // bilma (clapsticks)
    if (s % 2 === 0) this.v.bell(t, 2300, { vol: s % 8 === 0 ? 0.06 : 0.035, decay: 0.06, partials: [1, 1.6] });
    if (s % 16 === 12 && this.rng() < 0.6) this.v.bell(t, 2300, { vol: 0.03, decay: 0.05, partials: [1, 1.6] });
    // occasional vocal-like call over the drone
    if (s % 32 === 16 && this.rng() < 0.55) this.v.bowed(t, semi(D3 * 2, this.pick([0, 3, 5, 7])), this.stepDur * 12, 0.035);
  }
}

// ----- Open sea: a slow, neutral Lydian wash -----
class Ocean extends Score {
  bpm = 50;
  stepsPerBeat = 1;
  play(t: number, s: number) {
    if (s % 8 === 0) {
      const ch = Math.floor(s / 8) % 2 ? [0, 4, 9, 14] : [0, 6, 11, 16];
      this.v.pad(t, ch.map((n) => semi(D3, n)), this.stepDur * 8, { vol: 0.028, cutoff: 900, type: 'triangle' });
    }
    if (this.rng() < 0.25) this.v.bell(t, semi(D3 * 4, this.pick([0, 4, 6, 7, 11])), { vol: 0.03, decay: 3.5 });
  }
}

const SCORES: Record<ScoreKey, new (ctx: AudioContext, dest: AudioNode, send: AudioNode, seed: number) => Score> = {
  'east-asia': EastAsia,
  europe: Europe,
  'west-asia': WestAsia,
  'south-asia': SouthAsia,
  africa: Africa,
  'central-asia': CentralAsia,
  'southeast-asia': SoutheastAsia,
  'north-america': NorthAmerica,
  mesoamerica: Mesoamerica,
  'south-america': SouthAmerica,
  oceania: Oceania,
  ocean: Ocean,
};

export class MusicEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private reverb!: ConvolverNode;
  private active = new Map<ScoreKey, Score>();
  private current: ScoreKey | null = null;
  private timer: number | undefined;
  private enabled = false;

  private init() {
    if (this.ctx) return;
    const ctx = new AudioContext();
    this.ctx = ctx;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 3;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(comp).connect(ctx.destination);
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = impulse(ctx, 3.2);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    this.reverb.connect(wet).connect(this.master);
    this.timer = window.setInterval(() => this.schedule(), 40);
  }

  setEnabled(on: boolean, region: RegionKey | null) {
    this.enabled = on;
    if (on) {
      this.init();
      const ctx = this.ctx!;
      ctx.resume();
      this.master.gain.cancelScheduledValues(ctx.currentTime);
      this.master.gain.setTargetAtTime(0.7, ctx.currentTime, 0.8);
      this.setRegion(region);
    } else if (this.ctx) {
      const ctx = this.ctx;
      this.master.gain.cancelScheduledValues(ctx.currentTime);
      this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      window.setTimeout(() => {
        if (!this.enabled) ctx.suspend();
      }, 2000);
    }
  }

  setRegion(region: RegionKey | null) {
    const key: ScoreKey = region ?? 'ocean';
    if (!this.enabled || !this.ctx || key === this.current) {
      if (!this.enabled) this.current = null;
      return;
    }
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const FADE = 4;
    if (this.current) {
      const old = this.active.get(this.current);
      if (old) {
        old.bus.gain.cancelScheduledValues(now);
        old.bus.gain.setValueAtTime(old.bus.gain.value, now);
        old.bus.gain.linearRampToValueAtTime(0, now + FADE);
        const oldKey = this.current;
        window.setTimeout(() => {
          if (this.current !== oldKey && this.active.get(oldKey) === old) {
            old.stopSustained(ctx.currentTime);
            old.bus.disconnect();
            this.active.delete(oldKey);
          }
        }, (FADE + 0.5) * 1000);
      }
    }
    let sc = this.active.get(key);
    if (!sc) {
      sc = new SCORES[key](ctx, this.master, this.reverb, Math.floor(Math.random() * 1e9));
      this.active.set(key, sc);
      // Enter on the next beat of whatever is playing so the downbeats line up.
      sc.begin(now);
    }
    sc.bus.gain.cancelScheduledValues(now);
    sc.bus.gain.setValueAtTime(sc.bus.gain.value, now);
    sc.bus.gain.linearRampToValueAtTime(1, now + FADE);
    this.current = key;
  }

  private schedule() {
    if (!this.ctx || !this.enabled) return;
    const horizon = this.ctx.currentTime + 0.25;
    for (const sc of this.active.values()) {
      while (sc.nextTime < horizon) {
        sc.play(sc.nextTime, sc.step);
        sc.step++;
        sc.nextTime += sc.stepDur;
      }
    }
  }

  dispose() {
    clearInterval(this.timer);
    this.ctx?.close();
  }
}

function impulse(ctx: AudioContext, seconds: number) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.6;
  }
  return buf;
}
