import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  Platform
} from 'react-native';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format, addDays, subDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { COLORS } from '@/utils/theme';

// Configure locale for the calendar
LocaleConfig.locales['id'] = {
  monthNames: [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
  dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
};
LocaleConfig.defaultLocale = 'id';

interface DateNavigatorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export default function DateNavigator({ date, onDateChange }: DateNavigatorProps) {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  
  // Format date for display
  const formattedDate = format(date, "EEEE, d MMMM yyyy", { locale: id });
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = subDays(date, 1);
    onDateChange(newDate);
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    const newDate = addDays(date, 1);
    onDateChange(newDate);
  };
  
  // Open calendar modal
  const openCalendar = () => {
    setIsCalendarVisible(true);
  };
  
  // Close calendar modal
  const closeCalendar = () => {
    setIsCalendarVisible(false);
  };
  
  // Handle date selection from calendar
  const handleDayPress = (day: any) => {
    const selectedDate = new Date(day.timestamp);
    onDateChange(selectedDate);
    closeCalendar();
  };
  
  // Format date for calendar selected date
  const formattedCalendarDate = format(date, 'yyyy-MM-dd');
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.navButton}
        onPress={goToPreviousDay}
      >
        <ChevronLeft size={24} color={COLORS.primary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={openCalendar}
      >
        <Text style={styles.dateText}>{formattedDate}</Text>
        <CalendarIcon size={20} color={COLORS.primary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navButton}
        onPress={goToNextDay}
      >
        <ChevronRight size={24} color={COLORS.primary} />
      </TouchableOpacity>
      
      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeCalendar}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                [formattedCalendarDate]: { selected: true, selectedColor: COLORS.primary }
              }}
              theme={{
                todayTextColor: COLORS.primary,
                selectedDayBackgroundColor: COLORS.primary,
                textDayFontFamily: 'Inter-Regular',
                textMonthFontFamily: 'Inter-Bold',
                textDayHeaderFontFamily: 'Inter-Medium',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeCalendar}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,   // <-- This is the left and right space inside the box
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 4,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textMain,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFF',
  },
});