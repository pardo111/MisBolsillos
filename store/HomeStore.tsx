// store/useFinanceStore.ts
import { create } from 'zustand';
import { supabase } from '../lib/supabase'; // tu cliente ya configurado
import type { FinancialSummary, TopCategory } from '@/types/Home';

type FinanceState = {
  summary: FinancialSummary | null;
  topCategories: TopCategory[];
  isLoading: boolean;
  error: string | null;
  fetchFinanceData: (userId: string) => Promise<void>;
  reset: () => void;
};

export const useFinanceStore = create<FinanceState>((set) => ({
  summary: null,
  topCategories: [],
  isLoading: false,
  error: null,

  fetchFinanceData: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const [summaryRes, categoriesRes] = await Promise.all([
        supabase.rpc('get_financial_summary', { p_user_id: userId }),
        supabase.rpc('get_top_expense_categories', {
          p_user_id: userId,
          p_limit: 3,
        }),
      ]);

      if (summaryRes.error) throw summaryRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      set({
        summary: summaryRes.data?.[0] ?? {
          total_income: 0,
          total_expense: 0,
          balance: 0,
        },
        topCategories: categoriesRes.data ?? [],
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message ?? 'Error al obtener los datos financieros', isLoading: false });
    }
  },

  reset: () => set({ summary: null, topCategories: [], isLoading: false, error: null }),
}));