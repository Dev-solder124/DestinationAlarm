import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { MapPin, Plus, Trash2, Save, Navigation } from 'lucide-react-native';
import { useSavedLocations } from '../hooks/useSavedLocations';
import { SavedLocation } from '../types/location';
import * as Location from 'expo-location';

interface SavedDestinationsProps {
  onSelectLocation: (location: SavedLocation) => void;
}

export const SavedDestinations: React.FC<SavedDestinationsProps> = ({ onSelectLocation }) => {
  const [showNewDestination, setShowNewDestination] = useState(false);
  const [shouldSaveLocation, setShouldSaveLocation] = useState(false);
  const [newLocationCoords, setNewLocationCoords] = useState('');
  const [saveName, setSaveName] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { savedLocations, saveLocation, deleteLocation } = useSavedLocations();

  const handleNewDestination = () => {
    if (!newLocationCoords.trim()) {
      Alert.alert('Error', 'Please enter coordinates');
      return;
    }

    const coords = newLocationCoords.split(',').map(c => parseFloat(c.trim()));
    if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
      Alert.alert('Error', 'Please enter valid coordinates (e.g., "40.7128, -74.0060")');
      return;
    }

    if (shouldSaveLocation && !saveName.trim()) {
      Alert.alert('Error', 'Please enter a name for the saved location');
      return;
    }

    const timestamp = new Date().getTime();

    if (shouldSaveLocation) {
      saveLocation({
        name: saveName.trim(),
        latitude: coords[0],
        longitude: coords[1],
      });
    }

    const newLocation: SavedLocation = {
      id: 'new',
      name: shouldSaveLocation ? saveName : 'Custom Location',
      latitude: coords[0],
      longitude: coords[1],
      timestamp
    };
    onSelectLocation(newLocation);

    // Reset form
    setNewLocationCoords('');
    setSaveName('');
    setShouldSaveLocation(false);
    setShowNewDestination(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this saved location?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteLocation(id)
        }
      ]
    );
  };

  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is required to use this feature.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const coords = `${location.coords.latitude}, ${location.coords.longitude}`;
      setNewLocationCoords(coords);
    } catch (error) {
      Alert.alert('Error', 'Could not get your current location. Please try again.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const renderNewDestinationForm = () => (
    <View style={styles.addForm}>
      <View style={styles.coordsContainer}>
        <TextInput
          style={[styles.input, styles.coordsInput]}
          placeholder="Enter coordinates (lat, lng)"
          value={newLocationCoords}
          onChangeText={setNewLocationCoords}
        />
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <ActivityIndicator color="#8B5CF6" />
          ) : (
            <Navigation size={24} color="#8B5CF6" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.saveToggle}>
        <Text style={styles.saveToggleText}>Save this location?</Text>
        <Switch
          value={shouldSaveLocation}
          onValueChange={setShouldSaveLocation}
          trackColor={{ false: '#E2E8F0', true: '#C4B5FD' }}
          thumbColor={shouldSaveLocation ? '#8B5CF6' : '#94A3B8'}
        />
      </View>

      {shouldSaveLocation && (
        <TextInput
          style={styles.input}
          placeholder="Location Name"
          value={saveName}
          onChangeText={setSaveName}
        />
      )}

      <View style={styles.formButtons}>
        <TouchableOpacity 
          style={[styles.formButton, styles.cancelButton]}
          onPress={() => {
            setShowNewDestination(false);
            setNewLocationCoords('');
            setSaveName('');
            setShouldSaveLocation(false);
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.formButton, styles.saveButton]}
          onPress={handleNewDestination}
        >
          <Text style={styles.saveButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Destination Alarm</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowNewDestination(true)}
        >
          <Plus size={20} color="#8B5CF6" strokeWidth={2} />
          <Text style={styles.addButtonText}>New Destination</Text>
        </TouchableOpacity>
      </View>

      {showNewDestination ? (
        renderNewDestinationForm()
      ) : (
        <FlatList
          data={savedLocations}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.locationItem}>
              <TouchableOpacity 
                style={styles.locationInfo}
                onPress={() => onSelectLocation(item)}
              >
                <MapPin size={16} color="#8B5CF6" strokeWidth={2} />
                <View style={styles.locationTexts}>
                  <Text style={styles.locationName}>{item.name}</Text>
                  <Text style={styles.locationCoords}>
                    {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Trash2 size={16} color="#EF4444" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    marginLeft: 4,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  locationItem: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  locationTexts: {
    marginLeft: 8,
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  locationCoords: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  deleteButton: {
    padding: 12,
  },
  addForm: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 14,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  formButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 12,
  },
  saveToggleText: {
    fontSize: 16,
    color: '#1E293B',
  },
  coordsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coordsInput: {
    flex: 1,
  },
  currentLocationButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
});