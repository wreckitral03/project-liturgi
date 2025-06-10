import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import AuthPrompt from '@/components/auth/AuthPrompt';
import ChatMessage from '@/components/chat/ChatMessage';
import LoadingMessage from '@/components/chat/LoadingMessage';
import { COLORS } from '@/utils/theme';

// Helper function to check if two dates are on different days
const isDifferentDay = (date1?: string, date2?: string) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() !== d2.toDateString();
};

// Helper function to format date separator
const formatDateSeparator = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (messageDate.getTime() === today.getTime()) {
    return 'Hari Ini';
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return 'Kemarin';
  } else {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
};

export default function ChatScreen() {
  const { isAuthenticated } = useAuth();
  const [userInput, setUserInput] = useState('');
  const { 
    chatHistory, 
    sendMessage, 
    isLoading, 
    dailyTokenUsed 
  } = useAIAssistant();
  
  if (!isAuthenticated) {
    return (
      <AuthPrompt 
        title="Liturgi AI Assistant"
        message="Masuk untuk berbagi cerita harian dan dapatkan motivasi rohani dari AI pendampingmu."
        buttonText="Masuk / Daftar"
      />
    );
  }
  
  const handleSend = () => {
    if (!userInput.trim()) return;
    if (dailyTokenUsed) {
      Alert.alert(
        "Batas Harian Tercapai",
        "Kamu sudah menerima ayat hari ini. Coba lagi besok ya 🙏",
        [{ text: "OK" }]
      );
      return;
    }
    sendMessage(userInput);
    setUserInput('');
  };

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <SafeAreaView style={{ backgroundColor: COLORS.primary, flex: 1 }} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Liturgi AI Assistant</Text>
          </View>
          
          {/* Persistent Daily Info Box */}
          {dailyTokenUsed && (
            <View style={styles.persistentBanner}>
              <Text style={styles.persistentBannerText}>
                Kamu sudah menerima ayat hari ini.
              </Text>
              <Text style={styles.persistentBannerText}>
                Coba lagi besok ya 🙏
              </Text>
            </View>
          )}
          
          <ScrollView 
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Chat History Info - appears at the top when scrolling */}
            {chatHistory.length > 0 && (
              <View style={styles.historyInfoBanner}>
                <Text style={styles.historyInfoText}>
                  📅 Menampilkan riwayat percakapan 7 hari terakhir
                </Text>
              </View>
            )}
            
            {/* Welcome message for new users */}
            {chatHistory.length === 0 && !dailyTokenUsed && (
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatTitle}>
                  Selamat datang di Liturgi AI Assistant
                </Text>
                <Text style={styles.emptyChatDescription}>
                  Bagikan perasaan atau situasi yang kamu alami, dan AI akan memberikan ayat yang sesuai untuk menguatkan kamu.
                </Text>
              </View>
            )}

            {/* Chat History with Date Separators */}
            {chatHistory.map((message, index) => {
              const showDateSeparator = index === 0 || 
                isDifferentDay(chatHistory[index - 1]?.createdAt, message.createdAt);
              
              return (
                <React.Fragment key={index}>
                  {showDateSeparator && (
                    <View style={styles.dateSeparator}>
                      <Text style={styles.dateSeparatorText}>
                        {formatDateSeparator(message.createdAt)}
                      </Text>
                    </View>
                  )}
                  <ChatMessage 
                    message={message}
                    isLast={index === chatHistory.length - 1}
                  />
                </React.Fragment>
              );
            })}
            
            {/* Loading Message */}
            <LoadingMessage isVisible={isLoading} />
          </ScrollView>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Bagaimana kondisi kamu hari ini?"
              placeholderTextColor="#9E9E9E"
              value={userInput}
              onChangeText={setUserInput}
              multiline
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                (!userInput.trim() || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={handleSend}
              disabled={!userInput.trim() || isLoading}
            >
              <Send color="#FFF" size={20} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  persistentBanner: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 16,
    paddingVertical: 8,   // Reduced from 12 to 8
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  persistentBannerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,        // Reduced from 14 to 13
    color: '#FFF',
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 16,
  },
  emptyChat: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  emptyChatTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textMain,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyChatDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparatorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.textMuted,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  historyInfoBanner: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  historyInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#1976D2',
    textAlign: 'center',
  },
});