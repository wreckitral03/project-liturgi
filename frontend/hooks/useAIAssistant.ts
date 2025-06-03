import { useState, useEffect } from 'react';
import { getAIResponse, getAIHistory } from '@/utils/api';

export function useAIAssistant() {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyTokenUsed, setDailyTokenUsed] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);

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
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  const sendMessage = async (message: string) => {
    if (dailyTokenUsed) return;
    
    // Immediately show user message
    setPendingUserMessage(message);
    setIsLoading(true);
    
    try {
      await getAIResponse(message);
      await loadChatHistory(); // Reload to sync state with backend
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show an error message here
    } finally {
      setIsLoading(false);
      setPendingUserMessage(null);
    }
  };

  // Combine real chat history with pending message
  const displayHistory = pendingUserMessage 
    ? [...chatHistory, { 
        isUser: true, 
        text: pendingUserMessage, 
        createdAt: new Date().toISOString(),
        isPending: true 
      }]
    : chatHistory;

  return { 
    chatHistory: displayHistory, 
    sendMessage, 
    isLoading, 
    dailyTokenUsed,
    pendingUserMessage 
  };
}