// store/AuthStore.ts
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState } from '../types/Auth';
import { useProfileStore } from './ProfileStore';

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: false,
  isReady: false,
  connectionMessage: '',

  init: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error obteniendo sesión:', error.message);
    }

    set({ session, user: session?.user ?? null, isReady: true });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ isLoading: false });
    return { error: error ? error.message : null };
  },

  signUp: async (email: string, password: string, fullName: string, phone: string) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });
    set({ isLoading: false });
    return { error: error ? error.message : null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    useProfileStore.getState().clearProfile(); 
  },
}));