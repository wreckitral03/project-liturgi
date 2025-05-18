import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/utils/theme';

interface ChatMessageProps {
  message: {
    isUser: boolean;
    text: string;
    verse?: {
      reference: string;
      text: string;
    };
  };
  isLast: boolean;
}

export default function ChatMessage({ message, isLast }: ChatMessageProps) {
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
  botMessage: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },
  botText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMain,
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