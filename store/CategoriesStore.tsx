import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { CategoriesState } from '@/types/Category';


export const useCategoriesStore = create<CategoriesState>((set) => ({
    categories: [],
    isLoading: false,

    fetchCategories: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase
            .from('categories')
            .select('*');

        if (error) {
            console.error('Error cargando categorías:', error.message, error.code, error.details);
        }
        console.log("pedi cate", data);
        if (!error && data) {
            set({ categories: data });
        }
        set({ isLoading: false });
    },
}));
