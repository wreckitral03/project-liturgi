import { useState, useEffect } from 'react';
import { mockGetAIResponse, mockGetAIHistory } from '@/utils/mockApi';

export function useAIAssistant() {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyTokenUsed, setDailyTokenUsed] = useState(false);
  
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await mockGetAIHistory();
        setChatHistory(history);
        
        // Check if daily token is used
        // In a real app, you would check with the server
        // For mock, we'll just check if there's any history from today
        if (history.length > 0) {
          setDailyTokenUsed(true);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    
    loadChatHistory();
  }, []);
  
  const sendMessage = async (message: string) => {
    if (dailyTokenUsed) return;
    
    setIsLoading(true);
    
    try {
      // Add user message to chat history
      const userMessage = {
        isUser: true,
        text: message,
      };
      
      setChatHistory(prev => [...prev, userMessage]);
      
      // Get AI response
      const response = await mockGetAIResponse(message);
      
      // Add AI response to chat history
      setChatHistory(prev => [...prev, response]);
      
      // Mark daily token as used
      setDailyTokenUsed(true);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { chatHistory, sendMessage, isLoading, dailyTokenUsed };
}