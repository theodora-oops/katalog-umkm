import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase untuk dipakai di sisi server saja
 * (Server Component, Server Action, Route Handler).
 * Jangan import file ini dari komponen "use client".
 */
export function buatSupabaseServer() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  );
}

