import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Profile, ProfileState } from '@/types/Profile';
import {showAlert } from '@/utils/alert';


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
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()   // <- clave: pedimos que nos devuelva la fila actualizada
      .single();  // <- si no hubo match, esto genera un error real (PGRST116)

    if (error) {
      return { error: error.message };
    }

    // Solo actualizamos el estado local con lo que la BD confirmó, no con el input crudo
    set({ profile: data });
    return { error: null };
  },
}));