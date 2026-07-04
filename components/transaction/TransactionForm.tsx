import { useForm, Controller } from 'react-hook-form';
import { View, TextInput, Text, Pressable, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect } from 'react';
import { Transaction, NewTransaction } from '@/types/Transaction';
import { useCategoriesStore } from '@/store/CategoriesStore';

type FormData = {
  merchant: string;
  amount: string;
  category: number | null;
  type: 'income' | 'expense';
};

type Props = {
  initialValues?: Transaction;
  onSubmit: (data: NewTransaction) => void;
  onCancel: () => void;
  isSubmitting: boolean;
};

export default function TransactionForm({ initialValues, onSubmit, onCancel, isSubmitting }: Props) {
  const { categories, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      merchant: initialValues?.merchant ?? '',
      amount: initialValues ? String(initialValues.amount) : '',
      category: initialValues?.category ?? null,
      type: initialValues?.type ?? 'expense',
    },
  });

  const type = watch('type');
  const selectedCategory = watch('category');

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setValue('category', categories[0].id);
    }
  }, [categories]);

  const submit = (data: FormData) => {
    if (!data.category) return;
    onSubmit({
      merchant: data.merchant,
      amount: parseFloat(data.amount),
      category: data.category,
      type: data.type,
    });
  };

  return (
    <View style={{ gap: 10, padding: 16, backgroundColor: '#f2f2f2', borderRadius: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={() => setValue('type', 'expense')}
          disabled={isSubmitting}
          style={{
            flex: 1, padding: 10, borderRadius: 8, alignItems: 'center',
            backgroundColor: type === 'expense' ? '#c0392b' : '#ddd',
            opacity: isSubmitting ? 0.5 : 1,
          }}
        >
          <Text style={{ color: type === 'expense' ? 'white' : '#333' }}>Gasto</Text>
        </Pressable>
        <Pressable
          onPress={() => setValue('type', 'income')}
          disabled={isSubmitting}
          style={{
            flex: 1, padding: 10, borderRadius: 8, alignItems: 'center',
            backgroundColor: type === 'income' ? '#27ae60' : '#ddd',
            opacity: isSubmitting ? 0.5 : 1,
          }}
        >
          <Text style={{ color: type === 'income' ? 'white' : '#333' }}>Ingreso</Text>
        </Pressable>
      </View>

      <Controller
        control={control}
        name="merchant"
        rules={{ required: 'Requerido' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Comercio / descripción"
            value={value}
            onChangeText={onChange}
            editable={!isSubmitting}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              backgroundColor: 'white',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          />
        )}
      />
      {errors.merchant && <Text style={{ color: 'red' }}>{errors.merchant.message}</Text>}

      <Controller
        control={control}
        name="amount"
        rules={{
          required: 'Requerido',
          pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Solo números' },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Monto"
            value={value}
            onChangeText={(text) => onChange(text.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
            editable={!isSubmitting}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              backgroundColor: 'white',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          />
        )}
      />
      {errors.amount && <Text style={{ color: 'red' }}>{errors.amount.message}</Text>}

      <Controller
        control={control}
        name="category"
        rules={{ required: 'Selecciona una categoría' }}
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: errors.category ? '#e74c3c' : '#d6d6d6',
              borderRadius: 8,
              backgroundColor: 'white',
              overflow: 'hidden',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          >
            <Picker
              selectedValue={value}
              onValueChange={(v) => onChange(v)}
              enabled={!isSubmitting}
              dropdownIconColor="#666"
              style={{
                height: 50,
                color: '#222',
                paddingHorizontal: 12,
              }}
              itemStyle={
                Platform.OS === 'ios'
                  ? {
                    height: 120,
                    fontSize: 16,
                  }
                  : undefined
              }
            >
              {categories.map((cat) => (
                <Picker.Item
                  key={cat.id}
                  label={cat.category}
                  value={cat.id}
                />
              ))}
            </Picker>
          </View>
        )}
      />
      {errors.category && <Text style={{ color: 'red' }}>{errors.category.message}</Text>}

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={onCancel}
          disabled={isSubmitting}
          style={{
            flex: 1, padding: 12, borderRadius: 8, alignItems: 'center',
            backgroundColor: '#ddd',
            opacity: isSubmitting ? 0.5 : 1,
          }}
        >
          <Text>Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit(submit)}
          disabled={isSubmitting}
          style={{
            flex: 1, padding: 12, borderRadius: 8, alignItems: 'center',
            backgroundColor: 'rgb(33, 34, 41)',
          }}
        >
          <Text style={{ color: 'white' }}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Text>
        </Pressable>
      </View>
    </View>
  );
}