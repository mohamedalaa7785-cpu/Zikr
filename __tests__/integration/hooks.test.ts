import { describe, it, expect } from '@jest/globals';

describe('Hooks Exports', () => {
  it('should export all hooks', async () => {
    const hooks = await import('lib/hooks');
    
    expect(hooks.useUser).toBeDefined();
    expect(hooks.useAuth).toBeDefined();
    expect(hooks.useProfile).toBeDefined();
    expect(hooks.useQuran).toBeDefined();
    expect(hooks.useHadith).toBeDefined();
    expect(hooks.useDua).toBeDefined();
    expect(hooks.useFavorites).toBeDefined();
    expect(hooks.useReadingProgress).toBeDefined();
    expect(hooks.usePrayerTimes).toBeDefined();
    expect(hooks.useSearch).toBeDefined();
    expect(hooks.useNotifications).toBeDefined();
    expect(hooks.useTheme).toBeDefined();
    expect(hooks.useGeolocation).toBeDefined();
    expect(hooks.useVideos).toBeDefined();
    expect(hooks.useAI).toBeDefined();
    expect(hooks.useOnline).toBeDefined();
    expect(hooks.useDebounce).toBeDefined();
    expect(hooks.useLocalStorage).toBeDefined();
  });
});
