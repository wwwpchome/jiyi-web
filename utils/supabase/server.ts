import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)?.trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)?.trim();

function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

function validateSupabaseUrl(url: string) {
  if (!/^https?:\/\//i.test(url)) {
    throw new Error(`Invalid environment variable NEXT_PUBLIC_SUPABASE_URL: must start with http:// or https://`);
  }
  return url;
}

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(
    validateSupabaseUrl(requireEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL")),
    requireEnv(supabaseKey, "SUPABASE_SERVICE_ROLE_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
