import { supabase } from './config.js';

// ── Sign Up ─────────────────────────────────────────────────
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });
  if (error) throw error;

  // Create profile row
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      email
    });
  }
  return data;
}

// ── Sign In ─────────────────────────────────────────────────
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// ── Sign Out ─────────────────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/index.html';
}

// ── Get current user ─────────────────────────────────────────
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ── Listen to auth changes ────────────────────────────────────
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
