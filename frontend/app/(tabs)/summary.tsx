import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check, Info } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';
import { useSummary } from '@/hooks/useSummary';
import AuthPrompt from '@/components/auth/AuthPrompt';
import { COLORS } from '@/utils/theme';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function SummaryScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedDate] = useState(new Date());
  const { summary, checklistItems, toggleChecklistItem, isLoading } = useSummary(selectedDate);
  
  // Format date in Indonesian
  const formattedDate = format(selectedDate, "d MMMM yyyy", { locale: id });
  
  if (!isAuthenticated) {
    return (
      <AuthPrompt 
        title="Ringkasan & Aksi Harian"
        message="Masuk untuk melanjutkan refleksi harian"
        buttonText="Masuk / Daftar"
      />
    );
  }
  
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ringkasan & Aksi Harian</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Memuat ringkasan...</Text>
            </View>
          ) : (
            <>
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryTitle}>Ringkasan Spiritual</Text>
                  <Info size={18} color={COLORS.textMuted} />
                </View>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
              
              <View style={styles.checklistContainer}>
                <Text style={styles.checklistTitle}>Aksi Harian</Text>
                
                {checklistItems.map((item, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.checklistItem}
                    onPress={() => toggleChecklistItem(index)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.checkbox,
                      item.completed && styles.checkboxCompleted
                    ]}>
                      {item.completed && (
                        <Check size={16} color="#FFF" />
                      )}
                    </View>
                    <Text style={[
                      styles.checklistText,
                      item.completed && styles.checklistTextCompleted
                    ]}>
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: COLORS.textMain,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textMain,
  },
  summaryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textMain,
  },
  checklistContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  checklistTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textMain,
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.primary,
  },
  checklistText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMain,
    flex: 1,
  },
  checklistTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMuted,
  },
});