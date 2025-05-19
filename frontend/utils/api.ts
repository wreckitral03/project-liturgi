import axios from 'axios';

// Use dynamic base URL from environment variable
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

export const getBibleBooks = async () => {
  try {
    const res = await axios.get(`${API_BASE}/bible/books`);
    return res.data;
  } catch (err) {
    console.error('Error fetching Bible books:', err);
    return []; // Return empty array on failure
  }
};

// abbr: the abbreviation of the Bible book
export const getChapterContent = async (abbr: string, chapter: number) => {
  try {
    const res = await axios.get(`${API_BASE}/bible/${abbr}/${chapter}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching chapter ${chapter} from book ${abbr}:`, err);
    return null;
  }
};