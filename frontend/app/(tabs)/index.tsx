import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Book, Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import DateNavigator from '@/components/ui/DateNavigator';
import ReadingSection from '@/components/ui/ReadingSection';
import { useReadings } from '@/hooks/useReadings';
import { COLORS } from '@/utils/theme';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Get daily readings for the selected date
  const { readings, isLoading } = useReadings(selectedDate);
  
  // Format date in Indonesian
  const formattedDate = format(selectedDate, "EEEE, d MMMM yyyy", { locale: id });
  
  // Navigate to Bible reader
  const openBibleReader = useCallback(() => {
    router.push('/bible');
  }, [router]);

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <SafeAreaView style={{ backgroundColor: COLORS.primary, flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Liturgi Harian</Text>
          <TouchableOpacity 
            style={styles.bibleButton}
            onPress={openBibleReader}
          >
            <Book color="#FFF" size={24} />
          </TouchableOpacity>
        </View>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: 8 }}>
            <DateNavigator 
              date={selectedDate} 
              onDateChange={setSelectedDate} 
            />
          </View>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Memuat bacaan...</Text>
            </View>
          ) : (
            <View style={styles.readingsContainer}>
              {readings?.firstReading && (
                <ReadingSection
                  icon="📖"
                  title="Bacaan Pertama"
                  reference={readings.firstReading.reference}
                  content={readings.firstReading.content}
                  isFirst
                />
              )}
              
              {readings?.psalm && (
                <ReadingSection
                  icon="🎶"
                  title="Mazmur Tanggapan"
                  reference={readings.psalm.reference}
                  content={readings.psalm.content}
                />
              )}
              
              {readings?.secondReading && (
                <ReadingSection
                  icon="📘"
                  title="Bacaan Kedua"
                  reference={readings.secondReading.reference}
                  content={readings.secondReading.content}
                />
              )}
              
              {readings?.gospel && (
                <ReadingSection
                  icon="✝️"
                  title="Injil"
                  reference={readings.gospel.reference}
                  content={readings.gospel.content}
                />
              )}
              
              {!readings?.firstReading && !readings?.psalm && 
               !readings?.secondReading && !readings?.gospel && (
                <View style={styles.noReadingsContainer}>
                  <Text style={styles.noReadingsText}>
                    Tidak ada bacaan untuk {formattedDate}
                  </Text>
                </View>
              )}
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  bibleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 32,
  },
  readingsContainer: {
    paddingHorizontal: 8, // no horizontal padding here since parent already has padding
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
  noReadingsContainer: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  noReadingsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});