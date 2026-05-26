export interface RadioChannel { id: string; name: string; streamUrl: string; category: 'quran' | 'tawasheeh'; }
export interface Nasheed { id: string; title: string; artist: string; audioUrl: string; }
export interface AudioPlaylist { id: string; title: string; items: Array<RadioChannel | Nasheed>; }

export async function getRadioChannels(): Promise<RadioChannel[]> {
  return [
    { id: 'quran-sa', name: 'Quran Radio KSA', streamUrl: 'https://stream.radiojar.com/8s5u5tpdtwzuv', category: 'quran' },
    { id: 'tawasheeh-1', name: 'Tawasheeh Mix', streamUrl: 'https://example.com/tawasheeh-stream', category: 'tawasheeh' },
  ];
}

export async function getNasheeds(): Promise<Nasheed[]> {
  return [{ id: 'n1', title: 'Tala al Badru', artist: 'Traditional', audioUrl: 'https://example.com/nasheed-1.mp3' }];
}

export async function getAudioPlaylists(): Promise<AudioPlaylist[]> {
  const [channels, nasheeds] = await Promise.all([getRadioChannels(), getNasheeds()]);
  return [{ id: 'featured', title: 'Featured Islamic Audio', items: [...channels, ...nasheeds] }];
}

// Future audio support:
// - Replace placeholders with verified free/public streams and CDN assets.
// - Add reciter-based Quran playlists and offline caching metadata.
