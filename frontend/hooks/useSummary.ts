import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { mockGetDailySummary } from '@/utils/mockApi';

export function useSummary(date: Date) {
  const [summary, setSummary] = useState('');
  const [checklistItems, setChecklistItems] = useState<{ text: string; completed: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const data = await mockGetDailySummary(formattedDate);
        setSummary(data.summary);
        setChecklistItems(data.checklist);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSummary();
  }, [date]);
  
  const toggleChecklistItem = (index: number) => {
    setChecklistItems(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        completed: !updated[index].completed
      };
      return updated;
    });
  };
  
  return { summary, checklistItems, toggleChecklistItem, isLoading };
}