import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../hooks';
import { Card, Button } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../theme';
import {
  getEarningsSummary,
  getWeeklyEarnings,
  getAvailableBalance,
  formatCurrency,
  formatDateRange,
  calculateChange,
  generateChartData,
} from '../../api/earningsApi';
import { useFocusEffect } from '@react-navigation/native';
import {
  Download,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';

export const PayoutsScreen: React.FC = () => {
  const { currentColors } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [earnings, setEarnings] = useState<{
    today: number;
    yesterday: number;
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    lastMonth: number;
    ordersCount?: {
      today: number;
      thisWeek: number;
      thisMonth: number;
    };
  } | null>(null);
  const [balance, setBalance] = useState<{
    balance: number;
    pendingAmount: number;
  } | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [weekRange, setWeekRange] = useState<string>('');

  const fetchData = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    
    try {
      // Fetch earnings summary
      const summaryResponse = await getEarningsSummary();
      if (summaryResponse.success && summaryResponse.data) {
        setEarnings(summaryResponse.data.summary);
      }

      // Fetch available balance
      const balanceResponse = await getAvailableBalance();
      if (balanceResponse.success && balanceResponse.data) {
        setBalance(balanceResponse.data);
      }

      // Fetch weekly earnings for chart
      const weeklyResponse = await getWeeklyEarnings();
      if (weeklyResponse.success && weeklyResponse.data) {
        const { weekStart, weekEnd, dailyBreakdown } = weeklyResponse.data;
        setWeekRange(formatDateRange(weekStart, weekEnd));
        
        // Generate chart data
        const chartData = dailyBreakdown.map((day: any) => ({
          label: day.day,
          value: day.revenue,
          orders: day.orders,
        }));
        setWeeklyData(chartData);
      }
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      Alert.alert('Error', 'Failed to load earnings data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color={colors.success} />;
      case 'processing':
        return <Clock size={20} color={colors.warning} />;
      case 'pending':
        return <AlertCircle size={20} color={colors.error} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'processing':
        return colors.warning;
      case 'pending':
        return colors.error;
      default:
        return currentColors.text.muted;
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary.cyan} />
        <Text style={[styles.loadingText, { color: currentColors.text.secondary }]}>
          Loading earnings...
        </Text>
      </View>
    );
  }

  const todayChange = earnings 
    ? calculateChange(earnings.today, earnings.yesterday)
    : 0;
  
  const weekChange = earnings
    ? calculateChange(earnings.thisWeek, earnings.lastWeek)
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          Earnings
        </Text>
        <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Statement download will be available soon.')}>
          <Download size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.cyan}
          />
        }
      >
        {/* Available Balance Card */}
        <Card style={styles.balanceCard}>
          <Text style={[styles.balanceLabel, { color: currentColors.text.secondary }]}>
            Available for Withdrawal
          </Text>
          <Text style={[styles.balanceAmount, { color: currentColors.text.primary }]}>
            {formatCurrency(balance?.balance || 0)}
          </Text>
          <Button
            title="Withdraw to Bank"
            onPress={() => Alert.alert('Coming Soon', 'Withdrawal feature will be available soon.')}
            style={styles.withdrawButton}
          />
          <Text style={[styles.payoutInfo, { color: currentColors.text.muted }]}>
            Pending clearance: {formatCurrency(balance?.pendingAmount || 0)}
          </Text>
        </Card>

        {/* Earnings Summary */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          EARNINGS SUMMARY
        </Text>
        <View style={styles.earningsGrid}>
          <Card style={styles.earningCard}>
            <Text style={[styles.earningLabel, { color: currentColors.text.secondary }]}>
              Today
            </Text>
            <Text style={[styles.earningValue, { color: currentColors.text.primary }]}>
              {formatCurrency(earnings?.today || 0)}
            </Text>
            {todayChange !== 0 && (
              <Text style={[styles.changeText, { color: todayChange > 0 ? colors.success : colors.error }]}>
                {todayChange > 0 ? '+' : ''}{todayChange}% vs yesterday
              </Text>
            )}
            <Text style={[styles.ordersText, { color: currentColors.text.muted }]}>
              {earnings?.ordersCount?.today || 0} orders
            </Text>
          </Card>
          <Card style={styles.earningCard}>
            <Text style={[styles.earningLabel, { color: currentColors.text.secondary }]}>
              This Week
            </Text>
            <Text style={[styles.earningValue, { color: currentColors.text.primary }]}>
              {formatCurrency(earnings?.thisWeek || 0)}
            </Text>
            {weekChange !== 0 && (
              <Text style={[styles.changeText, { color: weekChange > 0 ? colors.success : colors.error }]}>
                {weekChange > 0 ? '+' : ''}{weekChange}% vs last week
              </Text>
            )}
            <Text style={[styles.ordersText, { color: currentColors.text.muted }]}>
              {earnings?.ordersCount?.thisWeek || 0} orders
            </Text>
          </Card>
        </View>

        {/* Weekly Chart */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          WEEKLY TREND {weekRange ? `(${weekRange})` : ''}
        </Text>
        <Card style={styles.chartCard}>
          {weeklyData.length > 0 ? (
            <View style={styles.chartContainer}>
              {weeklyData.map((day, index) => {
                const maxValue = Math.max(...weeklyData.map(d => d.value), 1);
                const height = day.value > 0 ? (day.value / maxValue) * 100 : 4;
                
                return (
                  <View key={index} style={styles.chartBarContainer}>
                    <View style={styles.chartBarWrapper}>
                      <View 
                        style={[
                          styles.chartBar, 
                          { 
                            height: `${Math.max(height, 4)}%`,
                            backgroundColor: day.value > 0 ? colors.primary.cyan : currentColors.border,
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.chartLabel, { color: currentColors.text.muted }]}>
                      {day.label}
                    </Text>
                    <Text style={[styles.chartValue, { color: currentColors.text.secondary }]}>
                      {day.value > 0 ? `Rs.${(day.value / 1000).toFixed(1)}k` : '-'}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={[styles.noDataText, { color: currentColors.text.muted }]}>
              No earnings data available for this week
            </Text>
          )}
        </Card>

        {/* This Month Summary */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          THIS MONTH
        </Text>
        <Card style={styles.monthCard}>
          <View style={styles.monthRow}>
            <View>
              <Text style={[styles.monthAmount, { color: currentColors.text.primary }]}>
                {formatCurrency(earnings?.thisMonth || 0)}
              </Text>
              <Text style={[styles.monthOrders, { color: currentColors.text.muted }]}>
                {earnings?.ordersCount?.thisMonth || 0} orders delivered
              </Text>
            </View>
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={[styles.viewDetailsText, { color: colors.primary.cyan }]}>
                View Details
              </Text>
              <ChevronRight size={16} color={colors.primary.cyan} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Fee Breakdown Info */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          FEE INFORMATION
        </Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: currentColors.text.secondary }]}>
              Commission Rate
            </Text>
            <Text style={[styles.infoValue, { color: currentColors.text.primary }]}>
              18%
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: currentColors.text.secondary }]}>
              Packaging Fee
            </Text>
            <Text style={[styles.infoValue, { color: currentColors.text.primary }]}>
              Rs.10 per item
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: currentColors.text.secondary }]}>
              GST on Commission
            </Text>
            <Text style={[styles.infoValue, { color: currentColors.text.primary }]}>
              18%
            </Text>
          </View>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[14],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  scrollContent: {
    padding: spacing[4],
  },
  balanceCard: {
    padding: spacing[6],
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  balanceLabel: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing[2],
  },
  balanceAmount: {
    fontSize: typography.sizes['5xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[5],
  },
  withdrawButton: {
    width: '100%',
  },
  payoutInfo: {
    fontSize: typography.sizes.sm,
    marginTop: spacing[3],
  },
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing[4],
    marginTop: spacing[2],
    letterSpacing: 0.5,
  },
  earningsGrid: {
    flexDirection: 'row',
    marginHorizontal: -spacing[2],
    marginBottom: spacing[5],
  },
  earningCard: {
    flex: 1,
    marginHorizontal: spacing[2],
    padding: spacing[4],
  },
  earningLabel: {
    fontSize: typography.sizes.xs,
    marginBottom: spacing[1],
  },
  earningValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  changeText: {
    fontSize: typography.sizes.xs,
    marginTop: spacing[1],
    fontWeight: typography.fontWeight.medium,
  },
  ordersText: {
    fontSize: typography.sizes.xs,
    marginTop: spacing[1],
  },
  chartCard: {
    padding: spacing[4],
    marginBottom: spacing[5],
    minHeight: 200,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: spacing[4],
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarWrapper: {
    width: '60%',
    height: 120,
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    borderRadius: borderRadius.sm,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: typography.sizes.xs,
    marginTop: spacing[2],
  },
  chartValue: {
    fontSize: typography.sizes.xs,
    marginTop: spacing[0.5],
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: spacing[8],
    fontSize: typography.sizes.sm,
  },
  monthCard: {
    padding: spacing[4],
    marginBottom: spacing[5],
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthAmount: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  monthOrders: {
    fontSize: typography.sizes.sm,
    marginTop: spacing[1],
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
    marginRight: spacing[1],
  },
  infoCard: {
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
  },
  infoValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
  },
  bottomPadding: {
    height: spacing[10],
  },
  loadingText: {
    marginTop: spacing[4],
    fontSize: typography.sizes.md,
  },
});
