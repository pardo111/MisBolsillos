import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './AuthStore';
import { useFinanceStore } from './HomeStore';

import type { Transaction, TransactionFilters, TransactionsState } from '@/types/Transaction';

const PAGE_SIZE = 5;
const SELECT_WITH_CATEGORY = '*, categories(category)';

function applyFilters(query: any, filters: TransactionFilters) {
  if (filters.search.trim() !== '') {
    query = query.ilike('merchant', `%${filters.search.trim()}%`);
  }
  if (filters.categoryId !== null) {
    query = query.eq('category', filters.categoryId);
  }
  if (filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }
  if (filters.minAmount) {
    query = query.gte('amount', parseFloat(filters.minAmount));
  }
  if (filters.maxAmount) {
    query = query.lte('amount', parseFloat(filters.maxAmount));
  }
  return query;
}

// Refresca el resumen financiero (Home) tras cualquier cambio en transacciones.
// No bloquea el flujo si falla: es una actualización "en segundo plano".
function refreshFinanceSummary() {
  const userId = useAuthStore.getState().user?.id;
  if (userId) {
    useFinanceStore.getState().fetchFinanceData(userId);
  }
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  isLoading: false,
  page: 0,
  totalCount: 0,
  filters: {
    search: '',
    categoryId: null,
    type: 'all',
    minAmount: '',
    maxAmount: '',
  },

  setFilters: (filters) => {
    set({ filters });
    get().fetchPage(0);
  },

  fetchPage: async (page) => {
    set({ isLoading: true });

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('transactions')
      .select(SELECT_WITH_CATEGORY, { count: 'exact' });
    query = applyFilters(query, get().filters);
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error cargando transacciones:', error.message);
    } else {
      set({
        transactions: (data as Transaction[]) ?? [],
        totalCount: count ?? 0,
        page,
      });
    }
    set({ isLoading: false });
  },

  nextPage: () => {
    const { page, totalCount } = get();
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    if (page + 1 < totalPages) {
      get().fetchPage(page + 1);
    }
  },

  prevPage: () => {
    const { page } = get();
    if (page > 0) {
      get().fetchPage(page - 1);
    }
  },

  addTransaction: async (data) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return { error: 'No hay sesión activa' };

    const { error } = await supabase.from('transactions').insert({ ...data, user_id: userId });
    if (error) return { error: error.message };

    await get().fetchPage(0);
    refreshFinanceSummary(); // <- actualiza el resumen tras insertar
    return { error: null };
  },

  updateTransaction: async (id, data) => {
    const { error } = await supabase.from('transactions').update(data).eq('id', id);
    if (error) return { error: error.message };

    await get().fetchPage(get().page);
    refreshFinanceSummary(); // <- actualiza el resumen tras editar
    return { error: null };
  },

  deleteTransaction: async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) return { error: error.message };

    const { page, transactions } = get();
    if (transactions.length === 1 && page > 0) {
      await get().fetchPage(page - 1);
    } else {
      await get().fetchPage(page);
    }
    refreshFinanceSummary(); // <- actualiza el resumen tras borrar
    return { error: null };
  },
}));