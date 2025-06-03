import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getDailySummary, getChecklistStatus, upsertChecklistStatus } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useSummary(date: Date) {
  const [summary, setSummary] = useState('');
  const [checklistItems, setChecklistItems] = useState<{ text: string; completed: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSummaryAndChecklist = async () => {
      setIsLoading(true);
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
<<<<<<< HEAD
        // 1. Get summary for the date (always, for summary text)
        const dailySummary = await getDailySummary(formattedDate);
        setSummary(dailySummary?.summary || '');

        // 2. Require login for checklist status
        const userStr = await AsyncStorage.getItem('auth_user');
        if (!userStr) throw new Error('User not logged in');
        const user = JSON.parse(userStr);
        const userId = user.id;

        // 3. Try to fetch user checklist status
        let checklistStatus = await getChecklistStatus(formattedDate, userId);

        // 4. If not found, create checklist status from daily summary's checklist
        if (!checklistStatus && dailySummary?.checklist) {
          checklistStatus = await upsertChecklistStatus(formattedDate, userId, dailySummary.checklist);
        }

        // 5. Set checklist items from status (if any), else empty
        setChecklistItems(checklistStatus?.checklist || []);
=======
        console.log('📅 Calling getDailySummary with:', formattedDate);
        const data = await getDailySummary(formattedDate);
        console.log('✅ Received summary data:', data);
        setSummary(data.summary ?? '');
        setChecklistItems(Array.isArray(data.checklist) ? data.checklist : []);
>>>>>>> c88311e (🔁 Sunday update: Connect BibleContext to backend, switch from mock API to real API)
      } catch (error) {
        console.error('Error fetching summary or checklist status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaryAndChecklist();
  }, [date]);

  const toggleChecklistItem = (index: number) => {
    setChecklistItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        completed: !updated[index].completed,
      };

      // Save updated checklist status to backend, with debug log
      (async () => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const userStr = await AsyncStorage.getItem('auth_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          console.log('Checklist payload:', {
            date: formattedDate,
            userId: user.id,
            checklist: updated,
          });
          await upsertChecklistStatus(formattedDate, user.id, updated);
        }
      })();

      return updated;
    });
  };

  return { summary, checklistItems, toggleChecklistItem, isLoading };
}