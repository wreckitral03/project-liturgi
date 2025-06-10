import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class StorageManager {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // For web, use localStorage directly as fallback
        const value = await AsyncStorage.getItem(key);
        if (value === null && typeof window !== 'undefined') {
          return window.localStorage.getItem(key);
        }
        return value;
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Also set in localStorage as backup
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  }
}

export const storage = new StorageManager();