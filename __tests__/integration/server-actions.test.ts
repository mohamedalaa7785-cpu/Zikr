import { describe, it, expect } from '@jest/globals';

describe('Server Actions Exports', () => {
  it('should export all user actions', async () => {
    const actions = await import('lib/actions/user');
    
    expect(actions.updateProfile).toBeDefined();
    expect(actions.uploadAvatar).toBeDefined();
    expect(actions.updateNotificationSettings).toBeDefined();
  });

  it('should export all favorite actions', async () => {
    const actions = await import('lib/actions/favorites');
    
    expect(actions.addFavorite).toBeDefined();
    expect(actions.removeFavorite).toBeDefined();
    expect(actions.clearFavorites).toBeDefined();
  });

  it('should export all reading actions', async () => {
    const actions = await import('lib/actions/reading');
    
    expect(actions.saveReadingProgress).toBeDefined();
    expect(actions.addBookmark).toBeDefined();
    expect(actions.removeBookmark).toBeDefined();
  });

  it('should export all quran actions', async () => {
    const actions = await import('lib/actions/quran');
    
    expect(actions.addToQuranFavorites).toBeDefined();
    expect(actions.removeFromQuranFavorites).toBeDefined();
    expect(actions.recordQuranRead).toBeDefined();
  });

  it('should export all content actions', async () => {
    const actions = await import('lib/actions/content');
    
    expect(actions.addToStoryFavorites).toBeDefined();
    expect(actions.markStoryAsRead).toBeDefined();
    expect(actions.addStoryRating).toBeDefined();
    expect(actions.saveProphetNote).toBeDefined();
  });

  it('should export all notification actions', async () => {
    const actions = await import('lib/actions/notifications');
    
    expect(actions.markNotificationAsRead).toBeDefined();
    expect(actions.deleteNotification).toBeDefined();
    expect(actions.markAllAsRead).toBeDefined();
  });

  it('should export all adhkar actions', async () => {
    const actions = await import('lib/actions/adhkar');
    
    expect(actions.completeAdhkar).toBeDefined();
    expect(actions.trackAdhkarStreak).toBeDefined();
    expect(actions.shareAdhkarCompletion).toBeDefined();
  });

  it('should export all search actions', async () => {
    const actions = await import('lib/actions/search');
    
    expect(actions.saveSearchQuery).toBeDefined();
    expect(actions.clearSearchHistory).toBeDefined();
  });

  it('should export all settings actions', async () => {
    const actions = await import('lib/actions/settings');
    
    expect(actions.updateAppSettings).toBeDefined();
    expect(actions.deleteAccount).toBeDefined();
    expect(actions.exportUserData).toBeDefined();
  });
});
