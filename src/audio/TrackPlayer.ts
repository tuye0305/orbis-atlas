import type { RegionKey } from '../types';

/**
 * Plays the recorded per-region soundtrack listed in public/music/manifest.json (generated with
 * Suno by scripts/gen-music.mjs) and crossfades as the globe turns from one region to another.
 *
 * Same interface as the procedural MusicEngine, which stays as the fallback when no tracks have
 * been generated yet. Volume runs through Web Audio gain nodes, because iOS ignores
 * HTMLMediaElement.volume.
 */

export interface MusicTrack {
  file: string;
  title: string;
  duration: number;
}
export interface MusicManifest {
  generated: string | null;
  regions: Partial<Record<RegionKey | 'ocean', MusicTrack[]>>;
}

type Slot = RegionKey | 'ocean';
interface Channel {
  slot: Slot;
  tracks: MusicTrack[];
  index: number;
  el: HTMLAudioElement;
  gain: GainNode;
}

const BASE = `${import.meta.env.BASE_URL}music/`;
const FADE = 3.5; // seconds for a region crossfade
const SETTLE = 900; // ms a region must stay put before the music follows (region detection can flicker)
const OCEAN_SETTLE = 6000; // ms over open sea before switching to the sea track
const LEVEL = 0.7;

export async function loadManifest(): Promise<MusicManifest | null> {
  try {
    const res = await fetch(`${BASE}manifest.json`, { cache: 'no-cache' });
    if (!res.ok) return null;
    const m = (await res.json()) as MusicManifest;
    return Object.values(m.regions ?? {}).some((t) => t?.length) ? m : null;
  } catch {
    return null;
  }
}

export class TrackPlayer {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private channels = new Map<Slot, Channel>();
  private current: Channel | null = null;
  private enabled = false;
  private pending: number | undefined;
  private region: RegionKey | null = null;
  private holdUntil = 0;
  /** Called with the title of the track now playing (or null), so the UI can show it. */
  onTrack: ((t: { slot: Slot; title: string } | null) => void) | null = null;

  constructor(private manifest: MusicManifest) {}

  private init() {
    if (this.ctx) return;
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);
  }

  /** The slot to play for a region: its own tracks, else the open-sea score, else whatever plays now. */
  private slotFor(region: RegionKey | null): Slot | null {
    const has = (s: Slot) => !!this.manifest.regions[s]?.length;
    if (region && has(region)) return region;
    if (has('ocean')) return 'ocean';
    return this.current?.slot ?? (Object.keys(this.manifest.regions) as Slot[]).find(has) ?? null;
  }

  private channel(slot: Slot): Channel {
    let ch = this.channels.get(slot);
    if (ch) return ch;
    const ctx = this.ctx!;
    const tracks = this.manifest.regions[slot]!;
    const el = new Audio();
    el.preload = 'auto';
    el.crossOrigin = 'anonymous';
    // Different visitors hear different takes first.
    const index = Math.floor(Math.random() * tracks.length);
    el.src = BASE + tracks[index].file;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    ctx.createMediaElementSource(el).connect(gain);
    gain.connect(this.master);
    ch = { slot, tracks, index, el, gain };
    const c = ch;
    // A region's takes play one after another, then wrap: a playlist rather than one short loop.
    el.addEventListener('ended', () => {
      c.index = (c.index + 1) % c.tracks.length;
      c.el.src = BASE + c.tracks[c.index].file;
      if (this.enabled && this.current === c) {
        void c.el.play().catch(() => {});
        this.announce();
      }
    });
    this.channels.set(slot, ch);
    return ch;
  }

  private announce() {
    const c = this.current;
    this.onTrack?.(this.enabled && c ? { slot: c.slot, title: c.tracks[c.index].title } : null);
  }

  private switchTo(slot: Slot | null, fade = FADE) {
    if (!this.ctx || !slot || this.current?.slot === slot) return;
    const now = this.ctx.currentTime;
    const prev = this.current;
    if (prev) {
      prev.gain.gain.cancelScheduledValues(now);
      prev.gain.gain.setValueAtTime(prev.gain.gain.value, now);
      prev.gain.gain.linearRampToValueAtTime(0, now + fade);
      const el = prev.el;
      // Pause once silent; returning to the region later resumes where it left off.
      window.setTimeout(() => this.current !== prev && el.pause(), fade * 1000 + 100);
    }
    const next = this.channel(slot);
    this.current = next;
    next.gain.gain.cancelScheduledValues(now);
    next.gain.gain.setValueAtTime(next.gain.gain.value, now);
    next.gain.gain.linearRampToValueAtTime(1, now + fade);
    void next.el.play().catch(() => {});
    this.announce();
  }

  /**
   * Keep the music where it is for `ms` (e.g. while the intro swings the camera round), so the
   * regions it sweeps over on the way do not each start a track.
   */
  holdFor(ms: number) {
    this.holdUntil = performance.now() + ms;
  }

  /** Must be called from a user gesture the first time (autoplay rules). */
  setEnabled(on: boolean, region: RegionKey | null) {
    this.enabled = on;
    this.region = region;
    if (on) {
      this.init();
      const ctx = this.ctx!;
      void ctx.resume();
      const now = ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(this.master.gain.value, now);
      this.master.gain.linearRampToValueAtTime(LEVEL, now + 1.2);
      if (this.current) void this.current.el.play().catch(() => {});
      else this.follow();
      this.announce();
    } else if (this.ctx) {
      window.clearTimeout(this.pending);
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(this.master.gain.value, now);
      this.master.gain.linearRampToValueAtTime(0, now + 0.8);
      window.setTimeout(() => {
        if (!this.enabled) for (const c of this.channels.values()) c.el.pause();
      }, 900);
      this.announce();
    }
  }

  setRegion(region: RegionKey | null) {
    this.region = region;
    if (this.enabled) this.follow();
  }

  /**
   * Schedule a switch to the region now under the camera. A real region must hold for SETTLE ms;
   * open sea for OCEAN_SETTLE ms, because fly-tos routinely pass over water; nothing switches
   * during a hold. The target is re-read when the timer fires, so only the latest region counts.
   */
  private follow() {
    window.clearTimeout(this.pending);
    if (this.slotFor(this.region) === this.current?.slot && this.current) return;
    const hold = Math.max(0, this.holdUntil - performance.now());
    // Nothing playing yet: a real region starts at once, open sea only after a longer wait.
    const settle = !this.current ? (this.region ? 0 : OCEAN_SETTLE * 1.5) : this.region ? SETTLE : OCEAN_SETTLE;
    this.pending = window.setTimeout(() => {
      if (!this.enabled) return;
      this.switchTo(this.slotFor(this.region), this.current ? FADE : 1.5);
    }, Math.max(hold, settle));
  }
}
