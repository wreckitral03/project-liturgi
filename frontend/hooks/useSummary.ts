import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getDailySummary, getUserChecklistStatus, updateChecklistItem } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

interface ChecklistItem {
  text: string;
  completed: boolean;
}

interface UserChecklistStatus {
  id: string;
  summaryId: string;
  userId: string;
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export function useSummary(date: Date) {
  const { user } = useAuth();
  const [summary, setSummary] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [userChecklistStatus, setUserChecklistStatus] = useState<UserChecklistStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noSummaryAvailable, setNoSummaryAvailable] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      console.log('fetchData called for authenticated user');
      setIsLoading(true);
      setError(null);
      setNoSummaryAvailable(false);
      
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        
        // Fetch daily summary (public data)
        console.log('📅 Calling getDailySummary with:', formattedDate);
        const summaryData = await getDailySummary(formattedDate);
        console.log('✅ Received summary data:', summaryData);
        setSummary(summaryData.summary ?? '');
        
        // Fetch user-specific checklist status
        console.log('👤 Calling getUserChecklistStatus with:', formattedDate);
        const userChecklistData = await getUserChecklistStatus(formattedDate);
        console.log('✅ Received user checklist data:', userChecklistData);
        
        setUserChecklistStatus(userChecklistData);
        setChecklistItems(Array.isArray(userChecklistData.checklist) ? userChecklistData.checklist : []);
        
      } catch (error: any) {
        // Only log unexpected errors, not 404s which are expected
        if (error.response?.status !== 404) {
          console.error('Error fetching data:', error);
        }
        
        // Handle different types of errors
        if (error.response?.status === 404) {
          setNoSummaryAvailable(true);
          setError(null);
        } else {
          setError('Terjadi kesalahan saat memuat data. Silakan coba lagi.');
          setNoSummaryAvailable(false);
        }
        // Fallback: if user checklist doesn't exist, show empty checklist
        setChecklistItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [date, user]);
  
  const toggleChecklistItem = async (index: number) => {
    if (!userChecklistStatus || !user) {
      console.warn('Cannot toggle checklist item: missing user or checklist status');
      return;
    }
    
    try {
      // Optimistic update
      const updatedItems = [...checklistItems];
      updatedItems[index] = {
        ...updatedItems[index],
        completed: !updatedItems[index].completed
      };
      setChecklistItems(updatedItems);
      
      // Update backend
      const updatedStatus = await updateChecklistItem(
        userChecklistStatus.summaryId,
        index,
        updatedItems[index].completed
      );
      
      console.log('✅ Checklist item updated:', updatedStatus);
      
      // Update local state with server response
      setUserChecklistStatus(updatedStatus);
      setChecklistItems(Array.isArray(updatedStatus.checklist) ? updatedStatus.checklist : []);
      
    } catch (error) {
      console.error('Error updating checklist item:', error);
      
      // Revert optimistic update on error
      const revertedItems = [...checklistItems];
      revertedItems[index] = {
        ...revertedItems[index],
        completed: !revertedItems[index].completed
      };
      setChecklistItems(revertedItems);
      
      setError('Failed to update checklist item');
    }
  };
  
  return { 
    summary, 
    checklistItems, 
    toggleChecklistItem, 
    isLoading, 
    error,
    noSummaryAvailable,
    userChecklistStatus 
  };
}