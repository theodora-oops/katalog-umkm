import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

/**
 * Klien Supabase berbasis sesi admin (cookie).
 * Dipakai untuk login, logout, ganti password, dan aksi yang butuh autentikasi.
 * Memakai SUPABASE_PUBLISHABLE_KEY agar RLS tetap berlaku.
 */
export async function buatSupabaseAuth() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll dipanggil dari Server Component — abaikan error ini.
          }
        },
      },
    }
  );
}

