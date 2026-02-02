import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks';
import { Button } from '../../components';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { ArrowLeft } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;
type RouteProps = RouteProp<AuthStackParamList, 'OTP'>;

export const OTPScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { phone } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setLoading(true);
      // Mock verification
      setTimeout(() => {
        setLoading(false);
        // Navigate to main app (in real app, this would set authenticated state)
      }, 1500);
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      // Mock resend
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
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={currentColors.text.primary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: currentColors.text.primary }]}>
              Verify OTP
            </Text>
            <Text style={[styles.subtitle, { color: currentColors.text.secondary }]}>
              Enter the 6-digit code sent to
            </Text>
            <Text style={[styles.phoneText, { color: colors.primary.cyan }]}>
              {phone}
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  {
                    backgroundColor: currentColors.surface,
                    borderColor: digit ? colors.primary.cyan : currentColors.border,
                    color: currentColors.text.primary,
                  },
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Verify Button */}
          <Button
            title="Verify & Continue"
            onPress={handleVerify}
            loading={loading}
            disabled={otp.join('').length !== 6}
            size="lg"
          />

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={[styles.resendText, { color: currentColors.text.muted }]}>
              Didn't receive the code?
            </Text>
            <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
              <Text
                style={[
                  styles.resendLink,
                  {
                    color: resendTimer > 0 ? currentColors.text.muted : colors.primary.cyan,
                  },
                ]}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
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
  },
  backButton: {
    marginBottom: spacing[6],
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing[8],
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.sizes.md,
  },
  phoneText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.semiBold,
    marginTop: spacing[2],
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[8],
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing[6],
  },
  resendText: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing[1],
  },
  resendLink: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
  },
});
