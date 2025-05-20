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


// Mock function to get daily readings
export const getDailyReadings = async (dateStr: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock readings data
  return {
    date: dateStr,
    firstReading: {
      reference: 'Kisah Para Rasul 1:1-11',
      content: 'Dalam bukuku yang pertama, hai Teofilus, aku menulis tentang segala sesuatu yang dikerjakan dan diajarkan Yesus, sampai pada hari Ia terangkat. Sebelum itu Ia telah memberi perintah-Nya oleh Roh Kudus kepada rasul-rasul yang dipilih-Nya. Kepada mereka Ia menunjukkan diri-Nya setelah penderitaan-Nya selesai, dan dengan banyak tanda Ia membuktikan, bahwa Ia hidup. Sebab selama empat puluh hari Ia berulang-ulang menampakkan diri dan berbicara kepada mereka tentang Kerajaan Allah.'
    },
    psalm: {
      reference: 'Mazmur 47:2-3, 6-7, 8-9',
      content: 'Hai segala bangsa, bertepuktanganlah, elu-elukanlah Allah dengan sorak-sorai! Sebab TUHAN, Yang Mahatinggi, adalah dahsyat, Raja yang besar atas seluruh bumi. Allah naik dengan diiringi sorak-sorai, ya TUHAN itu, dengan diiringi bunyi sangkakala. Bermazmurlah bagi Allah, bermazmurlah, bermazmurlah bagi Raja kita, bermazmurlah!'
    },
    secondReading: {
      reference: 'Efesus 1:17-23',
      content: 'Aku berdoa supaya Allah Tuhan kita Yesus Kristus, yaitu Bapa yang mulia itu, memberikan kepadamu Roh hikmat dan wahyu untuk mengenal Dia dengan benar. Dan supaya Ia menjadikan mata hatimu terang, agar kamu mengerti pengharapan apakah yang terkandung dalam panggilan-Nya: betapa kayanya kemuliaan bagian yang ditentukan-Nya bagi orang-orang kudus.'
    },
    gospel: {
      reference: 'Matius 28:16-20',
      content: 'Dan kesebelas murid itu pergi ke Galilea, ke bukit yang telah ditunjukkan Yesus kepada mereka. Ketika melihat Dia mereka menyembah-Nya, tetapi beberapa orang ragu-ragu. Yesus mendekati mereka dan berkata: "Kepada-Ku telah diberikan segala kuasa di sorga dan di bumi. Karena itu pergilah, jadikanlah semua bangsa murid-Ku dan baptislah mereka dalam nama Bapa dan Anak dan Roh Kudus, dan ajarlah mereka melakukan segala sesuatu yang telah Kuperintahkan kepadamu. Dan ketahuilah, Aku menyertai kamu senantiasa sampai kepada akhir zaman."'
    }
  };
};