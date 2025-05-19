import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3000';

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
