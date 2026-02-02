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
import { Card, Input, Button } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { mockUser } from '../../data/mockData';
import { ArrowLeft } from 'lucide-react-native';

export const SettingsScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const navigation = useNavigation();
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email || '');
  const [phone, setPhone] = useState(mockUser.phone);

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          Personal Information
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.formCard}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            editable={false}
          />
          <Text style={[styles.helperText, { color: currentColors.text.muted }]}>
            Phone number cannot be changed. Contact support for assistance.
          </Text>
        </Card>

        <Button
          title="Save Changes"
          onPress={() => {}}
          size="lg"
          style={{ marginTop: spacing[6] }}
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
  formCard: {
    padding: spacing[4],
  },
  helperText: {
    fontSize: typography.sizes.xs,
    marginTop: -spacing[2],
  },
});
