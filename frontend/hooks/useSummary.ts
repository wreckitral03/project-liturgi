import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getDailySummary } from '@/utils/api';

export function useSummary(date: Date) {
  const [summary, setSummary] = useState('');
  const [checklistItems, setChecklistItems] = useState<{ text: string; completed: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchSummary = async () => {
      console.log('fetchSummary called');
      setIsLoading(true);
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        console.log('📅 Calling getDailySummary with:', formattedDate);
        const data = await getDailySummary(formattedDate);
        console.log('✅ Received summary data:', data);
        setSummary(data.summary ?? '');
        setChecklistItems(Array.isArray(data.checklist) ? data.checklist : []);
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