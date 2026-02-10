import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks';
import { Card, Toggle } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { MoreStackParamList } from '../../navigation/MainNavigator';
import { mockUser } from '../../data/mockData';
import { FEATURE_FLAGS } from '../../constants';
import {
  User,
  FileText,
  CreditCard,
  Bell,
  Moon,
  Globe,
  HelpCircle,
  MessageCircle,
  LogOut,
  ChevronRight,
  Store,
  Users,
  Clock,
} from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<MoreStackParamList>;

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  value,
  hasToggle,
  toggleValue,
  onToggle,
  onPress,
  danger,
}) => {
  const { currentColors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={hasToggle}
    >
      <View style={styles.menuItemLeft}>
        <Icon
          size={20}
          color={danger ? colors.error : currentColors.text.secondary}
        />
        <Text
          style={[
            styles.menuItemLabel,
            {
              color: danger ? colors.error : currentColors.text.primary,
            },
          ]}
        >
          {label}
        </Text>
      </View>
      <View style={styles.menuItemRight}>
        {value && (
          <Text style={[styles.menuItemValue, { color: currentColors.text.muted }]}>
            {value}
          </Text>
        )}
        {hasToggle && onToggle && (
          <Toggle value={toggleValue || false} onValueChange={onToggle} />
        )}
        {!hasToggle && !danger && (
          <ChevronRight size={20} color={currentColors.text.muted} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export const MoreScreen: React.FC = () => {
  const { currentColors, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [notifications, setNotifications] = React.useState(true);

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          More
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.primary.cyan }]}>
              <Text style={styles.avatarText}>
                {mockUser.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: currentColors.text.primary }]}>
                {mockUser.name}
              </Text>
              <Text style={[styles.profileOutlet, { color: currentColors.text.secondary }]}>
                {mockUser.outletName}
              </Text>
              <Text style={[styles.profilePhone, { color: currentColors.text.muted }]}>
                {mockUser.phone}
              </Text>
            </View>
          </View>
        </Card>

        {/* Account Section */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          ACCOUNT
        </Text>
        <Card style={styles.menuCard}>
          <MenuItem
            icon={User}
            label="Personal Information"
            onPress={() => navigation.navigate('Settings')}
          />
        </Card>

        {/* Outlet Section - Only show if Outlet Settings is enabled */}
        {FEATURE_FLAGS.ENABLE_OUTLET_SETTINGS && (
          <>
            <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
              OUTLET
            </Text>
            <Card style={styles.menuCard}>
              <MenuItem
                icon={Store}
                label="Outlet Settings"
                onPress={() => navigation.navigate('OutletSettings')}
              />
            </Card>
          </>
        )}

        {/* Preferences Section */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          PREFERENCES
        </Text>
        <Card style={styles.menuCard}>
          <MenuItem
            icon={Bell}
            label="Push Notifications"
            hasToggle
            toggleValue={notifications}
            onToggle={setNotifications}
          />
          <MenuItem
            icon={Moon}
            label="Dark Mode"
            hasToggle
            toggleValue={isDark}
            onToggle={toggleTheme}
          />
          <MenuItem
            icon={Globe}
            label="Language"
            value="English"
            onPress={() => {}}
          />
        </Card>

        {/* Support Section */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          SUPPORT
        </Text>
        <Card style={styles.menuCard}>
          <MenuItem
            icon={HelpCircle}
            label="Help Center"
            onPress={() => navigation.navigate('Support')}
          />
          <MenuItem
            icon={MessageCircle}
            label="Contact Support"
            onPress={() => {}}
          />
        </Card>

        {/* Logout */}
        <Card style={[styles.menuCard, { marginTop: spacing[4] }]}>
          <MenuItem
            icon={LogOut}
            label="Logout"
            danger
            onPress={() => {}}
          />
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
    paddingTop: spacing[14],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  scrollContent: {
    padding: spacing[4],
  },
  profileCard: {
    padding: spacing[5],
    marginBottom: spacing[5],
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  avatarText: {
    color: colors.primary.dark,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[1],
  },
  profileOutlet: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing[0.5],
  },
  profilePhone: {
    fontSize: typography.sizes.xs,
  },
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing[3],
    marginTop: spacing[2],
    letterSpacing: 0.5,
  },
  menuCard: {
    marginBottom: spacing[4],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3.5],
    paddingHorizontal: spacing[4],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: typography.sizes.md,
    marginLeft: spacing[3],
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: typography.sizes.sm,
    marginRight: spacing[2],
  },
  bottomPadding: {
    height: spacing[10],
  },
});
