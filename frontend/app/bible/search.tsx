import { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { BibleContext } from '@/contexts/BibleContext';
import { COLORS } from '@/utils/theme';

export default function SearchScreen() {
  const router = useRouter();
  const { searchBible, isSearching } = useContext(BibleContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    Keyboard.dismiss();
    const results = await searchBible(searchQuery);
    setSearchResults(results);
    setHasSearched(true);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };
  
  const navigateToVerse = (bookId: string, chapter: number) => {
    router.push(`/bible/${bookId}/${chapter}`);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Telusuri Alkitab..."
            placeholderTextColor="#9E9E9E"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.searchButton,
            !searchQuery.trim() && styles.searchButtonDisabled
          ]}
          onPress={handleSearch}
          disabled={!searchQuery.trim() || isSearching}
        >
          <Text 
            style={[
              styles.searchButtonText,
              !searchQuery.trim() && styles.searchButtonTextDisabled
            ]}
          >
            Cari
          </Text>
        </TouchableOpacity>
      </View>
      
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Mencari...</Text>
        </View>
      ) : (
        <>
          {hasSearched && searchResults.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                Tidak ditemukan hasil untuk "{searchQuery}"
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => `result-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => navigateToVerse(item.bookId, item.chapter)}
                >
                  <Text style={styles.resultReference}>
                    {item.bookName} {item.chapter}:{item.verse}
                  </Text>
                  <Text style={styles.resultText} numberOfLines={2}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.resultsContainer}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListHeaderComponent={
                searchResults.length > 0 ? (
                  <View style={styles.resultsHeader}>
                    <Text style={styles.resultsCount}>
                      {searchResults.length} hasil ditemukan
                    </Text>
                  </View>
                ) : null
              }
            />
          )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMain,
  },
  searchButton: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  searchButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  searchButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFF',
  },
  searchButtonTextDisabled: {
    color: '#F5F5F5',
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
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  resultsContainer: {
    padding: 16,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  resultItem: {
    paddingVertical: 16,
  },
  resultReference: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 8,
  },
  resultText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textMain,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});