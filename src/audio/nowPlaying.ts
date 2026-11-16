import { useSyncExternalStore } from 'react';
import type { RegionKey } from '../types';

/**
 * Which region's music is actually sounding (or null). The camera region can run ahead of the
 * music: it settles before it follows, open sea waits longer, and a track that fails to load
 * falls back to the open-sea score. The top bar labels what you hear, not where you look.
 * Kept out of TrackPlayer so the top bar does not pull in the lazily loaded player.
 */
export type MusicSlot = RegionKey | 'ocean';

let slot: MusicSlot | null = null;
const listeners = new Set<() => void>();

export function setNowPlaying(next: MusicSlot | null) {
  if (next === slot) return;
  slot = next;
  for (const l of listeners) l();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useNowPlaying = () => useSyncExternalStore(subscribe, () => slot);
