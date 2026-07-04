import { describe, it, expect } from '@jest/globals';

describe('Content APIs Integration', () => {
  it('should fetch quran surahs', async () => {
    const response = await fetch('/api/quran/surahs');

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should fetch hadith books', async () => {
    const response = await fetch('/api/hadith/books');

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should fetch duas', async () => {
    const response = await fetch('/api/duas');

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should fetch dua categories', async () => {
    const response = await fetch('/api/duas/categories');

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should fetch stories', async () => {
    const response = await fetch('/api/content/stories');

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should fetch prophets', async () => {
    const response = await fetch('/api/content/prophets');

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should fetch companions', async () => {
    const response = await fetch('/api/content/companions');

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should fetch articles', async () => {
    const response = await fetch('/api/content/articles');

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should perform unified search', async () => {
    const response = await fetch('/api/search?q=test');

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should return empty array for empty search', async () => {
    const response = await fetch('/api/search?q=');

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
