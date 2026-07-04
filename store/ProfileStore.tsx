// store/ProfileStore.ts
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Profile, ProfileState } from '@/types/Profile';
import { showAlert } from '@/utils/alert';

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, profile: null }); // <- limpia antes de traer los nuevos datos
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      set({ profile: data });
    } else if (error) {
      set({ profile: null }); // <- si falla, no dejamos datos de otro usuario colgados
    }
    set({ isLoading: false });
  },

  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    set({ profile: data });
    return { error: null };
  },

  clearProfile: () => set({ profile: null, isLoading: false }), 
}));