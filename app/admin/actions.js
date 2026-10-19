"use server";

import { redirect } from "next/navigation";
import { buatSupabaseAuth } from "@/lib/supabase";

/**
 * Memastikan ada sesi admin yang aktif.
 * Melempar Error bila belum login, sehingga aksi yang mengubah data
 * tidak bisa dijalankan oleh orang yang tidak berwenang.
 */
async function periksaLogin() {
  const supabase = await buatSupabaseAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Tidak terautentikasi.");
  }

  return { supabase, user };
}

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

export async function gantiPassword(_prevState, formData) {
  // Wajib: periksa login sebelum mengubah data (aturan keamanan no. 3)
  await periksaLogin();

  const passwordBaru = formData.get("password_baru");
  const konfirmasi = formData.get("konfirmasi_password");

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasi) {
    return { error: "Password baru dan konfirmasi tidak sama." };
  }

  const supabase = await buatSupabaseAuth();
  const { error } = await supabase.auth.updateUser({ password: passwordBaru });

  if (error) {
    return { error: "Gagal mengganti password. Silakan coba lagi." };
  }

  return { berhasil: "Password berhasil diganti." };
}
