import { handleOptions, jsonResponse } from '../_shared/cors.ts';

Deno.serve((request) => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  if (request.method !== 'GET') {
    return jsonResponse(request, { error: 'Method not allowed' }, { status: 405 });
  }

  return jsonResponse(request, {
    status: 'ok',
    service: 'zikr-edge-functions',
    timestamp: new Date().toISOString(),
  });
});
