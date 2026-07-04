// components/SummaryCard.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../utils/theme';

type Props = {
  label: string;
  amount: number;
  icon: keyof typeof Ionicons.glyphMap;
  variant: 'income' | 'expense';
};

export function SummaryCard({ label, amount, icon, variant }: Props) {
  const accent = variant === 'income' ? colors.income : colors.expense;
  const soft = variant === 'income' ? colors.incomeSoft : colors.expenseSoft;

  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: soft }]}>
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.amount}>
          ${amount.toLocaleString('es-SV', { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
});