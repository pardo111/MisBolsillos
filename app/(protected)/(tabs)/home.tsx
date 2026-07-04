import { useAuthStore } from '../../../store/AuthStore';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { useFinanceStore } from '@/store/HomeStore';
import { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { SummaryCard } from '@/components/SummaryCards';
import { TopCategoryRow } from '@/components/TopCategoryRow';
import { colors, spacing, radius } from '../../../utils/theme';



export default function Home() {
  const { user, signOut } = useAuthStore();
  const { summary, topCategories, isLoading, error, fetchFinanceData } = useFinanceStore();

  useEffect(() => {
    if (user?.id) fetchFinanceData(user.id);
  }, [user?.id]);

  if (isLoading && !summary) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  const isPositive = (summary?.balance ?? 0) >= 0;
  const maxCategoryAmount = topCategories[0]?.total_spent ?? 0;


  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper edges={['top']} contentStyle={{ padding: 24, gap: 12 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => user?.id && fetchFinanceData(user.id)}
            tintColor={colors.accent}
          />
        }
      >
        <Text style={styles.greeting}>Resumen financiero</Text>

        {/* Balance — tarjeta principal con el acento de marca, no rojo/verde */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance total</Text>
          <Text style={styles.balanceAmount}>
            ${summary?.balance.toLocaleString('es-SV', { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.balanceTag}>
            <View
              style={[
                styles.balanceDot,
                { backgroundColor: isPositive ? colors.income : colors.expense },
              ]}
            />
            <Text style={styles.balanceTagText}>
              {isPositive ? 'Balance positivo' : 'Balance negativo'}
            </Text>
          </View>
        </View>

        {/* Ingresos y gastos lado a lado */}
        <View style={styles.row}>
          <SummaryCard label="Ingresos" amount={summary?.total_income ?? 0} icon="arrow-up" variant="income" />
          <View style={{ width: spacing.sm }} />
          <SummaryCard label="Gastos" amount={summary?.total_expense ?? 0} icon="arrow-down" variant="expense" />
        </View>

        {/* Top categorías */}
        <Text style={styles.sectionTitle}>Categorías con más gasto</Text>
        <View style={styles.categoriesCard}>
          {topCategories.length === 0 ? (
            <Text style={styles.emptyText}>Aún no hay gastos registrados</Text>
          ) : (
            topCategories.map((cat, index) => (
              <TopCategoryRow
                key={cat.category_id}
                rank={index + 1}
                name={cat.category_name}
                amount={cat.total_spent}
                maxAmount={maxCategoryAmount}
              />
            ))
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.expense,
    fontSize: 14,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  balanceCard: {
    backgroundColor: colors.textPrimary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  balanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  balanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  balanceTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  categoriesCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});