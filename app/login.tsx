import { useForm, Controller } from 'react-hook-form';
import { View, TextInput, Text, Pressable, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '../store/AuthStore';

type FormData = { email: string; password: string };

export default function Login() {
  const signIn = useAuthStore((s) => s.signIn);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      Alert.alert('Error', error);
      return;
    }
    router.replace('/(protected)/(tabs)/home');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Iniciar sesión</Text>

      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email requerido' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
          />
        )}
      />
      {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        rules={{ required: 'Contraseña requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Contraseña"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
          />
        )}
      />
      {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={{ backgroundColor: '#111', padding: 14, borderRadius: 8, alignItems: 'center' }}
      >
        <Text style={{ color: 'white' }}>{isSubmitting ? 'Entrando...' : 'Entrar'}</Text>
      </Pressable>

      <Link href="/register">¿No tienes cuenta? Regístrate</Link>
    </View>
  );
}