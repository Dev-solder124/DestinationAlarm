import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { SavedLocation } from '../types/location';

const STORAGE_KEY = '@saved_locations';

export const useSavedLocations = () => {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  useEffect(() => {
    loadSavedLocations();
  }, []);

  const loadSavedLocations = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedLocations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading saved locations:', error);
    }
  };

  const saveLocation = async (location: Omit<SavedLocation, 'id' | 'timestamp'>) => {
    try {
      const newLocation: SavedLocation = {
        ...location,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };

      const updatedLocations = [...savedLocations, newLocation];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
      setSavedLocations(updatedLocations);
      return true;
    } catch (error) {
      console.error('Error saving location:', error);
      return false;
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const updatedLocations = savedLocations.filter(loc => loc.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
      setSavedLocations(updatedLocations);
      return true;
    } catch (error) {
      console.error('Error deleting location:', error);
      return false;
    }
  };

  return {
    savedLocations,
    saveLocation,
    deleteLocation,
  };
};