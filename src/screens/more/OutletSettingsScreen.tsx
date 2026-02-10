import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks';
import { Card, Input, Button, Toggle } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { ArrowLeft, MapPin, Clock, Navigation } from 'lucide-react-native';
import {
  getStoreLocation,
  updateStoreLocation,
  getDeliveryArea,
  setDeliveryArea,
  validateDeliveryRadius,
  LocationData,
} from '../../api/sellerApi';

export const OutletSettingsScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const navigation = useNavigation();
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [isSavingRadius, setIsSavingRadius] = useState(false);
  
  // Location state
  const [outletName, setOutletName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [hasLocation, setHasLocation] = useState(false);
  
  // Delivery area state
  const [deliveryRadius, setDeliveryRadius] = useState('5');
  const [deliveryUnit, setDeliveryUnit] = useState('km');
  const [isDeliveryActive, setIsDeliveryActive] = useState(true);
  
  // Outlet status
  const [isOpen, setIsOpen] = useState(true);

  // Fetch existing settings on mount
  useEffect(() => {
    fetchOutletSettings();
  }, []);

  const fetchOutletSettings = async () => {
    setIsLoading(true);
    try {
      // Fetch location
      const locationRes = await getStoreLocation();
      if (locationRes.success && locationRes.data) {
        const { storeLocation } = locationRes.data;
        if (storeLocation.isSet && storeLocation.latitude && storeLocation.longitude) {
          setLatitude(storeLocation.latitude);
          setLongitude(storeLocation.longitude);
          setAddress(storeLocation.address || '');
          setHasLocation(true);
        }
      }

      // Fetch delivery area
      const deliveryRes = await getDeliveryArea();
      if (deliveryRes.success && deliveryRes.data) {
        setDeliveryRadius(deliveryRes.data.radius.toString());
        setDeliveryUnit(deliveryRes.data.unit);
        setIsDeliveryActive(deliveryRes.data.isActive);
      }
    } catch (error) {
      console.error('Failed to fetch outlet settings:', error);
      Alert.alert('Error', 'Failed to load outlet settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Validate and save delivery radius
  const handleSaveDeliveryRadius = async () => {
    const radius = parseFloat(deliveryRadius);
    const validation = validateDeliveryRadius(radius);
    
    if (!validation.isValid) {
      Alert.alert('Invalid Radius', validation.error);
      return;
    }

    setIsSavingRadius(true);
    try {
      const response = await setDeliveryArea(radius, deliveryUnit);
      if (response.success) {
        Alert.alert('Success', 'Delivery area updated successfully');
      } else {
        Alert.alert('Error', response.error || 'Failed to update delivery area');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSavingRadius(false);
    }
  };

  // Update location (placeholder for map picker integration)
  const handleUpdateLocation = async () => {
    // TODO: Open map picker to select location
    // For now, show alert explaining this feature
    Alert.alert(
      'Update Location',
      'This will open a map to pin your exact store location.\n\nFor now, please contact support to update your location.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Use Current', 
          onPress: () => handleUseCurrentLocation()
        },
      ]
    );
  };

  // Use current location (mock for now)
  const handleUseCurrentLocation = async () => {
    setIsSavingLocation(true);
    try {
      // TODO: Get actual GPS location
      // Mock location for Bangalore
      const mockLocation: LocationData = {
        latitude: 12.9716,
        longitude: 77.5946,
        address: address || 'Current Location, Bangalore',
      };

      const response = await updateStoreLocation(mockLocation);
      if (response.success) {
        setLatitude(mockLocation.latitude);
        setLongitude(mockLocation.longitude);
        setHasLocation(true);
        Alert.alert('Success', 'Store location updated successfully');
      } else {
        Alert.alert('Error', response.error || 'Failed to update location');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update location. Please try again.');
    } finally {
      setIsSavingLocation(false);
    }
  };

  const timings = [
    { day: 'Monday', hours: '10:00 AM - 11:00 PM' },
    { day: 'Tuesday', hours: '10:00 AM - 11:00 PM' },
    { day: 'Wednesday', hours: '10:00 AM - 11:00 PM' },
    { day: 'Thursday', hours: '10:00 AM - 11:00 PM' },
    { day: 'Friday', hours: '10:00 AM - 11:30 PM' },
    { day: 'Saturday', hours: '10:00 AM - 11:30 PM' },
    { day: 'Sunday', hours: '10:00 AM - 11:00 PM' },
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary.cyan} />
        <Text style={[styles.loadingText, { color: currentColors.text.secondary }]}>
          Loading outlet settings...
        </Text>
      </View>
    );
  }

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
          <TouchableOpacity 
            style={[styles.locationButton, isSavingLocation && styles.locationButtonDisabled]}
            onPress={handleUpdateLocation}
            disabled={isSavingLocation}
          >
            {isSavingLocation ? (
              <ActivityIndicator size="small" color={colors.primary.cyan} />
            ) : (
              <>
                <MapPin size={16} color={colors.primary.cyan} />
                <Text style={[styles.locationText, { color: colors.primary.cyan }]}>
                  {hasLocation ? 'Update Location on Map' : 'Set Store Location'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          {hasLocation && latitude && longitude && (
            <View style={styles.coordinatesContainer}>
              <Navigation size={14} color={currentColors.text.muted} />
              <Text style={[styles.coordinatesText, { color: currentColors.text.muted }]}>
                Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
              </Text>
            </View>
          )}
        </Card>

        {/* Delivery Area */}
        <Text style={[styles.sectionTitle, { color: currentColors.text.secondary }]}>
          DELIVERY AREA
        </Text>
        <Card style={styles.formCard}>
          <View style={styles.deliveryAreaHeader}>
            <View>
              <Text style={[styles.deliveryAreaTitle, { color: currentColors.text.primary }]}>
                Delivery Radius
              </Text>
              <Text style={[styles.deliveryAreaSubtitle, { color: currentColors.text.secondary }]}>
                Max distance you'll deliver (1-10 km for pilot)
              </Text>
            </View>
            <Toggle 
              value={isDeliveryActive} 
              onValueChange={setIsDeliveryActive} 
            />
          </View>

          <View style={styles.radiusInputContainer}>
            <Input
              label="Radius (km)"
              value={deliveryRadius}
              onChangeText={setDeliveryRadius}
              keyboardType="decimal-pad"
              maxLength={4}
              placeholder="5"
              style={styles.radiusInput}
            />
            <Text style={[styles.radiusUnit, { color: currentColors.text.secondary }]}>
              km
            </Text>
          </View>

          <View style={styles.radiusHintContainer}>
            <Text style={[styles.radiusHint, { color: currentColors.text.muted }]}>
              Recommended: 3-5 km for optimal delivery times
            </Text>
          </View>

          <Button
            title={isSavingRadius ? 'Saving...' : 'Update Delivery Area'}
            onPress={handleSaveDeliveryRadius}
            loading={isSavingRadius}
            disabled={isSavingRadius}
            size="md"
            style={{ marginTop: spacing[4] }}
          />
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
          title="Save All Changes"
          onPress={() => Alert.alert('Success', 'Outlet settings saved successfully')}
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
  loadingText: {
    marginTop: spacing[4],
    fontSize: typography.sizes.md,
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
  locationButtonDisabled: {
    opacity: 0.6,
  },
  locationText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: spacing[2],
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[3],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  coordinatesText: {
    fontSize: typography.sizes.xs,
    marginLeft: spacing[2],
  },
  deliveryAreaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  deliveryAreaTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.semiBold,
  },
  deliveryAreaSubtitle: {
    fontSize: typography.sizes.sm,
    marginTop: spacing[1],
  },
  radiusInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[3],
  },
  radiusInput: {
    flex: 1,
  },
  radiusUnit: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: spacing[3],
  },
  radiusHintContainer: {
    marginTop: spacing[2],
  },
  radiusHint: {
    fontSize: typography.sizes.xs,
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
