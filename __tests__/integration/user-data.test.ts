import { describe, it, expect } from '@jest/globals';

describe('User Data Integration', () => {
  const userId = 'test-user-123';

  it('should fetch user profile', async () => {
    const response = await fetch('/api/user/profile', {
      headers: { 'Authorization': `Bearer ${userId}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('displayName');
  });

  it('should update user profile', async () => {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userId}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayName: 'Test User',
        locale: 'ar',
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.displayName).toBe('Test User');
  });

  it('should fetch user favorites', async () => {
    const response = await fetch('/api/user/favorites', {
      headers: { 'Authorization': `Bearer ${userId}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should add favorite', async () => {
    const response = await fetch('/api/user/favorites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userId}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemType: 'quran',
        itemRef: '1',
      }),
    });

    expect(response.status).toBe(201);
  });

  it('should remove favorite', async () => {
    const response = await fetch('/api/user/favorites/test-id', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userId}` },
    });

    expect(response.status).toBe(200);
  });
});
