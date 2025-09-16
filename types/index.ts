import { LucideProps } from 'lucide-react-native';
import { SavedLocation } from './location';

export interface IconProps extends LucideProps {
  color?: string;
}

export interface SavedDestinationsProps {
  onSelectLocation: (location: SavedLocation) => void;
}

export interface SaveLocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, coordinates: string) => void;
  coordinates: string;
}

export interface AlarmState {
  isActive: boolean;
  remainingDistance: number | null;
  alertDistance: number;
  location?: SavedLocation;
}