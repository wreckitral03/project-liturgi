import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check, Info, Star, Heart } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';
import { useSummary } from '@/hooks/useSummary';
import AuthPrompt from '@/components/auth/AuthPrompt';
import { COLORS } from '@/utils/theme';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Add the congratulations messages array here
const CONGRATULATIONS_MESSAGES = [
  "Anda telah menyelesaikan semua aksi spiritual hari ini. Tuhan memberkati dedikasi dan komitmen Anda dalam menjalani iman. Semoga hari ini membawa kedamaian dan keberkahan yang berlimpah! ✨",
  "Luar biasa! Anda telah menunjukkan komitmen yang indah dalam perjalanan spiritual hari ini. Semoga setiap langkah yang Anda ambil membawa Anda lebih dekat dengan Tuhan. Diberkati selalu! 🙏",
  "Selamat! Anda telah menyelesaikan misi spiritual harian dengan penuh dedikasi. Tuhan melihat hati yang tulus dan usaha yang Anda berikan. Semoga berkat-Nya melimpah dalam hidup Anda! 💫",
  "Sungguh menginspirasi! Konsistensi Anda dalam menjalani praktik spiritual patut diacungi jempol. Semoga setiap doa dan refleksi hari ini menjadi berkat bagi Anda dan orang-orang terkasih. 🌟",
  "Hebat sekali! Anda telah menunjukkan disiplin spiritual yang luar biasa hari ini. Tuhan pasti berkenan dengan hati yang setia seperti Anda. Terus bersinar dalam iman! ✨",
  "Terima kasih telah menjadi teladan dalam kehidupan spiritual! Penyelesaian semua aksi harian ini menunjukkan hati yang rindu akan Tuhan. Diberkati melimpah! 🕊️"
];

export default function SummaryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [selectedDate] = useState(new Date());
  const { summary, checklistItems, toggleChecklistItem, isLoading, error } = useSummary(selectedDate);
  const [showCongratulations, setShowCongratulations] = useState(false);
  
  // Format date in Indonesian
  const formattedDate = format(selectedDate, "d MMMM yyyy", { locale: id });
  
  // Check if all items are completed
  const allItemsCompleted = Array.isArray(checklistItems) && 
    checklistItems.length > 0 && 
    checklistItems.every(item => item.completed);
  
  // Function to get random congratulations message
  const getRandomCongratulationsMessage = () => {
    const randomIndex = Math.floor(Math.random() * CONGRATULATIONS_MESSAGES.length);
    return CONGRATULATIONS_MESSAGES[randomIndex];
  };
  
  // Show congratulations when all items are completed
  useEffect(() => {
    if (allItemsCompleted && !showCongratulations) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowCongratulations(true);
      }, 500);
      return () => clearTimeout(timer);
    } else if (!allItemsCompleted && showCongratulations) {
      setShowCongratulations(false);
    }
  }, [allItemsCompleted, showCongratulations]);
  
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
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <SafeAreaView style={{ backgroundColor: COLORS.primary, flex: 1 }} edges={['top']}>
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

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

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
                
                {Array.isArray(checklistItems) && checklistItems.map((item, index) => (
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
                
                {/* Congratulations Message */}
                {showCongratulations && (
                  <View style={styles.congratulationsContainer}>
                    <View style={styles.congratulationsHeader}>
                      <Star size={20} color="#FFD700" fill="#FFD700" />
                      <Heart size={18} color="#FF6B6B" fill="#FF6B6B" style={{ marginLeft: 8 }} />
                    </View>
                    <Text style={styles.congratulationsTitle}>Luar Biasa! 🎉</Text>
                    <Text style={styles.congratulationsText}>
                      {getRandomCongratulationsMessage()}
                    </Text>
                    <View style={styles.congratulationsBadge}>
                      <Text style={styles.badgeText}>Misi Harian Selesai</Text>
                    </View>
                  </View>
                )}
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
    backgroundColor: COLORS.background,
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
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  // New congratulations styles
  congratulationsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#F8FDF8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4F4DD',
    alignItems: 'center',
  },
  congratulationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  congratulationsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#2D5016',
    marginBottom: 8,
    textAlign: 'center',
  },
  congratulationsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#2D5016',
    textAlign: 'center',
    marginBottom: 16,
  },
  congratulationsBadge: {
    backgroundColor: '#4ADE80',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#FFF',
  },
});
export default SummaryScreen;