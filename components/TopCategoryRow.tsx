// components/TopCategoryRow.tsx
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../utils/theme';

type Props = {
  rank: number;
  name: string;
  amount: number;
  maxAmount: number;
};

export function TopCategoryRow({ rank, name, amount, maxAmount }: Props) {
  const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
  const color = colors.categoryColors[rank - 1] ?? colors.textTertiary;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.amount}>
          ${amount.toLocaleString('es-SV', { minimumFractionDigits: 2 })}
        </Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  barBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginLeft: 18,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});