import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Book as BookIcon, ChevronRight } from 'lucide-react-native';
import { useBible } from '@/hooks/useBible';
import { COLORS } from '@/utils/theme';

export default function BibleScreen() {
  const router = useRouter();
  const { books, isLoading } = useBible();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState(books);
  
  useEffect(() => {
    if (books) {
      setFilteredBooks(
        books.filter(book => 
          book.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, books]);

  const navigateToBook = (bookId: string) => {
    router.push(`/bible/${bookId}`);
  };
  
  const navigateToSearch = () => {
    router.push('/bible/search');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={navigateToSearch}
        >
          <Search size={20} color={COLORS.textMuted} />
          <Text style={styles.searchText}>Telusuri Alkitab...</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat daftar kitab...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.bookItem}
              onPress={() => navigateToBook(item.id)}
            >
              <View style={styles.bookInfo}>
                <BookIcon size={20} color={COLORS.primary} />
                <Text style={styles.bookName}>{item.name}</Text>
              </View>
              <ChevronRight size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchText: {
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMuted,
  },
  listContent: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  bookInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookName: {
    marginLeft: 12,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textMain,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
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
  },
});