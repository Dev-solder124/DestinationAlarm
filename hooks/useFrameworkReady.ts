import { useEffect } from 'react';

export function useFrameworkReady() {
  useEffect(() => {
    // This hook is not needed for React Native
    // window object doesn't exist in React Native
    console.log('Framework ready');
  }, []);
}
