import { useState, useEffect } from 'react';
import { getAIResponse, getAIHistory } from '@/utils/api';

export function useAIAssistant() {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyTokenUsed, setDailyTokenUsed] = useState(false);

  // Helper: check if today's AI reply exists
  const checkDailyTokenUsed = (history: any[]) => {
    const today = new Date();
    return history.some((msg) => {
      if (!msg.createdAt || typeof msg.isUser === 'undefined') return false;
      const msgDate = new Date(msg.createdAt);
      return (
        !msg.isUser &&
        msgDate.getFullYear() === today.getFullYear() &&
        msgDate.getMonth() === today.getMonth() &&
        msgDate.getDate() === today.getDate()
      );
    });
  };

  // Loads chat history & updates token status
  const loadChatHistory = async () => {
    try {
      const history = await getAIHistory();
      setChatHistory(history);
      setDailyTokenUsed(checkDailyTokenUsed(history));
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Set empty history to prevent crash
      setChatHistory([]);
      setDailyTokenUsed(false);
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  const sendMessage = async (message: string) => {
    if (dailyTokenUsed) return;
    
    // Immediately add the user's message to chatHistory
    setChatHistory((prev) => [
      ...prev,
      {
        text: message,
        isUser: true,
        createdAt: new Date().toISOString(),
      },
    ]);
    
    setIsLoading(true);
    try {
      await getAIResponse(message);
      await loadChatHistory(); // Reload to sync state with backend (gets AI response)
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally show error state in UI
    } finally {
      setIsLoading(false);
    }
  };

  return { chatHistory, sendMessage, isLoading, dailyTokenUsed };
}