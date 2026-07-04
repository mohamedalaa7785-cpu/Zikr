import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Auth Integration', () => {
  beforeEach(() => {
    // Reset state before each test
  });

  it('should successfully authenticate user', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    expect(response.status).toBe(200);
  });

  it('should reject invalid credentials', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    });

    expect(response.status).toBe(401);
  });

  it('should require email and password', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
  });
});
