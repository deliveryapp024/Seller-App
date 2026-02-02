import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks';
import { Button, Input } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Phone } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const LoginScreen: React.FC = () => {
  const { currentColors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setLoading(true);
      // Mock API call
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('OTP', { phone: `+91 ${phone}` });
      }, 1500);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: `${colors.primary.cyan}20` }]}>
                <Phone size={32} color={colors.primary.cyan} />
              </View>
            </View>
            <Text style={[styles.title, { color: currentColors.text.primary }]}>
              Seller Login
            </Text>
            <Text style={[styles.subtitle, { color: currentColors.text.secondary }]}>
              Enter your phone number to continue
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Phone Number"
              placeholder="Enter 10 digit mobile number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              leftIcon={<Text style={[styles.countryCode, { color: currentColors.text.primary }]}>+91</Text>}
            />

            <Button
              title="Send OTP"
              onPress={handleSendOTP}
              loading={loading}
              disabled={phone.length !== 10}
              size="lg"
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: currentColors.text.muted }]}>
              By continuing, you agree to our
            </Text>
            <View style={styles.termsRow}>
              <TouchableOpacity>
                <Text style={[styles.termsLink, { color: colors.primary.cyan }]}>
                  Terms of Service
                </Text>
              </TouchableOpacity>
              <Text style={[styles.footerText, { color: currentColors.text.muted }]}>
                {' '}and{' '}
              </Text>
              <TouchableOpacity>
                <Text style={[styles.termsLink, { color: colors.primary.cyan }]}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing[6],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[10],
  },
  iconContainer: {
    marginBottom: spacing[6],
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing[8],
  },
  countryCode: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
  },
  termsRow: {
    flexDirection: 'row',
    marginTop: spacing[1],
  },
  termsLink: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
});
