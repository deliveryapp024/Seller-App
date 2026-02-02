import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks';
import { Card, Button } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { mockPayouts, mockEarnings } from '../../data/mockData';
import {
  Download,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';

export const PayoutsScreen: React.FC = () => {
  const { currentColors } = useTheme();

  const availableForWithdrawal = mockPayouts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.netPayout, 0);

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

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          Payouts
        </Text>
        <TouchableOpacity>
          <Download size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Available Balance Card */}
        <Card style={styles.balanceCard}>
          <Text style={[styles.balanceLabel, { color: currentColors.text.secondary }]}>
            Available for Withdrawal
          </Text>
          <Text style={[styles.balanceAmount, { color: currentColors.text.primary }]}>
            ₹{availableForWithdrawal.toLocaleString()}
          </Text>
          <Button
            title="Withdraw to Bank"
            onPress={() => {}}
            style={styles.withdrawButton}
          />
          <Text style={[styles.payoutInfo, { color: currentColors.text.muted }]}>
            Next auto-payout: Tomorrow
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
              ₹{mockEarnings.today.toLocaleString()}
            </Text>
          </Card>
          <Card style={styles.earningCard}>
            <Text style={[styles.earningLabel, { color: currentColors.text.secondary }]}>
              This Week
            </Text>
            <Text style={[styles.earningValue, { color: currentColors.text.primary }]}>
              ₹{mockEarnings.thisWeek.toLocaleString()}
            </Text>
          </Card>
        </View>

        {/* Payout History */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          PAYOUT HISTORY
        </Text>
        {mockPayouts.map((payout) => (
          <Card key={payout.id} style={styles.payoutCard}>
            <View style={styles.payoutHeader}>
              <View>
                <Text style={[styles.payoutCycle, { color: currentColors.text.primary }]}>
                  Cycle #{payout.cycleNumber}
                </Text>
                <Text style={[styles.payoutDate, { color: currentColors.text.muted }]}>
                  {payout.startDate} - {payout.endDate}
                </Text>
              </View>
              <View style={styles.payoutStatus}>
                {getStatusIcon(payout.status)}
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(payout.status) },
                  ]}
                >
                  {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.payoutStats}>
              <View>
                <Text style={[styles.statLabel, { color: currentColors.text.muted }]}>
                  Orders
                </Text>
                <Text style={[styles.statValue, { color: currentColors.text.primary }]}>
                  {payout.totalOrders}
                </Text>
              </View>
              <View>
                <Text style={[styles.statLabel, { color: currentColors.text.muted }]}>
                  Revenue
                </Text>
                <Text style={[styles.statValue, { color: currentColors.text.primary }]}>
                  ₹{payout.totalRevenue.toLocaleString()}
                </Text>
              </View>
              <View>
                <Text style={[styles.statLabel, { color: currentColors.text.muted }]}>
                  Net Payout
                </Text>
                <Text style={[styles.statValue, { color: colors.primary.cyan }]}>
                  ₹{payout.netPayout.toLocaleString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.downloadRow}>
              <Download size={16} color={colors.primary.cyan} />
              <Text style={[styles.downloadText, { color: colors.primary.cyan }]}>
                Download Invoice
              </Text>
              <ChevronRight size={16} color={colors.primary.cyan} />
            </TouchableOpacity>
          </Card>
        ))}

        {/* Fee Breakdown */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          FEE BREAKDOWN
        </Text>
        <Card style={styles.feeCard}>
          <View style={styles.feeRow}>
            <Text style={[styles.feeLabel, { color: currentColors.text.secondary }]}>
              Commission (18%)
            </Text>
            <Text style={[styles.feeValue, { color: currentColors.text.primary }]}>
              ₹9,432
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={[styles.feeLabel, { color: currentColors.text.secondary }]}>
              Delivery Fee
            </Text>
            <Text style={[styles.feeValue, { color: currentColors.text.primary }]}>
              ₹2,250
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={[styles.feeLabel, { color: currentColors.text.secondary }]}>
              Packaging Fee
            </Text>
            <Text style={[styles.feeValue, { color: currentColors.text.primary }]}>
              ₹450
            </Text>
          </View>
          <View style={[styles.feeDivider, { backgroundColor: currentColors.border }]} />
          <View style={styles.feeRow}>
            <Text style={[styles.feeTotalLabel, { color: currentColors.text.primary }]}>
              Net after fees
            </Text>
            <Text style={[styles.feeTotalValue, { color: colors.success }]}>
              ₹40,268
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
  payoutCard: {
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  payoutCycle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.semiBold,
  },
  payoutDate: {
    fontSize: typography.sizes.xs,
    marginTop: spacing[1],
  },
  payoutStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: spacing[1],
  },
  payoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    marginBottom: spacing[1],
  },
  statValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
  },
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  downloadText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: spacing[2],
    marginRight: spacing[1],
  },
  feeCard: {
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  feeLabel: {
    fontSize: typography.sizes.sm,
  },
  feeValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
  },
  feeDivider: {
    height: 1,
    marginVertical: spacing[3],
  },
  feeTotalLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.bold,
  },
  feeTotalValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.bold,
  },
  bottomPadding: {
    height: spacing[10],
  },
});
