const publicRequired = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'] as const;
const serverRequired = [...publicRequired, 'SUPABASE_SERVICE_ROLE_KEY', 'DATABASE_URL'] as const;

function read(keys: readonly string[]) {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length) {
    // In production, we might not want to throw immediately during build if vars are provided by Vercel dashboard
    if (process.env.NODE_ENV === 'production') {
      console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
    } else {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}

export function getPublicEnv() {
  read(publicRequired);
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}

export function getServerEnv() {
  read(serverRequired);
  return {
    ...getPublicEnv(),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    DATABASE_URL: process.env.DATABASE_URL!,
  };
}
