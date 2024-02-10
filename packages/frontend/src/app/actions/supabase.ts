import { CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NODE_ENV === 'development' ? process.env.LOCAL_DEV_SUPABASE_URL : process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NODE_ENV === 'development' ? process.env.LOCAL_DEV_SUPABASE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Failed to connect to DB. Unable to enter Grant Submission.');
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    auth: { flowType: 'pkce' },
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
};

export { createClient, supabaseKey, supabaseUrl };
