import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Text, Pressable, Alert, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/AuthStore';
import ScreenWrapper from '../components/ScreenWrapper';

type FormData = { email: string; password: string };

export default function Login() {
  const signIn = useAuthStore((s) => s.signIn);
  const [showPassword, setShowPassword] = useState(false);
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
    <ScreenWrapper
      contentStyle={{
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        gap: 12,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Iniciar sesión</Text>

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
            editable={!isSubmitting}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              opacity: isSubmitting ? 0.5 : 1,
            }}
          />
        )}
      />
      {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        rules={{ required: 'Contraseña requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }}
        render={({ field: { onChange, value } }) => (
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="Contraseña"
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              editable={!isSubmitting}
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                paddingRight: 44,
                opacity: isSubmitting ? 0.5 : 1,
              }}
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              disabled={isSubmitting}
              style={{
                position: 'absolute',
                right: 12,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        )}
      />
      {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={{
          backgroundColor: isSubmitting ? '#555' : '#111',
          padding: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white' }}>{isSubmitting ? 'Entrando...' : 'Entrar'}</Text>
      </Pressable>

      <Link
        href="/register"
        style={{ textAlign: 'center', opacity: isSubmitting ? 0.5 : 1 }}
      >
        ¿No tienes cuenta? Regístrate
      </Link>
    </ScreenWrapper>
  );
}