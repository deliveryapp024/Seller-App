import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks';
import { Card, Button, Toggle, MetricCard, LineChart } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { mockUser, mockEarnings, mockPerformance, dailyGoal } from '../../data/mockData';
import {
  Bell,
  ChevronRight,
  TrendingUp,
  Tag,
  Megaphone,
  Star,
  FileText,
  Settings,
  HelpCircle,
} from 'lucide-react-native';

export const HomeScreen: React.FC = () => {
  const { currentColors, isDark } = useTheme();
  const [isOnline, setIsOnline] = React.useState(mockUser.isOnline);

  const quickActions = [
    { icon: Tag, label: 'Discounts', color: colors.primary.cyan },
    { icon: Megaphone, label: 'Ads', color: colors.warning },
    { icon: Star, label: 'Reviews', color: colors.success },
    { icon: FileText, label: 'Reports', color: colors.info },
    { icon: Settings, label: 'Settings', color: currentColors.text.secondary },
    { icon: HelpCircle, label: 'Support', color: colors.error },
  ];

  const yesterdayChange = ((mockEarnings.today - mockEarnings.yesterday) / mockEarnings.yesterday * 100).toFixed(0);

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatar, { backgroundColor: colors.primary.cyan }]}>
            <Text style={styles.avatarText}>
              {mockUser.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View>
            <Text style={[styles.welcomeText, { color: currentColors.text.secondary }]}>
              Welcome back,
            </Text>
            <Text style={[styles.nameText, { color: currentColors.text.primary }]}>
              {mockUser.name.split(' ')[0]}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color={currentColors.text.primary} />
          <View style={[styles.notificationBadge, { backgroundColor: colors.error }]}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Online Status Card */}
        <Card variant="elevated" style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusLeft}>
              <View style={[styles.onlineDot, { backgroundColor: isOnline ? colors.success : colors.error }]} />
              <View>
                <Text style={[styles.statusTitle, { color: currentColors.text.primary }]}>
                  {isOnline ? 'You are Online' : 'You are Offline'}
                </Text>
                <Text style={[styles.statusSubtitle, { color: currentColors.text.secondary }]}>
                  {isOnline ? 'Receiving orders...' : 'Turn on to receive orders'}
                </Text>
              </View>
            </View>
            <Toggle value={isOnline} onValueChange={setIsOnline} />
          </View>
        </Card>

        {/* Earnings Card */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
            TODAY'S EARNINGS
          </Text>
          <TouchableOpacity style={styles.historyLink}>
            <Text style={[styles.historyText, { color: colors.primary.cyan }]}>
              History →
            </Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <Text style={[styles.earningsAmount, { color: currentColors.text.primary }]}>
              ₹ {mockEarnings.today.toLocaleString()}
            </Text>
            <View style={[styles.changeBadge, { backgroundColor: `${colors.success}20` }]}>
              <TrendingUp size={12} color={colors.success} />
              <Text style={[styles.changeText, { color: colors.success }]}>
                {yesterdayChange}%
              </Text>
            </View>
          </View>
          <Text style={[styles.vsText, { color: currentColors.text.muted }]}>
            vs yesterday
          </Text>
          <LineChart data={mockEarnings.chartData.map(d => ({ value: d.value }))} />
        </Card>

        {/* Daily Goal */}
        <Card style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleRow}>
              <Text style={[styles.goalTitle, { color: currentColors.text.primary }]}>
                🏆 Daily Goal
              </Text>
            </View>
            <Text style={[styles.goalPercentage, { color: colors.primary.cyan }]}>
              {dailyGoal.percentage}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: currentColors.surface }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${dailyGoal.percentage}%`, backgroundColor: colors.primary.cyan },
              ]}
            />
          </View>
          <View style={styles.goalFooter}>
            <Text style={[styles.goalText, { color: currentColors.text.secondary }]}>
              {dailyGoal.completed} Completed
            </Text>
            <Text style={[styles.goalText, { color: currentColors.text.muted }]}>
              {dailyGoal.target} Target
            </Text>
          </View>
        </Card>

        {/* Performance Metrics */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary, marginBottom: spacing[4] }]}>
          PERFORMANCE
        </Text>
        <View style={styles.metricsRow}>
          <MetricCard
            title="Acceptance"
            value={`${mockPerformance.acceptanceRate}%`}
            change={mockPerformance.acceptanceChange}
          />
          <MetricCard
            title="On-Time"
            value={`${mockPerformance.onTimeRate}%`}
            change={mockPerformance.onTimeChange}
          />
        </View>
        <View style={[styles.metricsRow, { marginTop: spacing[3] }]}>
          <MetricCard
            title="Completion"
            value={`${mockPerformance.completionRate}%`}
            change={mockPerformance.completionChange}
          />
          <MetricCard
            title="Rating"
            value={mockPerformance.rating.toFixed(1)}
            change={mockPerformance.ratingChange}
          />
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary, marginVertical: spacing[4] }]}>
          QUICK ACTIONS
        </Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                { backgroundColor: currentColors.card },
              ]}
            >
              <action.icon size={28} color={action.color} />
              <Text style={[styles.actionLabel, { color: currentColors.text.primary }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
    paddingHorizontal: spacing[5],
    paddingTop: spacing[14],
    paddingBottom: spacing[4],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  avatarText: {
    color: colors.primary.dark,
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.bold,
  },
  welcomeText: {
    fontSize: typography.sizes.xs,
  },
  nameText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.bold,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.bold,
  },
  scrollContent: {
    padding: spacing[4],
  },
  statusCard: {
    padding: spacing[4],
    marginBottom: spacing[5],
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing[3],
  },
  statusTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.semiBold,
  },
  statusSubtitle: {
    fontSize: typography.sizes.sm,
    marginTop: spacing[0.5],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
    paddingHorizontal: spacing[1],
  },
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.semiBold,
    letterSpacing: 0.5,
  },
  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  earningsCard: {
    padding: spacing[5],
    marginBottom: spacing[4],
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsAmount: {
    fontSize: typography.sizes['5xl'],
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing[3],
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  changeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing[1],
  },
  vsText: {
    fontSize: typography.sizes.sm,
    marginTop: spacing[1],
    marginBottom: spacing[4],
  },
  goalCard: {
    padding: spacing[5],
    marginBottom: spacing[5],
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
  },
  goalPercentage: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.bold,
  },
  progressBar: {
    height: 8,
    borderRadius: borderRadius.full,
    marginBottom: spacing[3],
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalText: {
    fontSize: typography.sizes.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    marginHorizontal: -spacing[1],
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing[1],
  },
  actionButton: {
    width: '30%',
    aspectRatio: 1,
    margin: spacing[1],
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing[2],
  },
  bottomPadding: {
    height: spacing[10],
  },
});
