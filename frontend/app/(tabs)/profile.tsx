import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download, LogOut, ChevronRight, CircleCheck as CheckCircle, User as UserIcon } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';
import { useBible } from '@/hooks/useBible';
import { COLORS } from '@/utils/theme';

export default function ProfileScreen() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isBibleDownloaded, downloadBible, isDownloading } = useBible();
  
  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah anda yakin ingin keluar?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => logout()
        }
      ]
    );
  };
  
  const handleDownloadBible = async () => {
    if (!isBibleDownloaded && !isDownloading) {
      try {
        Alert.alert(
          "Unduh Alkitab",
          "Anda akan mengunduh Alkitab untuk digunakan secara offline. Proses ini membutuhkan koneksi internet dan sekitar 5MB ruang penyimpanan.",
          [
            {
              text: "Batal",
              style: "cancel"
            },
            { 
              text: "Unduh", 
              onPress: async () => {
                try {
                  await downloadBible();
                  Alert.alert(
                    "Berhasil",
                    "Alkitab berhasil diunduh dan siap digunakan secara offline.",
                    [{ text: "OK" }]
                  );
                } catch (error) {
                  Alert.alert(
                    "Gagal",
                    "Terjadi kesalahan saat mengunduh Alkitab. Silakan coba lagi.",
                    [{ text: "OK" }]
                  );
                }
              }
            }
          ]
        );
      } catch (error) {
        Alert.alert(
          "Error",
          "Terjadi kesalahan saat mengunduh Alkitab",
          [{ text: "OK" }]
        );
      }
    }
  };
  
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <UserIcon size={40} color={COLORS.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {isAuthenticated ? user?.name || 'Pengguna' : 'Tamu'}
              </Text>
              <Text style={styles.profileEmail}>
                {isAuthenticated ? user?.email || 'email@example.com' : 'Silahkan login untuk mengakses fitur tambahan'}
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alkitab Offline</Text>
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={handleDownloadBible}
              disabled={isBibleDownloaded || isDownloading}
            >
              <View style={styles.downloadButtonContent}>
                {isBibleDownloaded ? (
                  <CheckCircle size={24} color={COLORS.success} />
                ) : (
                  <Download size={24} color={isDownloading ? COLORS.textMuted : COLORS.primary} />
                )}
                <Text style={[
                  styles.downloadButtonText,
                  (isBibleDownloaded || isDownloading) && styles.downloadButtonTextDisabled
                ]}>
                  {isBibleDownloaded 
                    ? "Alkitab tersedia offline" 
                    : isDownloading 
                      ? "Mengunduh..." 
                      : "Unduh Alkitab untuk Akses Offline"}
                </Text>
              </View>
              <ChevronRight size={18} color="#9E9E9E" />
            </TouchableOpacity>
          </View>
          
          {isAuthenticated && (
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color={COLORS.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
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
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textMain,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textMain,
    marginBottom: 16,
  },
  downloadButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  downloadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMain,
    marginLeft: 16,
  },
  downloadButtonTextDisabled: {
    color: COLORS.textMuted,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.error,
    marginLeft: 8,
  },
});