import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

<<<<<<< HEAD
const localIP = 'http://192.168.103.64:3000'; // ← Replace with your Mac’s IP
const API_BASE = localIP; 
=======
import Constants from 'expo-constants';

const API_BASE =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE ??
  Constants.manifest?.extra?.EXPO_PUBLIC_API_BASE;
  console.log('📡 API_BASE =', API_BASE);
>>>>>>> c88311e (🔁 Sunday update: Connect BibleContext to backend, switch from mock API to real API)

const api = axios.create({
  baseURL: API_BASE,
});

// Attach the auth token to every request if available, except for public routes
api.interceptors.request.use(
  async (config) => {
    const publicRoutes = ['/bible', '/summary', '/readings'];
    const isPublic = publicRoutes.some(route => config.url?.startsWith(route));

    if (!isPublic) {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// (Optional) Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      // Optionally show a message or navigate to login screen
    }
    return Promise.reject(error);
  }
);

// --- PUBLIC ENDPOINTS (use plain axios) ---

export const getBibleBooks = async () => {
  const res = await api.get('/bible');
  return res.data;
};

export const getBookDetails = async (bookId: string) => {
  const res = await api.get(`/bible/${bookId}`);
  return res.data;
};

export const getChapterContent = async (bookId: string, chapter: number) => {
  const res = await api.get(`/bible/${bookId}/${chapter}`);
  return res.data;
};

export const searchBible = async (query: string) => {
  const res = await api.get(`/bible/search?q=${encodeURIComponent(query)}`);
  return res.data;
};

export const exportBible = async () => {
  const res = await api.get('/bible/export');
  return res.data;
};

export const seedBible = async (verses: Array<{ book: string; chapter: number; verse: number; text: string }>) => {
  const res = await api.post('/bible/seed', verses);
  return res.data;
};

// --- PROTECTED ENDPOINTS (use api instance with token) ---

export const getDailyReadings = async (dateStr: string): Promise<any> => {
  const res = await api.get(`/readings/daily?date=${dateStr}`);
  return res.data;
};

export const getDailySummary = async (dateStr: string): Promise<any> => {
  const res = await api.get(`/summary/daily?date=${dateStr}`);
  return res.data;
};

export const getAIResponse = async (message: string): Promise<any> => {
  const res = await api.post('/ai/message', { message });
  return res.data;
};

export const getAIHistory = async (): Promise<any[]> => {
  const res = await api.get('/ai/history');
  return res.data;
};

// --- AUTH ---

export const login = async (email: string, password: string): Promise<any> => {
  const res = await api.post('/auth/login', { email, password });
  const data = res.data;
  await AsyncStorage.setItem('auth_token', data.access_token);
  await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
  return data;
};

export const register = async (name: string, email: string, password: string): Promise<any> => {
  const res = await api.post('/auth/register', { name, email, password });
  const data = res.data;
  await AsyncStorage.setItem('auth_token', data.access_token);
  await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
  return data;
};

export default api;

// Add these functions after your existing exports in api.ts

// Get checklist status for a specific date and user
export const getChecklistStatus = async (dateStr: string, userId: string): Promise<any> => {
  const res = await api.get(`/summary/checklist-status?date=${dateStr}&userId=${userId}`);
  // If not found, backend returns null
  return res.data;
};

// Create (or upsert) checklist status for a specific date and user
export const upsertChecklistStatus = async (
  dateStr: string,
  userId: string,
  checklist: any
): Promise<any> => {
  const res = await api.post(`/summary/checklist-status`, { date: dateStr, userId, checklist });
  return res.data;
};