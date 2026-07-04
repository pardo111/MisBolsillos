export type Transaction = {
  id: string;
  user_id: string;
  merchant: string;
  amount: number;
  category: number;
  type: 'income' | 'expense';
  created_at: string;
  categories?: { category: string } | null;
};

export type NewTransaction = {
  merchant: string;
  amount: number;
  category: number;
  type: 'income' | 'expense';
};

export type TransactionsState = {
  transactions: Transaction[];
  isLoading: boolean;
  page: number;        // 0-indexed
  totalCount: number;
  filters: TransactionFilters;

  setFilters: (filters: TransactionFilters) => void;
  fetchPage: (page: number) => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  addTransaction: (data: NewTransaction) => Promise<{ error: string | null }>;
  updateTransaction: (id: string, data: Partial<NewTransaction>) => Promise<{ error: string | null }>;
  deleteTransaction: (id: string) => Promise<{ error: string | null }>;
};


export type TransactionFilters = {
  search: string;
  categoryId: number | null;
  type: 'all' | 'income' | 'expense';
  minAmount: string;
  maxAmount: string;
};