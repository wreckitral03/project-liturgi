import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useBible } from '@/hooks/useBible';
import { COLORS } from '@/utils/theme';

export default function BookScreen() {
  const { book } = useLocalSearchParams<{ book: string }>();
  const router = useRouter();
  const { getBookDetails, isLoading } = useBible();
  const [bookDetails, setBookDetails] = useState<any>(null);
  
  useEffect(() => {
    const loadBookDetails = async () => {
      if (book) {
        const details = await getBookDetails(book);
        setBookDetails(details);
      }
    };
    
    loadBookDetails();
  }, [book, getBookDetails]);
  
  const navigateToChapter = (chapterNumber: number) => {
    router.push(`/bible/${book}/${chapterNumber}`);
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
            numColumns={5}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chapterButton}
                onPress={() => navigateToChapter(item)}
              >
                <Text style={styles.chapterText}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.chaptersContainer}
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
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.textMain,
    marginBottom: 4,
  },
  bookInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  chaptersContainer: {
    padding: 16,
  },
  chapterButton: {
    width: '20%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    margin: '2%',
  },
  chapterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textMain,
  },
});