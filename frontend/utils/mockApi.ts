// This file contains mock API functions to simulate backend interactions

// Mock login function
export const mockLogin = async (email: string, password: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, accept any email/password
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  // Return mock user data
  return {
    id: '123456',
    name: 'Catholic User',
    email: email,
    role: 'Free',
  };
};

// Mock register function
export const mockRegister = async (name: string, email: string, password: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validate inputs
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }
  
  // Return mock user data
  return {
    id: '123456',
    name: name,
    email: email,
    role: 'Free',
  };
};

// Mock function to get daily readings
export const mockGetDailyReadings = async (dateStr: string): Promise<any> => {
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

// Mock function to get daily summary
export const mockGetDailySummary = async (dateStr: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock summary data
  return {
    date: dateStr,
    summary: 'Bacaan hari ini mengingatkan kita tentang pentingnya iman dalam kehidupan sehari-hari. Kristus mengajarkan kita untuk mengasihi sesama seperti diri kita sendiri dan untuk selalu mencari kerajaan Allah terlebih dahulu. Melalui doa dan refleksi, kita diajak untuk melihat bagaimana Tuhan bekerja dalam hidup kita dan bagaimana kita dapat menjadi saksi-Nya di dunia ini.',
    checklist: [
      { text: 'Saya telah membaca kitab suci hari ini', completed: false },
      { text: 'Saya telah mendoakan orang lain', completed: false },
      { text: 'Saya telah melakukan perbuatan baik', completed: false },
      { text: 'Saya telah bersyukur atas berkat hari ini', completed: false },
      { text: 'Saya telah memaafkan orang yang menyakiti saya', completed: false }
    ]
  };
};

// Mock function to get AI response
export const mockGetAIResponse = async (message: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock AI response
  return {
    isUser: false,
    text: 'Saya mendengar bahwa kamu sedang menghadapi situasi yang sulit. Tetaplah kuat dalam iman dan percaya bahwa Tuhan selalu menyertai kamu. Berikut ayat yang mungkin dapat menguatkan kamu:',
    verse: {
      reference: 'Filipi 4:13',
      text: 'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.'
    }
  };
};

// Mock function to get AI chat history
export const mockGetAIHistory = async (): Promise<any[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock chat history (empty for now)
  return [];
};

// Mock Bible-related functions

// Get Bible books
export const mockGetBibleBooks = async (): Promise<any[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock Bible books
  return [
    { id: 'genesis', name: 'Kejadian' },
    { id: 'exodus', name: 'Keluaran' },
    { id: 'leviticus', name: 'Imamat' },
    { id: 'numbers', name: 'Bilangan' },
    { id: 'deuteronomy', name: 'Ulangan' },
    { id: 'joshua', name: 'Yosua' },
    { id: 'judges', name: 'Hakim-hakim' },
    { id: 'ruth', name: 'Rut' },
    { id: 'matthew', name: 'Matius' },
    { id: 'mark', name: 'Markus' },
    { id: 'luke', name: 'Lukas' },
    { id: 'john', name: 'Yohanes' },
    { id: 'acts', name: 'Kisah Para Rasul' },
    { id: 'romans', name: 'Roma' },
    { id: 'corinthians1', name: '1 Korintus' },
    { id: 'corinthians2', name: '2 Korintus' },
    { id: 'galatians', name: 'Galatia' },
    { id: 'ephesians', name: 'Efesus' },
    { id: 'philippians', name: 'Filipi' },
    { id: 'colossians', name: 'Kolose' },
    { id: 'thessalonians1', name: '1 Tesalonika' },
    { id: 'thessalonians2', name: '2 Tesalonika' },
  ];
};

// Get book details
export const mockGetBookDetails = async (bookId: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Define book names mapping
  const bookNames: {[key: string]: string} = {
    'genesis': 'Kejadian',
    'exodus': 'Keluaran',
    'matthew': 'Matius',
    'mark': 'Markus',
    'luke': 'Lukas',
    'john': 'Yohanes',
    'acts': 'Kisah Para Rasul',
    'romans': 'Roma',
    'corinthians1': '1 Korintus',
    'ephesians': 'Efesus',
    'philippians': 'Filipi',
  };
  
  // Return mock book details
  return {
    id: bookId,
    name: bookNames[bookId] || 'Unknown Book',
    chapters: Array.from({ length: 28 }, (_, i) => i + 1), // Most books have fewer chapters, this is just for mock
  };
};

// Get chapter content
export const mockGetChapterContent = async (bookId: string, chapter: number): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock verses
  const versesCount = 25; // Average number of verses per chapter
  const verses = Array.from({ length: versesCount }, (_, i) => ({
    number: i + 1,
    text: `This is verse ${i + 1} of chapter ${chapter} from the book of ${bookId}. In this verse, we read about God's love for humanity and His plan for salvation. The message reminds us to love one another and to seek His kingdom first.`
  }));
  
  // Return mock chapter content
  return {
    bookId,
    chapter,
    verses
  };
};

// Search Bible
export const mockSearchBible = async (query: string): Promise<any[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock search results
  return [
    {
      bookId: 'john',
      bookName: 'Yohanes',
      chapter: 3,
      verse: 16,
      text: 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.'
    },
    {
      bookId: 'romans',
      bookName: 'Roma',
      chapter: 8,
      verse: 28,
      text: 'Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia, yaitu bagi mereka yang terpanggil sesuai dengan rencana Allah.'
    },
    {
      bookId: 'philippians',
      bookName: 'Filipi',
      chapter: 4,
      verse: 13,
      text: 'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.'
    },
    {
      bookId: 'ephesians',
      bookName: 'Efesus',
      chapter: 2,
      verse: 8,
      text: 'Sebab karena kasih karunia kamu diselamatkan oleh iman; itu bukan hasil usahamu, tetapi pemberian Allah.'
    },
    {
      bookId: 'matthew',
      bookName: 'Matius',
      chapter: 28,
      verse: 20,
      text: 'Dan ajarlah mereka melakukan segala sesuatu yang telah Kuperintahkan kepadamu. Dan ketahuilah, Aku menyertai kamu senantiasa sampai kepada akhir zaman.'
    }
  ];
};

// Check if Bible is downloaded
export const mockIsBibleDownloaded = async (): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock download status (false by default)
  return false;
};

// Download Bible
export const mockDownloadBible = async (): Promise<void> => {
  // Simulate download delay (longer to show progress)
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Just return, no data needed
  return;
};