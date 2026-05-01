import { useState, useEffect, useCallback } from 'react';
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

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    setNoSummaryAvailable(false);

    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const summaryData = await getDailySummary(formattedDate);
      setSummary(summaryData.summary ?? '');

      const userChecklistData = await getUserChecklistStatus(formattedDate);
      setUserChecklistStatus(userChecklistData);
      setChecklistItems(Array.isArray(userChecklistData.checklist) ? userChecklistData.checklist : []);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Error fetching summary data:', error);
      }

      if (error.response?.status === 404) {
        setNoSummaryAvailable(true);
        setError(null);
      } else {
        setError('Terjadi kesalahan saat memuat data. Silakan coba lagi.');
        setNoSummaryAvailable(false);
      }

      setChecklistItems([]);
      setUserChecklistStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [date, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleChecklistItem = async (index: number) => {
    if (!userChecklistStatus || !user || index < 0 || index >= checklistItems.length) {
      console.warn('Cannot toggle checklist item: missing user, checklist status, or valid index');
      return;
    }

    try {
      const updatedItems = [...checklistItems];
      updatedItems[index] = {
        ...updatedItems[index],
        completed: !updatedItems[index].completed,
      };
      setChecklistItems(updatedItems);

      const updatedStatus = await updateChecklistItem(
        userChecklistStatus.summaryId,
        index,
        updatedItems[index].completed
      );

      setUserChecklistStatus(updatedStatus);
      setChecklistItems(Array.isArray(updatedStatus.checklist) ? updatedStatus.checklist : []);
    } catch (error) {
      console.error('Error updating checklist item:', error);

      const revertedItems = [...checklistItems];
      revertedItems[index] = {
        ...revertedItems[index],
        completed: !revertedItems[index].completed,
      };
      setChecklistItems(revertedItems);

      setError('Failed to update checklist item');
    }
  };

  const retryFetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    summary,
    checklistItems,
    toggleChecklistItem,
    isLoading,
    error,
    noSummaryAvailable,
    userChecklistStatus,
    retryFetch,
  };
}
