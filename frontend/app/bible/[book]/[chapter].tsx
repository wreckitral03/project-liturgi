import { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Platform,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Share as ShareIcon } from 'lucide-react-native';
import { useBible } from '@/hooks/useBible';
import { COLORS, FONTS } from '@/utils/theme';

export default function ChapterScreen() {
  const { book, chapter } = useLocalSearchParams<{ book: string, chapter: string }>();
  const router = useRouter();
  const { getChapterContent, getBookDetails, isLoading } = useBible();
  const [chapterContent, setChapterContent] = useState<any>(null);
  const [bookDetails, setBookDetails] = useState<any>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    const loadChapterContent = async () => {
      if (book && chapter) {
        const content = await getChapterContent(book, parseInt(chapter));
        setChapterContent(content);
        
        const details = await getBookDetails(book);
        setBookDetails(details);
      }
    };
    
    loadChapterContent();
  }, [book, chapter, getChapterContent, getBookDetails]);
  
  const navigateToChapter = (chapterNumber: number) => {
    router.push(`/bible/${book}/${chapterNumber}`);
    // Scroll to top when navigating
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };
  
  const hasPreviousChapter = bookDetails && parseInt(chapter) > 1;
  const hasNextChapter = bookDetails && parseInt(chapter) < bookDetails.chapters.length;
  
  const shareVerse = async (verse: any) => {
    try {
      await Share.share({
        message: `${bookDetails.name} ${chapter}:${verse.number} - "${verse.text}" (Alkitab)`,
      });
    } catch (error) {
      console.error('Error sharing verse:', error);
    }
  };

  // Calculate header opacity based on scroll position
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  return (
    <View style={styles.container}>
      {isLoading || !chapterContent || !bookDetails ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat Pasal...</Text>
        </View>
      ) : (
        <>
          <Animated.View style={[styles.chapterHeader, { opacity: headerOpacity }]}>
            <Text style={styles.chapterTitle}>
              {bookDetails.name} {chapter}
            </Text>
          </Animated.View>
          
          <Animated.FlatList
            ref={flatListRef}
            data={chapterContent.verses}
            keyExtractor={(item) => `verse-${item.number}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.verseContainer}
                onLongPress={() => shareVerse(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.verseNumber}>{item.number}</Text>
                <Text style={styles.verseText}>{item.text}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.versesContainer}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          />
          
          <View style={styles.navigationBar}>
            <TouchableOpacity
              style={[
                styles.navButton,
                !hasPreviousChapter && styles.navButtonDisabled
              ]}
              disabled={!hasPreviousChapter}
              onPress={() => navigateToChapter(parseInt(chapter) - 1)}
            >
              <ChevronLeft 
                size={20} 
                color={hasPreviousChapter ? COLORS.primary : '#BDBDBD'} 
              />
              <Text 
                style={[
                  styles.navText, 
                  !hasPreviousChapter && styles.navTextDisabled
                ]}
              >
                Sebelumnya
              </Text>
            </TouchableOpacity>
            
            <View style={styles.chapterIndicator}>
              <Text style={styles.chapterNumber}>{chapter}</Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.navButton,
                !hasNextChapter && styles.navButtonDisabled
              ]}
              disabled={!hasNextChapter}
              onPress={() => navigateToChapter(parseInt(chapter) + 1)}
            >
              <Text 
                style={[
                  styles.navText, 
                  !hasNextChapter && styles.navTextDisabled
                ]}
              >
                Selanjutnya
              </Text>
              <ChevronRight 
                size={20} 
                color={hasNextChapter ? COLORS.primary : '#BDBDBD'} 
              />
            </TouchableOpacity>
          </View>
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
  chapterHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  chapterTitle: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    color: COLORS.textMain,
    textAlign: 'center',
  },
  versesContainer: {
    padding: 16,
    paddingTop: 72,
    paddingBottom: 100,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: 4,
  },
  verseNumber: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    color: COLORS.accent,
    marginRight: 12,
    width: 28,
    textAlign: 'right',
  },
  verseText: {
    fontFamily: FONTS.body,
    fontSize: 18,
    lineHeight: 28,
    color: COLORS.textMain,
    flex: 1,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        paddingBottom: 28,
      },
    }),
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: COLORS.primary,
    marginHorizontal: 4,
  },
  navTextDisabled: {
    color: '#BDBDBD',
  },
  chapterIndicator: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chapterNumber: {
    fontFamily: FONTS.headingMedium,
    fontSize: 16,
    color: COLORS.textMain,
  },
});