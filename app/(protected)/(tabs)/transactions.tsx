import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useTransactionsStore} from '@/store/TransactionsStore';
import { useCategoriesStore } from '@/store/CategoriesStore';
import TransactionForm from '@/components/transaction/TransactionForm';
import TransactionFilters from '@/components/transaction/TransactionsFilter';
import type { Transaction, NewTransaction } from '@/types/Transaction';

const PAGE_SIZE = 5;

export default function Transacciones() {
  const {
    transactions, isLoading, page, totalCount, filters,
    setFilters, fetchPage, nextPage, prevPage,
    addTransaction, updateTransaction, deleteTransaction,
  } = useTransactionsStore();
  const { categories, fetchCategories } = useCategoriesStore();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPage(0);
    fetchCategories();
  }, []);

  const handleSubmit = async (data: NewTransaction) => {
    setSubmitting(true);
    const result = editing
      ? await updateTransaction(editing.id, data)
      : await addTransaction(data);
    setSubmitting(false);

    if (result.error) {
      Alert.alert('Error', result.error);
      return;
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar', '¿Seguro que quieres eliminar esta transacción?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const { error } = await deleteTransaction(id);
          if (error) Alert.alert('Error', error);
        },
      },
    ]);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Transacciones</Text>
      <Text style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>
        {totalCount} resultado{totalCount === 1 ? '' : 's'}
      </Text>

      {showForm ? (
        <TransactionForm
          initialValues={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          isSubmitting={submitting}
        />
      ) : (
        <>
          <Pressable
            onPress={() => setShowForm(true)}
            style={{ backgroundColor: 'rgb(33, 34, 41)', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 }}
          >
            <Text style={{ color: 'white' }}>+ Nueva transacción</Text>
          </Pressable>

          <TransactionFilters filters={filters} onChange={setFilters} categories={categories} />
        </>
      )}

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={() => fetchPage(page)}
        style={{ flex: 1 }}
        contentContainerStyle={{ gap: 8, paddingTop: 4, flexGrow: 1 }}
        renderItem={({ item }) => (
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            padding: 12, borderRadius: 8, backgroundColor: '#f9f9f9',
          }}>
            <View>
              <Text style={{ fontWeight: '600' }}>{item.merchant}</Text>
              <Text style={{ color: '#888', fontSize: 12 }}>{item.categories?.category ?? 'Sin categoría'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ color: item.type === 'income' ? '#27ae60' : '#c0392b', fontWeight: '600' }}>
                {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
              </Text>
              <Pressable onPress={() => { setEditing(item); setShowForm(true); }}>
                <Text>Editar</Text>
              </Pressable>
              <Pressable onPress={() => handleDelete(item.id)}>
                <Text>Borrar</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={{ textAlign: 'center', color: '#999', marginTop: 24 }}>
              Ninguna transacción coincide
            </Text>
          ) : null
        }
      />

      {/* Controles de paginación */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12 }}>
        <Pressable
          onPress={prevPage}
          disabled={page === 0 || isLoading}
          style={{
            paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8,
            backgroundColor: page === 0 ? '#eee' : 'rgb(33, 34, 41)',
          }}
        >
          <Text style={{ color: page === 0 ? '#999' : 'white' }}>‹ Anterior</Text>
        </Pressable>

        <Text style={{ color: '#666' }}>
          Página {page + 1} de {totalPages}
        </Text>

        <Pressable
          onPress={nextPage}
          disabled={page + 1 >= totalPages || isLoading}
          style={{
            paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8,
            backgroundColor: page + 1 >= totalPages ? '#eee' : 'rgb(33, 34, 41)',
          }}
        >
          <Text style={{ color: page + 1 >= totalPages ? '#999' : 'white' }}>Siguiente ›</Text>
        </Pressable>
      </View>
    </View>
  );
}