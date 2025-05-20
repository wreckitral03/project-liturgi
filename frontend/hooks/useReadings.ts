import { useState, useEffect } from 'react';
import { getDailyReadings } from '@/utils/api';
import { format } from 'date-fns';

export function useReadings(date: Date) {
  const [readings, setReadings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchReadings = async () => {
      setIsLoading(true);
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const data = await getDailyReadings(formattedDate);
        setReadings(data);
      } catch (error) {
        console.error('Error fetching readings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReadings();
  }, [date]);
  
  return { readings, isLoading };
}