import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

type ProfileState = {
  profile: Profile | null;
  isLoading: boolean;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<Profile>) => Promise<{ error: string | null }>;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      set({ profile: data });
    }
    set({ isLoading: false });
  },

  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (!error) {
      set((state) => ({ profile: state.profile ? { ...state.profile, ...updates } : state.profile }));
    }
    return { error: error ? error.message : null };
  },
}));