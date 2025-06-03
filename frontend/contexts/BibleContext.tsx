import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  getBibleBooks,
  getBookDetails as fetchBookDetails,
  getChapterContent as fetchChapterContent,
  searchBible as fetchSearchBible,
  exportBible,
} from '@/utils/api';

interface BibleContextType {
  books: any[];
  isLoading: boolean;
  isSearching: boolean;
  isDownloading: boolean;
  isBibleDownloaded: boolean;
  getBookDetails: (bookId: string) => Promise<any>;
  getChapterContent: (bookId: string, chapter: number) => Promise<any>;
  searchBible: (query: string) => Promise<any[]>;
  downloadBible: () => Promise<void>;
}

export const BibleContext = createContext<BibleContextType>({
  books: [],
  isLoading: false,
  isSearching: false,
  isDownloading: false,
  isBibleDownloaded: false,
  getBookDetails: async () => ({}),
  getChapterContent: async () => ({}),
  searchBible: async () => [],
  downloadBible: async () => {},
});

interface BibleProviderProps {
  children: ReactNode;
}

export function BibleProvider({ children }: BibleProviderProps) {
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBibleDownloaded, setIsBibleDownloaded] = useState(false);
  
  // Load Bible books on mount
  useEffect(() => {
    const loadBibleData = async () => {
      setIsLoading(true);
      try {
        console.log('Loading Bible data...');
        const booksData = await getBibleBooks();
        console.log('Books data received:', booksData);
        console.log('Number of books:', booksData?.length);
        setBooks(booksData);
        
        setIsBibleDownloaded(true);
      } catch (error) {
        console.error('Error loading Bible data:', error);
        console.error('Error details:', error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBibleData();
  }, []);
  
  // Get book details
  const getBookDetails = useCallback(async (bookId: string) => {
    setIsLoading(true);
    try {
      const bookDetails = await fetchBookDetails(bookId);
      return bookDetails;
    } catch (error) {
      console.error('Error loading book details:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Get chapter content
  const getChapterContent = useCallback(async (bookId: string, chapter: number) => {
    console.log('[BibleContext] getChapterContent ->', { bookId, chapter });
    setIsLoading(true);
    try {
      const chapterContent = await fetchChapterContent(bookId, chapter);
      return chapterContent;
    } catch (error) {
      console.error('Error loading chapter content:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Search Bible
  const searchBible = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      const results = await fetchSearchBible(query);
      return results;
    } catch (error) {
      console.error('Error searching Bible:', error);
      throw error;
    } finally {
      setIsSearching(false);
    }
  }, []);
  
  // Download Bible
  const downloadBible = useCallback(async () => {
    if (isDownloading || isBibleDownloaded) return;
    
    setIsDownloading(true);
    try {
      const fullData = await exportBible();
      console.log('[BibleContext] Downloaded Bible:', fullData);
      setIsBibleDownloaded(true);
    } catch (error) {
      console.error('Error downloading Bible:', error);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading, isBibleDownloaded]);
  
  return (
    <BibleContext.Provider
      value={{
        books,
        isLoading,
        isSearching,
        isDownloading,
        isBibleDownloaded,
        getBookDetails,
        getChapterContent,
        searchBible,
        downloadBible,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
}