import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/utils/theme';

interface ChatMessageProps {
  message: {
    isUser: boolean;
    text: string;
    createdAt?: string;
    verse?: {
      reference: string;
      text: string;
    };
  };
  isLast: boolean;
}

// Helper function to format timestamp
const formatTimestamp = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const timeString = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const dayString = date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short'
  });
  
  return `${dayString} ${timeString}`;
};

export default function ChatMessage({ message, isLast }: ChatMessageProps) {
  const timestamp = formatTimestamp(message.createdAt);
  
  return (
    <View 
      style={[
        styles.container,
        message.isUser ? styles.userContainer : styles.botContainer,
        isLast && styles.lastMessage
      ]}
    >
      {message.isUser ? (
        <View style={styles.userMessage}>
          <Text style={styles.userText}>{message.text}</Text>
          {timestamp && (
            <Text style={styles.userTimestamp}>{timestamp}</Text>
          )}
        </View>
      ) : (
        <View style={styles.botMessage}>
          <Text style={styles.botText}>{message.text}</Text>
          
          {message.verse && (
            <View style={styles.verseContainer}>
              <Text style={styles.verseReference}>{message.verse.reference}</Text>
              <Text style={styles.verseText}>"{message.verse.text}"</Text>
            </View>
          )}
          
          {timestamp && (
            <Text style={styles.botTimestamp}>{timestamp}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  lastMessage: {
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },
  userText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFF',
  },
  userTimestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'right',
  },
  botMessage: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  botText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMain,
  },
  botTimestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  verseContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  verseReference: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 4,
  },
  verseText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.textMain,
  },
});