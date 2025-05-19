import { useState } from 'react';
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
import { COLORS } from '@/utils/theme';

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
        title="AI Verse Assistant"
        message="Masuk untuk menggunakan AI pendamping spiritual"
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
      <StatusBar style="light" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Verse Assistant</Text>
        </View>
        
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView 
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {dailyTokenUsed && (
              <View style={styles.limitBanner}>
                <Text style={styles.limitText}>
                  Kamu sudah menerima ayat hari ini. Coba lagi besok ya 🙏
                </Text>
              </View>
            )}
            
            {chatHistory.length === 0 ? (
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatTitle}>
                  Selamat datang di AI Verse Assistant
                </Text>
                <Text style={styles.emptyChatDescription}>
                  Bagikan perasaan atau situasi yang kamu alami, dan AI akan memberikan ayat yang sesuai untuk menguatkan kamu.
                </Text>
              </View>
            ) : (
              chatHistory.map((message, index) => (
                <ChatMessage 
                  key={index}
                  message={message}
                  isLast={index === chatHistory.length - 1}
                />
              ))
            )}
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  keyboardAvoidingView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 16,
  },
  limitBanner: {
    backgroundColor: COLORS.warning,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  limitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
  },
  emptyChat: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
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
});