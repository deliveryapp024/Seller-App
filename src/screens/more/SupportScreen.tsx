import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks';
import { Card, Button } from '../../components';
import { colors, spacing, typography } from '../../theme';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  FileText,
  HelpCircle,
  ChevronRight,
} from 'lucide-react-native';

export const SupportScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const navigation = useNavigation();

  const faqs = [
    {
      question: 'How do I update my menu?',
      answer: 'Go to Menu tab, select a category, and tap the toggle to mark items available/unavailable.',
    },
    {
      question: 'When will I receive my payout?',
      answer: 'Payouts are processed weekly. You can check your payout status in the Payouts tab.',
    },
    {
      question: 'How can I contact my delivery partner?',
      answer: 'In order details, tap the call button next to the delivery partner name.',
    },
  ];

  const supportOptions = [
    { icon: Phone, label: 'Call Support', value: '1800-123-4567' },
    { icon: MessageCircle, label: 'WhatsApp', value: '+91 98765 43210' },
    { icon: Mail, label: 'Email', value: 'support@sellerapp.com' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={currentColors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text.primary }]}>
          Help & Support
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Support Options */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          CONTACT US
        </Text>
        <Card style={styles.optionsCard}>
          {supportOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionRow,
                index !== supportOptions.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: currentColors.border,
                },
              ]}
            >
              <View style={styles.optionLeft}>
                <option.icon size={20} color={colors.primary.cyan} />
                <View>
                  <Text style={[styles.optionLabel, { color: currentColors.text.primary }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.optionValue, { color: currentColors.text.secondary }]}>
                    {option.value}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={currentColors.text.muted} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          QUICK ACTIONS
        </Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: currentColors.card }]}>
            <FileText size={24} color={colors.primary.cyan} />
            <Text style={[styles.quickActionText, { color: currentColors.text.primary }]}>
              Raise a Ticket
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: currentColors.card }]}>
            <HelpCircle size={24} color={colors.primary.cyan} />
            <Text style={[styles.quickActionText, { color: currentColors.text.primary }]}>
              View Tutorials
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          FREQUENTLY ASKED QUESTIONS
        </Text>
        {faqs.map((faq, index) => (
          <Card key={index} style={styles.faqCard}>
            <Text style={[styles.faqQuestion, { color: currentColors.text.primary }]}>
              {faq.question}
            </Text>
            <Text style={[styles.faqAnswer, { color: currentColors.text.secondary }]}>
              {faq.answer}
            </Text>
          </Card>
        ))}

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
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing[3],
    marginTop: spacing[2],
    letterSpacing: 0.5,
  },
  optionsCard: {
    marginBottom: spacing[5],
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: spacing[3],
  },
  optionValue: {
    fontSize: typography.sizes.sm,
    marginLeft: spacing[3],
    marginTop: spacing[0.5],
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: -spacing[2],
    marginBottom: spacing[5],
  },
  quickAction: {
    flex: 1,
    marginHorizontal: spacing[2],
    padding: spacing[4],
    borderRadius: 16,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
    marginTop: spacing[2],
  },
  faqCard: {
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  faqQuestion: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing[2],
  },
  faqAnswer: {
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  bottomPadding: {
    height: spacing[10],
  },
});
