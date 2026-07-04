import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, TextInput, Text, Pressable, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/AuthStore';
import { showAlert } from '@/utils/alert';
import ScreenWrapper from '../components/ScreenWrapper';

type FormData = { phone: string; fullName: string; email: string; password: string; confirmPassword: string };

// Detecta emojis y símbolos pictográficos (para bloquearlos en contraseñas, donde sí se permiten otros símbolos), recordando malas experiencias
const EMOJI_REGEX = /[\p{Extended_Pictographic}\u200d]/u;

// Email estricto: solo caracteres ASCII válidos, sin emojis ni espacios
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Register() {
    const signUp = useAuthStore((s) => s.signUp);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: { phone: '', email: '', password: '', confirmPassword: '', fullName: '' },
    });

    const onSubmit = async (data: FormData) => {
        const { error } = await signUp(data.email, data.password, data.fullName, data.phone);
        if (error) {
            showAlert('Error al registrar', error);
            return;
        }
        showAlert('Cuenta creada', 'Revisa tu correo para confirmar tu cuenta', [
            { text: 'OK', onPress: () => router.replace('/login') },
        ]);
    };

    return (
        <ScreenWrapper edges={['top']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        padding: 24,
                        gap: 12,
                    }}
                >
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Crear cuenta</Text>

                    <Controller
                        control={control}
                        name="fullName"
                        rules={{ required: 'Nombre requerido' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Nombre completo"
                                value={value}
                                // Solo letras (con acentos/ñ) y espacios; bloquea números, símbolos y emojis
                                onChangeText={(text) => onChange(text.replace(/[^A-Za-zÀ-ÿñÑ\s]/g, ''))}
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
                    {errors.fullName && <Text style={{ color: 'red' }}>{errors.fullName.message}</Text>}

                    <Controller
                        control={control}
                        name="phone"
                        rules={{ required: 'Teléfono requerido' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Teléfono"
                                value={value}
                                // Solo dígitos; bloquea letras, símbolos y emojis
                                onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                                editable={!isSubmitting}
                                keyboardType="phone-pad"
                                style={{
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    padding: 12,
                                    opacity: isSubmitting ? 0.5 : 1,
                                }}
                            />
                        )}
                    />
                    {errors.phone && <Text style={{ color: 'red' }}>{errors.phone.message}</Text>}

                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: 'Email requerido',
                            pattern: { value: EMAIL_REGEX, message: 'Email inválido' },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Email"
                                value={value}
                                // Bloquea espacios y emojis directamente al escribir; el resto lo valida el pattern
                                onChangeText={(text) => onChange(text.replace(/\s/g, '').replace(EMOJI_REGEX, ''))}
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
                        rules={{
                            required: 'Contraseña requerida',
                            minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                            validate: (value) => !EMOJI_REGEX.test(value) || 'No se permiten emojis',
                        }}
                        render={({ field: { onChange, value } }) => (
                            <View style={{ position: 'relative' }}>
                                <TextInput
                                    placeholder="Contraseña"
                                    value={value}
                                    onChangeText={(text) => onChange(text.replace(EMOJI_REGEX, ''))}
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

                    <Controller
                        control={control}
                        name="confirmPassword"
                        rules={{
                            required: 'Confirma tu contraseña',
                            validate: (value) => {
                                if (EMOJI_REGEX.test(value)) return 'No se permiten emojis';
                                return value === watch('password') || 'Las contraseñas no coinciden';
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <View style={{ position: 'relative' }}>
                                <TextInput
                                    placeholder="Confirmar contraseña"
                                    value={value}
                                    onChangeText={(text) => onChange(text.replace(EMOJI_REGEX, ''))}
                                    secureTextEntry={!showConfirmPassword}
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
                                    onPress={() => setShowConfirmPassword((prev) => !prev)}
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
                                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color="#666"
                                    />
                                </Pressable>
                            </View>
                        )}
                    />
                    {errors.confirmPassword && <Text style={{ color: 'red' }}>{errors.confirmPassword.message}</Text>}

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
                        <Text style={{ color: 'white' }}>{isSubmitting ? 'Creando cuenta...' : 'Registrarme'}</Text>
                    </Pressable>

                    <Link
                        href="/login"
                        style={{ textAlign: 'center', opacity: isSubmitting ? 0.5 : 1 }}
                    >
                        ¿Ya tienes cuenta? Inicia sesión
                    </Link>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}