import type { ServiceResult } from "@/lib/types/common";

export interface AudioChannel { id: string; name: string; streamUrl: string; type: "quran-radio" | "tawasheeh" | "nasheed" }
export interface AudioPlaylist { id: string; title: string; items: AudioChannel[] }

const CHANNELS: AudioChannel[] = [
  { id: "quran-makkah", name: "Quran Radio Makkah", streamUrl: "https://example.com/quran", type: "quran-radio" },
  { id: "tawasheeh-1", name: "Tawasheeh Classics", streamUrl: "https://example.com/tawasheeh", type: "tawasheeh" },
  { id: "nasheed-1", name: "Nasheed Mix", streamUrl: "https://example.com/nasheed", type: "nasheed" },
];

export async function getRadioChannels(): Promise<ServiceResult<AudioChannel[]>> { return { data: CHANNELS, error: null, fetchedAt: new Date().toISOString(), fromCache: true }; }
export async function getNasheeds(): Promise<ServiceResult<AudioChannel[]>> { return { data: CHANNELS.filter((c) => c.type === "nasheed"), error: null, fetchedAt: new Date().toISOString(), fromCache: true }; }
export async function getAudioPlaylists(): Promise<ServiceResult<AudioPlaylist[]>> {
  return { data: [{ id: "daily", title: "Daily Listening", items: CHANNELS }], error: null, fetchedAt: new Date().toISOString(), fromCache: true };
}
// Future-ready: integrate offline bookmarks + reciter catalogs.
