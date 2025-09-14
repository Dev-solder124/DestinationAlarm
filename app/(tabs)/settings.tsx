import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Bell, Vibrate, Volume2, Info, Shield, MapPin } from 'lucide-react-native';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [persistentNotification, setPersistentNotification] = useState(false);

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    value, 
    onValueChange, 
    type = 'switch' 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
          thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your alarm preferences</Text>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <SettingItem
          icon={<Volume2 size={20} color="#3B82F6" strokeWidth={2} />}
          title="Sound Alerts"
          description="Play sound when destination is reached"
          value={soundEnabled}
          onValueChange={setSoundEnabled}
        />
        
        <SettingItem
          icon={<Vibrate size={20} color="#3B82F6" strokeWidth={2} />}
          title="Vibration"
          description="Vibrate device for alerts"
          value={vibrationEnabled}
          onValueChange={setVibrationEnabled}
        />
        
        <SettingItem
          icon={<Bell size={20} color="#3B82F6" strokeWidth={2} />}
          title="Persistent Notification"
          description="Show ongoing notification while alarm is active"
          value={persistentNotification}
          onValueChange={setPersistentNotification}
        />
      </View>

      {/* App Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        
        <SettingItem
          icon={<Info size={20} color="#64748B" strokeWidth={2} />}
          title="About"
          description="Version 1.0.0 - Never miss your stop"
          type="button"
        />
        
        <SettingItem
          icon={<Shield size={20} color="#64748B" strokeWidth={2} />}
          title="Privacy"
          description="Location data is used only for alarm functionality"
          type="button"
        />
        
        <SettingItem
          icon={<MapPin size={20} color="#64748B" strokeWidth={2} />}
          title="Location Accuracy"
          description="High accuracy GPS for precise distance calculations"
          type="button"
        />
      </View>

      {/* Tips Section */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Usage Tips</Text>
        
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>
            • Keep the app open while traveling for best performance
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>
            • Set alert distance based on your transport speed
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>
            • Use 0.5km for buses, 1-2km for trains
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>
            • Enable location permissions for accurate tracking
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});