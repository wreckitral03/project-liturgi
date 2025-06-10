import axios from 'axios';
import { storage } from './storage'; // Replace AsyncStorage import
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const API_BASE =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE ??
  Constants.manifest?.extra?.EXPO_PUBLIC_API_BASE ??
  'http://localhost:3000'; // Add this fallback
  console.log('📡 API_BASE =', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
});

// Attach the auth token to every request if available, except for public routes
api.interceptors.request.use(
  async (config) => {
    const publicRoutes = ['/bible', '/readings', '/summary/daily'];
    const isPublic = publicRoutes.some(route => config.url?.startsWith(route));

    if (!isPublic) {
      const token = await storage.getItem('auth_token');
      console.log('API Request - Token found:', !!token, 'Platform:', Platform.OS);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - Clearing tokens');
      await storage.removeItem('auth_token');
      await storage.removeItem('auth_user');
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
  const { data } = res;
  await storage.setItem('auth_token', data.access_token);
  await storage.setItem('auth_user', JSON.stringify(data.user));
  return data;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  ageCategory?: string
) => {
  const payload: any = { name, email, password };
  if (ageCategory) {
    payload.ageCategory = ageCategory;
  }
  const res = await api.post('/auth/register', payload);
  const { data } = res;
  await storage.setItem('auth_token', data.access_token);
  await storage.setItem('auth_user', JSON.stringify(data.user));
  return data;
};

// login function remains the same - it will now receive ageCategory from backend

// --- CHECKLIST ENDPOINTS ---

export const getUserChecklistStatus = async (date: string): Promise<any> => {
  const res = await api.get(`/summary/checklist/${date}`);
  return res.data;
};

export const updateChecklistItem = async (
  summaryId: string, 
  itemIndex: number, 
  completed: boolean
): Promise<any> => {
  const res = await api.put(`/summary/checklist/${summaryId}/item/${itemIndex}`, { completed });
  return res.data;
};

export const updateChecklistItemByText = async (
  summaryId: string, 
  itemText: string, 
  completed: boolean
): Promise<any> => {
  const res = await api.put(`/summary/checklist/${summaryId}/item`, { itemText, completed });
  return res.data;
};

export default api;