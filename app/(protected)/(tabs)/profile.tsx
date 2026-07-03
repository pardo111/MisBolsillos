import { useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../../store/AuthStore';
import { useProfileStore } from '../../../store/ProfileStore';

type FormData = { full_name: string; phone: string };

export default function Perfil() {
  const { user } = useAuthStore();
  const { profile, fetchProfile, updateProfile, isLoading } = useProfileStore();

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: { full_name: '', phone: '' },
  });

  useEffect(() => {
    if (user) fetchProfile(user.id);
  }, [user]);

  useEffect(() => {
    if (profile) {
      reset({ full_name: profile.full_name ?? '', phone: profile.phone ?? '' });
    }
  }, [profile]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    const { error } = await updateProfile(user.id, data);
    if (error) {
      Alert.alert('Error', error);
      return;
    }
    Alert.alert('Listo', 'Perfil actualizado');
  };

  if (isLoading) return <Text style={{ padding: 24 }}>Cargando...</Text>;

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Mi perfil</Text>
      <Text style={{ color: '#666' }}>{user?.email}</Text>

      <Controller
        control={control}
        name="full_name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Nombre completo"
            value={value}
            onChangeText={onChange}
            style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Teléfono"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
          />
        )}
      />

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={{ backgroundColor: '#111', padding: 14, borderRadius: 8, alignItems: 'center' }}
      >
        <Text style={{ color: 'white' }}>{isSubmitting ? 'Guardando...' : 'Guardar cambios'}</Text>
      </Pressable>
    </View>
  );
}