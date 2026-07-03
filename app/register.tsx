import { useForm, Controller } from 'react-hook-form';
import { ScrollView, TextInput, Text, Pressable, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '../store/AuthStore';

type FormData = { phone: string, fullName: string; email: string; password: string; confirmPassword: string };

export default function Register() {
    const signUp = useAuthStore((s) => s.signUp);

    const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: { phone: '', email: '', password: '', confirmPassword: '', fullName: '' },
    });

    const onSubmit = async (data: FormData) => {
        const { error } = await signUp(data.email, data.password, data.fullName, data.phone);
        if (error) {
            Alert.alert('Error al registrar', error);
            return;
        }

    };



    return (
        <ScrollView style={{ flex: 1 }}
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                padding: 24,
                gap: 12,
            }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Crear cuenta</Text>
            <Controller
                control={control}
                name="fullName"
                rules={{ required: 'Nombre requerido' }}
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
                rules={{ required: 'Teléfono requerido' }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Teléfono"
                        value={value}
                        onChangeText={onChange}
                        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
                    />
                )}
            />
            {errors.phone && <Text style={{ color: 'red' }}>{errors.phone.message}</Text>}
            <Controller
                control={control}
                name="email"
                rules={{
                    required: 'Email requerido',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email inválido' },
                }}
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

            <Controller
                control={control}
                name="confirmPassword"
                rules={{
                    required: 'Confirma tu contraseña',
                    validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
                }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Confirmar contraseña"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry
                        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
                    />
                )}
            />
            {errors.confirmPassword && <Text style={{ color: 'red' }}>{errors.confirmPassword.message}</Text>}

            <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                style={{ backgroundColor: '#111', padding: 14, borderRadius: 8, alignItems: 'center' }}
            >
                <Text style={{ color: 'white' }}>{isSubmitting ? 'Creando cuenta...' : 'Registrarme'}</Text>
            </Pressable>

            <Link href="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </ScrollView>
    );
}   