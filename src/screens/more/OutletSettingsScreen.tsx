import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks';
import { Card, Input, Button, Toggle } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { mockUser } from '../../data/mockData';
import { ArrowLeft, MapPin, Clock } from 'lucide-react-native';

export const OutletSettingsScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const navigation = useNavigation();
  const [outletName, setOutletName] = useState(mockUser.outletName);
  const [address, setAddress] = useState('100 Feet Road, Indiranagar, Bangalore');
  const [isOpen, setIsOpen] = useState(true);

  const timings = [
    { day: 'Monday', hours: '10:00 AM - 11:00 PM' },
    { day: 'Tuesday', hours: '10:00 AM - 11:00 PM' },
    { day: 'Wednesday', hours: '10:00 AM - 11:00 PM' },
    { day: 'Thursday', hours: '10:00 AM - 11:00 PM' },
    { day: 'Friday', hours: '10:00 AM - 11:30 PM' },
    { day: 'Saturday', hours: '10:00 AM - 11:30 PM' },
    { day: 'Sunday', hours: '10:00 AM - 11:00 PM' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          Outlet Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Outlet Status */}
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={[styles.statusTitle, { color: currentColors.text.primary }]}>
                Outlet Status
              </Text>
              <Text style={[styles.statusSubtitle, { color: currentColors.text.secondary }]}>
                {isOpen ? 'Currently accepting orders' : 'Temporarily closed'}
              </Text>
            </View>
            <Toggle value={isOpen} onValueChange={setIsOpen} />
          </View>
        </Card>

        {/* Basic Info */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          BASIC INFORMATION
        </Text>
        <Card style={styles.formCard}>
          <Input
            label="Outlet Name"
            value={outletName}
            onChangeText={setOutletName}
          />
          <Input
            label="Address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity style={styles.locationButton}>
            <MapPin size={16} color={colors.primary.cyan} />
            <Text style={[styles.locationText, { color: colors.primary.cyan }]}>
              Update Location on Map
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Timings */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          OPERATING HOURS
        </Text>
        <Card style={styles.timingsCard}>
          {timings.map((timing, index) => (
            <View
              key={timing.day}
              style={[
                styles.timingRow,
                index !== timings.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: currentColors.border,
                },
              ]}
            >
              <View style={styles.timingLeft}>
                <Clock size={16} color={currentColors.text.muted} />
                <Text style={[styles.dayText, { color: currentColors.text.primary }]}>
                  {timing.day}
                </Text>
              </View>
              <Text style={[styles.hoursText, { color: currentColors.text.secondary }]}>
                {timing.hours}
              </Text>
            </View>
          ))}
        </Card>

        <Button
          title="Save Changes"
          onPress={() => {}}
          size="lg"
          style={{ marginTop: spacing[6], marginBottom: spacing[10] }}
        />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[14],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes.lg,
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
  statusTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.semiBold,
  },
  statusSubtitle: {
    fontSize: typography.sizes.sm,
    marginTop: spacing[1],
  },
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing[3],
    letterSpacing: 0.5,
  },
  formCard: {
    padding: spacing[4],
    marginBottom: spacing[5],
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  locationText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: spacing[2],
  },
  timingsCard: {
    paddingVertical: spacing[2],
    marginBottom: spacing[4],
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  timingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    fontSize: typography.sizes.md,
    marginLeft: spacing[3],
  },
  hoursText: {
    fontSize: typography.sizes.sm,
  },
});
