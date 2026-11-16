/**
 * Tiny synthesised sound effects (no audio files): noise bursts and swept tones through Web Audio.
 * Everything goes through one master gain so a game can fade out on dispose.
 */
export function createSfx() {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let noiseBuf: AudioBuffer | null = null;
  const get = () => {
    if (!ctx) {
      try {
        ctx = new AudioContext();
      } catch {
        return null;
      }
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  };

  /** Filtered noise: whoosh, roar, crackle, thump. */
  const noise = (o: { dur: number; freq: number; q?: number; gain?: number; attack?: number; type?: BiquadFilterType; sweepTo?: number }) => {
    const c = get();
    if (!c || !master || !noiseBuf) return;
    const t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    const f = c.createBiquadFilter();
    f.type = o.type ?? 'bandpass';
    f.frequency.setValueAtTime(o.freq, t);
    if (o.sweepTo) f.frequency.exponentialRampToValueAtTime(o.sweepTo, t + o.dur);
    f.Q.value = o.q ?? 1;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.gain ?? 0.4, t + (o.attack ?? 0.02));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    src.connect(f).connect(g).connect(master);
    src.start(t, Math.random());
    src.stop(t + o.dur + 0.05);
  };

  const tone = (o: { freq: number; to?: number; dur: number; type?: OscillatorType; gain?: number; attack?: number }) => {
    const c = get();
    if (!c || !master) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(o.freq, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.gain ?? 0.2, t + (o.attack ?? 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + o.dur + 0.05);
  };

  /** A held, adjustable noise bed (wind, engine roar, fire). Returns a level setter. */
  const bed = (freq: number, q = 0.7, type: BiquadFilterType = 'lowpass') => {
    const c = get();
    if (!c || !master || !noiseBuf) return { set: (_level: number, _freq?: number) => {}, stop: () => {} };
    const src = c.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = c.createGain();
    g.gain.value = 0;
    src.connect(f).connect(g).connect(master);
    src.start();
    return {
      set(level: number, fr?: number) {
        const t = c.currentTime;
        g.gain.setTargetAtTime(Math.max(0, level), t, 0.15);
        if (fr) f.frequency.setTargetAtTime(fr, t, 0.2);
      },
      stop() {
        g.gain.setTargetAtTime(0, c.currentTime, 0.1);
        src.stop(c.currentTime + 0.5);
      },
    };
  };

  return {
    noise,
    tone,
    bed,
    dispose() {
      if (!ctx || !master) return;
      const c = ctx;
      master.gain.setTargetAtTime(0, c.currentTime, 0.08);
      setTimeout(() => void c.close(), 400);
      ctx = null;
    },
  };
}

export type Sfx = ReturnType<typeof createSfx>;
