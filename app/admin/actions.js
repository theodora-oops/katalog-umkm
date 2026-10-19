"use server";

import { redirect } from "next/navigation";
import { buatSupabaseAuth } from "@/lib/supabase";

export async function login(_prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await buatSupabaseAuth();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Kembalikan pesan error agar ditampilkan di halaman login.
    return { error: "Email atau password salah. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function keluar() {
  const supabase = await buatSupabaseAuth();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

