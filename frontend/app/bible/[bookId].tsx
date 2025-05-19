import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useBible } from '@/hooks/useBible';
import { COLORS, FONTS } from '@/utils/theme';

// Get screen width to calculate item size
const { width } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_SPACING = 8;
const NUM_COLUMNS = 4;
const ITEM_MARGIN = GRID_SPACING / 2;

// Calculate item size based on screen width and grid configuration
const ITEM_SIZE = (width - (GRID_PADDING * 2) - (GRID_SPACING * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

export default function BookScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();
  const { getBookDetails, isLoading } = useBible();
  const [bookDetails, setBookDetails] = useState<any>(null);
  
  useEffect(() => {
    const loadBookDetails = async () => {
      if (bookId) {
        const details = await getBookDetails(bookId);
        setBookDetails(details);
      }
    };
    
    loadBookDetails();
  }, [bookId, getBookDetails]);
  
  const navigateToChapter = (chapterNumber: number) => {
    router.push(`/bible/${bookId}/${chapterNumber}`);
  };
  
  return (
    <View style={styles.container}>
      {isLoading || !bookDetails ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.bookTitle}>{bookDetails.name}</Text>
            <Text style={styles.bookInfo}>
              {bookDetails.chapters.length} Pasal
            </Text>
          </View>
          
          <FlatList
            data={bookDetails.chapters}
            keyExtractor={(item) => `chapter-${item}`}
            numColumns={NUM_COLUMNS}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chapterButton}
                onPress={() => navigateToChapter(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.chapterText}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.chaptersContainer}
            columnWrapperStyle={styles.row}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: 16,
  },
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bookTitle: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    color: COLORS.textMain,
    marginBottom: 4,
  },
  bookInfo: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  chaptersContainer: {
    padding: GRID_PADDING,
  },
  row: {
    justifyContent: 'flex-start',
  },
  chapterButton: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    margin: ITEM_MARGIN,
  },
  chapterText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 18,
    color: COLORS.textMain,
  },
});