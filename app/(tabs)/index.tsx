import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { MapPin, Navigation, Play, Square, Search, X, Clock, Target, CircleCheck as CheckCircle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface LocationCoords {
  latitude: number;
  longitude: number;
  address?: string;
}

interface AlarmState {
  destination: LocationCoords | null;
  alertDistance: number;
  isActive: boolean;
  remainingDistance: number | null;
}

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen() {
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [alarm, setAlarm] = useState<AlarmState>({
    destination: null,
    alertDistance: 1.0,
    isActive: false,
    remainingDistance: null,
  });
  const [step, setStep] = useState<'destination' | 'distance' | 'active' | 'completed'>('destination');

  useEffect(() => {
    requestPermissions();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    let intervalId: any = null;

    const updateLocation = async () => {
      if (alarm.isActive && alarm.destination) {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
          });

          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            alarm.destination.latitude,
            alarm.destination.longitude
          );

          setAlarm(prev => ({ ...prev, remainingDistance: distance }));

          if (distance <= alarm.alertDistance) {
            showDestinationAlert();
            setAlarm(prev => ({ ...prev, isActive: false }));
            setStep('completed');
          }
        } catch (error) {
          console.error('Error updating location:', error);
        }
      }
    };

    if (alarm.isActive && alarm.destination) {
      // Update immediately
      updateLocation();
      // Then update every 10 seconds
      intervalId = setInterval(updateLocation, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [alarm.isActive, alarm.destination, alarm.alertDistance]);

  const requestPermissions = async () => {
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
    
    if (locationStatus !== 'granted') {
      Alert.alert('Permission Required', 'Location permission is required to use this app.');
    }
    
    if (notificationStatus !== 'granted') {
      Alert.alert('Permission Required', 'Notification permission is required for alerts.');
    }
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not get your current location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Removed startLocationTracking function as it's now integrated into the useEffect

  const showDestinationAlert = async () => {
    try {
      // Only schedule notification if permissions are granted and platform supports it
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted' && Platform.OS !== 'web') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🎯 You're Almost There!",
            body: `You're within ${alarm.alertDistance}km of your destination. Time to get ready!`,
            sound: true,
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.log('Notification scheduling failed:', error);
    }

    Alert.alert(
      "🎯 You're Almost There!",
      `You're within ${alarm.alertDistance}km of your destination. Time to get ready!`,
      [{ text: "Got it!", style: "default" }]
    );
  };

  const handleDestinationSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Enter Destination', 'Please enter a destination to search for.');
      return;
    }

    // For demo purposes, we'll use coordinates parsing
    // In a real app, you'd integrate with a geocoding service
    const coords = searchQuery.split(',');
    if (coords.length === 2) {
      const lat = parseFloat(coords[0].trim());
      const lng = parseFloat(coords[1].trim());
      
      if (!isNaN(lat) && !isNaN(lng)) {
        setAlarm(prev => ({
          ...prev,
          destination: { latitude: lat, longitude: lng, address: searchQuery }
        }));
        setStep('distance');
        return;
      }
    }

    // Simulate setting a destination for demo
    Alert.alert(
      'Demo Mode',
      'In demo mode, please enter coordinates as "latitude, longitude" (e.g., "40.7128, -74.0060")',
      [{ text: 'OK' }]
    );
  };

  const handleDistanceSelection = (distance: number) => {
    setAlarm(prev => ({ ...prev, alertDistance: distance }));
  };

  const startAlarm = () => {
    if (!currentLocation) {
      Alert.alert('Location Required', 'Please wait for your current location to be detected.');
      return;
    }

    setAlarm(prev => ({ ...prev, isActive: true }));
    setStep('active');
  };

  const stopAlarm = () => {
    setAlarm(prev => ({ ...prev, isActive: false, remainingDistance: null }));
    setStep('completed');
  };

  const clearAlarm = () => {
    setAlarm({
      destination: null,
      alertDistance: 1.0,
      isActive: false,
      remainingDistance: null,
    });
    setSearchQuery('');
    setStep('destination');
  };

  const renderDestinationStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Search size={32} color="#8B5CF6" strokeWidth={2} />
        <Text style={styles.stepTitle}>Where is your destination?</Text>
        <Text style={styles.stepSubtitle}>Enter coordinates or search for a place</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter destination (lat, lng) or search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          multiline={false}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleDestinationSearch}>
          <Search size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation} disabled={isLoadingLocation}>
        <Navigation size={20} color="#8B5CF6" strokeWidth={2} />
        <Text style={styles.locationButtonText}>
          {isLoadingLocation ? 'Getting Location...' : 'Use Current Location as Reference'}
        </Text>
      </TouchableOpacity>

      {currentLocation && (
        <View style={styles.currentLocationInfo}>
          <Text style={styles.currentLocationText}>
            Current Location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );

  const renderDistanceStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Clock size={32} color="#3B82F6" strokeWidth={2} />
        <Text style={styles.stepTitle}>When should we alert you?</Text>
        <Text style={styles.stepSubtitle}>Choose how far before your destination</Text>
      </View>

      <View style={styles.destinationInfo}>
        <MapPin size={16} color="#10B981" strokeWidth={2} />
        <Text style={styles.destinationText}>
          Destination: {alarm.destination?.address || `${alarm.destination?.latitude.toFixed(4)}, ${alarm.destination?.longitude.toFixed(4)}`}
        </Text>
      </View>

      <View style={styles.distanceOptions}>
        {[0.5, 1.0, 2.0, 5.0].map((distance) => (
          <TouchableOpacity
            key={distance}
            style={[
              styles.distanceOption,
              alarm.alertDistance === distance && styles.distanceOptionSelected
            ]}
            onPress={() => handleDistanceSelection(distance)}
          >
            <Text style={[
              styles.distanceOptionText,
              alarm.alertDistance === distance && styles.distanceOptionTextSelected
            ]}>
              {distance} km
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startAlarm}>
        <Play size={24} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.startButtonText}>Start Alarm</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setStep('destination')}>
        <Text style={styles.backButtonText}>← Change Destination</Text>
      </TouchableOpacity>
    </View>
  );

  const renderActiveStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Target size={32} color="#10B981" strokeWidth={2} />
        <Text style={styles.stepTitle}>Alarm is Active</Text>
        <Text style={styles.stepSubtitle}>Monitoring your location</Text>
      </View>

      <View style={styles.activeAlarmInfo}>
        <View style={styles.destinationInfo}>
          <MapPin size={16} color="#10B981" strokeWidth={2} />
          <Text style={styles.destinationText}>
            {alarm.destination?.address || `${alarm.destination?.latitude.toFixed(4)}, ${alarm.destination?.longitude.toFixed(4)}`}
          </Text>
        </View>

        <View style={styles.distanceInfo}>
          {alarm.remainingDistance !== null ? (
            <>
              <Text style={styles.distanceLabel}>Distance Remaining</Text>
              <Text style={styles.distanceValue}>{alarm.remainingDistance.toFixed(2)} km</Text>
              <Text style={styles.alertInfo}>Alert at {alarm.alertDistance} km</Text>
            </>
          ) : (
            <Text style={styles.calculatingText}>Calculating distance...</Text>
          )}
        </View>

        <View style={styles.statusIndicator}>
          <View style={styles.pulsingDot} />
          <Text style={styles.statusText}>Tracking Location</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.stopButton} onPress={stopAlarm}>
        <Square size={24} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.stopButtonText}>Stop Alarm</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCompletedStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <CheckCircle size={32} color="#10B981" strokeWidth={2} />
        <Text style={styles.stepTitle}>Alarm Completed</Text>
        <Text style={styles.stepSubtitle}>Hope you had a great journey!</Text>
      </View>

      <View style={styles.completedInfo}>
        <Text style={styles.completedText}>
          {alarm.remainingDistance !== null 
            ? `Final distance: ${alarm.remainingDistance.toFixed(2)} km`
            : 'Alarm was stopped manually'
          }
        </Text>
      </View>

      <TouchableOpacity style={styles.clearButton} onPress={clearAlarm}>
        <X size={20} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.clearButtonText}>Set New Destination</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Destination Alarm</Text>
        <Text style={styles.headerSubtitle}>Never miss your stop again</Text>
      </View>

      {step === 'destination' && renderDestinationStep()}
      {step === 'distance' && renderDistanceStep()}
      {step === 'active' && renderActiveStep()}
      {step === 'completed' && renderCompletedStep()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1E293B',
    marginRight: 12,
  },
  searchButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    backgroundColor: '#F3E8FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#DDD6FE',
  },
  locationButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  currentLocationInfo: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  currentLocationText: {
    fontSize: 14,
    color: '#0369A1',
    textAlign: 'center',
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  destinationText: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  distanceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  distanceOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
  },
  distanceOptionSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3E8FF',
  },
  distanceOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  distanceOptionTextSelected: {
    color: '#8B5CF6',
  },
  startButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 16,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  activeAlarmInfo: {
    marginBottom: 32,
  },
  distanceInfo: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  distanceLabel: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  distanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  alertInfo: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  calculatingText: {
    fontSize: 16,
    color: '#64748B',
    fontStyle: 'italic',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#065F46',
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  completedInfo: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  completedText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
});