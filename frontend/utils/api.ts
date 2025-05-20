import axios from 'axios';

import { Platform } from 'react-native';

const localIP = 'http://192.168.1.100:3000'; // ← Replace with your Mac’s IP
const API_BASE = Platform.OS === 'ios' || Platform.OS === 'android'
  ? localIP
  : 'http://localhost:3000';

export const getBibleBooks = async () => {
  const res = await axios.get(`${API_BASE}/bible`);
  return res.data;
};

export const getBookDetails = async (bookId: string) => {
  const res = await axios.get(`${API_BASE}/bible/${bookId}`);
  return res.data;
};

export const getChapterContent = async (bookId: string, chapter: number) => {
  const res = await axios.get(`${API_BASE}/bible/${bookId}/${chapter}`);
  return res.data;
};

export const searchBible = async (query: string) => {
  const res = await axios.get(`${API_BASE}/bible/search?q=${encodeURIComponent(query)}`);
  return res.data;
};

export const exportBible = async () => {
  const res = await axios.get(`${API_BASE}/bible/export`);
  return res.data;
};

export const seedBible = async (verses: Array<{ book: string; chapter: number; verse: number; text: string }>) => {
  const res = await axios.post(`${API_BASE}/bible/seed`, verses);
  return res.data;
};



// Get daily readings
// This function fetches the daily readings from the API
// It takes a date string as an argument and returns the readings for that date
// The date string should be in the format 'YYYY-MM-DD'
// The function uses axios to make a GET request to the API endpoint
// The API endpoint is constructed using the base URL and the date string
// The function returns the data received from the API
// The API endpoint is '/readings/daily?date={dateStr}'
// The dateStr parameter is passed as a query parameter in the URL
// The function is asynchronous and returns a Promise
export const getDailyReadings = async (dateStr: string): Promise<any> => {
  const res = await axios.get(`${API_BASE}/readings/daily?date=${dateStr}`);
  return res.data;
};



//4. Mock function to get daily summary
export const getDailySummary = async (dateStr: string): Promise<any> => {
  const res = await axios.get(`${API_BASE}/summary/daily?date=${dateStr}`);
  return res.data;
};