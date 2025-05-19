import axios from 'axios';
import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  mockSearchBible,
  mockDownloadBible,
  mockIsBibleDownloaded
} from '@/utils/mockApi';
import { getBibleBooks } from '@/utils/api';
import { Book } from '@/types/bible';

//  mockGetBibleBooks, (takeout)

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
  const [books, setBooks] = useState<Book[]>([]);  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBibleDownloaded, setIsBibleDownloaded] = useState(false);
  
  // Load Bible books on mount
  useEffect(() => {
    const loadBibleData = async () => {
      setIsLoading(true);
      try {
        const booksData = await getBibleBooks();
        setBooks(booksData);
        console.log('Books loaded from API:', booksData);


        const downloaded = await mockIsBibleDownloaded();
        setIsBibleDownloaded(downloaded);
      } catch (error) {
        console.error('Error loading Bible data:', error);
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
      const response = await axios.get(`/bible/${bookId}/1`);
      return response.data;
    } catch (error) {
      console.error('Error loading book details:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Get chapter content
  const getChapterContent = useCallback(async (bookId: string, chapter: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/bible/${bookId}/${chapter}`);
      return response.data;
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
      const results = await mockSearchBible(query);
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
      await mockDownloadBible();
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