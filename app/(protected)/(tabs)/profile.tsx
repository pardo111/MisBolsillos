// app/(tabs)/perfil.tsx
import { useEffect, useState } from 'react';
import { Text, TextInput, Pressable, Alert, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../../store/AuthStore';
import { useProfileStore } from '../../../store/ProfileStore';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { colors, spacing, radius } from '../../../utils/theme';
import { showAlert } from '../../../utils/alert';

type FormData = { full_name: string; phone: string };

export default function Perfil() {
  const { user, signOut } = useAuthStore();
  const { profile, fetchProfile, updateProfile, isLoading } = useProfileStore();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<FormData>({
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
      showAlert('No se pudo guardar', error);
      return;
    }
    showAlert('Listo', 'Perfil actualizado correctamente');
  };

  const handleSignOut = () => {
    showAlert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: signOut },
    ]);
  };

  if (isLoading && !profile) {
    return (
      <ScreenWrapper edges={['top']} contentStyle={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </ScreenWrapper>
    );
  }

  const initials = (profile?.full_name || user?.email || '?')
    .trim()
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <ScreenWrapper edges={['top']} contentStyle={styles.content}>
      {/* Header con avatar */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.title}>Mi perfil</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Formulario */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Información personal</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre completo</Text>
          <Controller
            control={control}
            name="full_name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Ej. María Pérez"
                placeholderTextColor={colors.textTertiary}
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocusedField('full_name')}
                onBlur={() => setFocusedField(null)}
                maxLength={40}
                style={[
                  styles.input,
                  focusedField === 'full_name' && styles.inputFocused,
                ]}
              />
            )}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Teléfono</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Ej. 7777-8888"
                placeholderTextColor={colors.textTertiary}
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                keyboardType="phone-pad"
                maxLength={20}
                style={[
                  styles.input,
                  focusedField === 'phone' && styles.inputFocused,
                ]}
              />
            )}
          />
        </View>

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isDirty}
          style={({ pressed }) => [
            styles.saveButton,
            (!isDirty || isSubmitting) && styles.saveButtonDisabled,
            pressed && isDirty && styles.saveButtonPressed,
          ]}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </Pressable>
      </View>

      {/* Zona de cuenta */}
      <View style={styles.card}>
        <Pressable onPress={handleSignOut} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 12,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceAlt,
  },
  inputFocused: {
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  saveButton: {
    backgroundColor: colors.textPrimary,
    padding: 14,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonDisabled: {
    backgroundColor: colors.border,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  signOutRow: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  signOutText: {
    backgroundColor: colors.textPrimary,
    color: colors.expense,
    fontWeight: '600',
    fontSize: 14,
  },
});