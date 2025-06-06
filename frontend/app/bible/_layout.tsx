import React, { useState, useEffect } from 'react';
import { Stack, useNavigation, useRouter, usePathname } from 'expo-router';
import { Platform, Pressable, StatusBar as RNStatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Home } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '@/utils/theme';
import { useLocalSearchParams } from 'expo-router';
import { useBible } from '@/hooks/useBible';

export default function BibleLayout() {
  const navigation = useNavigation();
  const router = useRouter();
  const pathname = usePathname();
  const [title, setTitle] = useState('Alkitab');
  
  const { bookId, chapter } = useLocalSearchParams<{ bookId: string, chapter: string }>();
  const { getBookDetails } = useBible();
  
  // Determine if we're on the root Bible screen
  const isRootBibleScreen = pathname === '/bible';
  
  // Enhanced logic for Home button visibility
  const showHomeButton = pathname.includes('/bible/') && pathname !== '/bible';
  
  // Update title based on current screen
  useEffect(() => {
    const updateTitle = async () => {
      if (pathname === '/bible') {
        setTitle('Alkitab');
      } else if (pathname.startsWith('/bible/search')) {
        setTitle('Telusuri Alkitab');
      } else if (bookId && !chapter) {
        // On chapter list screen
        const details = await getBookDetails(bookId);
        if (details) {
          setTitle(details.name);
        }
      } else if (bookId && chapter) {
        // On verse screen
        const details = await getBookDetails(bookId);
        if (details) {
          setTitle(`${details.name} ${chapter}`);
        }
      }
    };
    
    updateTitle();
  }, [pathname, bookId, chapter, getBookDetails]);
  
  const handleBackPress = () => {
    if (isRootBibleScreen) {
      // Explicitly navigate back to tabs
      router.push('/(tabs)');
    } else {
      // Within Bible stack, use navigation.goBack() for consistency with swipe
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        // Fallback: navigate to Bible root
        router.push('/bible');
      }
    }
  };
  
  const navigateToHome = () => {
    router.push('/(tabs)');
  };
  
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <ChevronLeft color="#FFF" size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
          {showHomeButton ? (
            <Pressable style={styles.homeButton} onPress={navigateToHome}>
              <Home color="#FFF" size={22} />
            </Pressable>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
        
        <Stack 
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: COLORS.background }
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="[bookId]" />
          <Stack.Screen name="[bookId]/[chapter]" />
          <Stack.Screen name="search" />
        </Stack>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...Platform.select({
      android: {
        paddingTop: RNStatusBar.currentHeight,
      },
    }),
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
});