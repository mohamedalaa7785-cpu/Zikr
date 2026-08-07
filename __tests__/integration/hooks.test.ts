/**
 * Hooks smoke tests (node:test)
 * Verifies that hooks exported from lib/hooks/ can be imported.
 * Run with: node --test __tests__/integration/hooks.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('Prayer times hook exports', () => {
  it('exports usePrayerTimes', async () => {
    const mod = await import('../../lib/hooks/use-prayer-times.ts');
    assert.equal(typeof mod.usePrayerTimes, 'function');
  });
});

describe('Auth enhanced exports', () => {
  it('exports isTokenExpired', async () => {
    const mod = await import('../../lib/auth-enhanced.ts');
    assert.equal(typeof mod.isTokenExpired, 'function');
  });

  it('exports isTokenValid', async () => {
    const mod = await import('../../lib/auth-enhanced.ts');
    assert.equal(typeof mod.isTokenValid, 'function');
  });

  it('exports extractNextPath', async () => {
    const mod = await import('../../lib/auth-enhanced.ts');
    assert.equal(typeof mod.extractNextPath, 'function');
  });
});
