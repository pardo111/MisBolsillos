import { useEffect, useState } from 'react';
import { View, TextInput, Text, Pressable, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDebouncedCallback } from 'use-debounce';
import { Category } from '@/types/Category';
import { TransactionFilters as Filters } from '@/types/Transaction';

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  categories: Category[];
};

export default function TransactionFilters({ filters, onChange, categories }: Props) {
  const [searchText, setSearchText] = useState(filters.search);

  const debouncedSearch = useDebouncedCallback((text: string) => {
    onChange({ ...filters, search: text });
  }, 400);

  useEffect(() => {
    debouncedSearch(searchText);
  }, [searchText]);

  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <View style={{ gap: 8, marginBottom: 12 }}>
      <TextInput
        placeholder="Buscar por comercio..."
        value={searchText}
        onChangeText={setSearchText}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, backgroundColor: 'white' }}
      />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={() => update({ type: 'all' })}
          style={{ flex: 1, padding: 8, borderRadius: 8, alignItems: 'center', backgroundColor: filters.type === 'all' ? 'rgb(33, 34, 41)' : '#eee' }}
        >
          <Text style={{ color: filters.type === 'all' ? 'white' : '#333' }}>Todos</Text>
        </Pressable>
        <Pressable
          onPress={() => update({ type: 'income' })}
          style={{ flex: 1, padding: 8, borderRadius: 8, alignItems: 'center', backgroundColor: filters.type === 'income' ? '#27ae60' : '#eee' }}
        >
          <Text style={{ color: filters.type === 'income' ? 'white' : '#333' }}>Ingresos</Text>
        </Pressable>
        <Pressable
          onPress={() => update({ type: 'expense' })}
          style={{ flex: 1, padding: 8, borderRadius: 8, alignItems: 'center', backgroundColor: filters.type === 'expense' ? '#c0392b' : '#eee' }}
        >
          <Text style={{ color: filters.type === 'expense' ? 'white' : '#333' }}>Gastos</Text>
        </Pressable>
      </View>

      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: 'white', overflow: 'hidden', height: 48, justifyContent: 'center' }}>
        <Picker
          selectedValue={filters.categoryId ?? ''}
          onValueChange={(v) => update({ categoryId: v === '' ? null : Number(v) })}
          style={Platform.OS === 'web' ? { height: 60,   } : { height: 60 }}
        >
          <Picker.Item label="Todas las categorías" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.category} value={cat.id} />
          ))}
        </Picker>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          placeholder="Monto mínimo"
          value={filters.minAmount}
          onChangeText={(text) => update({ minAmount: text.replace(/[^0-9.]/g, '') })}
          keyboardType="decimal-pad"
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, backgroundColor: 'white' }}
        />
        <TextInput
          placeholder="Monto máximo"
          value={filters.maxAmount}
          onChangeText={(text) => update({ maxAmount: text.replace(/[^0-9.]/g, '') })}
          keyboardType="decimal-pad"
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, backgroundColor: 'white' }}
        />
      </View>
    </View>
  );
}