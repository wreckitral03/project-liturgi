import { useContext } from 'react';
import { BibleContext } from '@/contexts/BibleContext';

export function useBible() {
  const context = useContext(BibleContext);
  if (!context) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
}