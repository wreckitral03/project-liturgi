import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Modal, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Add more icons to your existing import
import { 
  Download, LogOut, ChevronRight, CircleCheck as CheckCircle, 
  User as UserIcon, Heart, FileText, HelpCircle, Shield, Users,
  Crown, Glasses, UserCheck, Baby, Smile, Star, Award, Copy
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useBible } from '@/hooks/useBible';
import { COLORS } from '@/utils/theme';

// Add the AgeCategory enum and helper function at the top level
export enum AgeCategory {
  TEEN_YOUTH = 'TEEN_YOUTH',
  YOUNG_ADULT = 'YOUNG_ADULT', 
  ADULT = 'ADULT',
  SENIOR = 'SENIOR'
}

const getAgeCategoryLabel = (category: AgeCategory): string => {
  switch (category) {
    case AgeCategory.TEEN_YOUTH:
      return 'Remaja (13-17 tahun)';
    case AgeCategory.YOUNG_ADULT:
      return 'Dewasa Muda (18-35 tahun)';
    case AgeCategory.ADULT:
      return 'Dewasa (36-59 tahun)';
    case AgeCategory.SENIOR:
      return 'Senior (60+ tahun)';
    default:
      return category;
  }
};

export default function ProfileScreen() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isBibleDownloaded, downloadBible, isDownloading } = useBible();
  const router = useRouter();
  
  // Add modal state
  const [showBankDetails, setShowBankDetails] = useState(false);
  
  const handleLogout = () => {
    console.log('HANDLE LOGOUT CLICKED');
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Logout",
          onPress: () => {
            console.log('ALERT LOGOUT CONFIRMED');
            doLogout();
          }
        }
      ]
    );
  };

  const doLogout = async () => {
    console.log('DO LOGOUT CALLED');
    await logout();
    Alert.alert("Sukses", "Anda telah keluar.");
  };

  // Updated: Show "coming soon" alert instead of download
  const handleDownloadBible = async () => {
    Alert.alert(
      "Segera Hadir",
      "Fitur akan segera tersedia",
      [{ text: "OK" }]
    );
  };

  const handlePrivacyPolicy = () => {
    router.push('/profile/privacy-policy');
  };

  const handleTermsOfUse = () => {
    router.push('/profile/terms-of-use');
  };

  const handleFAQ = () => {
    router.push('/profile/faq');
  };

  const handleContributors = () => {
    router.push('/profile/contributors');
  };

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <SafeAreaView style={{ backgroundColor: COLORS.primary, flex: 1 }} edges={['top']}>
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
              {/* Add age category display */}
              {isAuthenticated && user?.ageCategory && (
                <Text style={styles.profileAgeCategory}>
                  {getAgeCategoryLabel(user.ageCategory as AgeCategory)}
                </Text>
              )}
            </View>
          </View>

          {/* Updated: Alkitab Offline Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alkitab Offline</Text>
            <TouchableOpacity
              style={[styles.downloadButton, styles.disabledButton]}
              onPress={handleDownloadBible}
            >
              <View style={styles.downloadButtonContent}>
                <Download size={24} color={COLORS.textMuted} />
                <Text style={[styles.downloadButtonText, styles.downloadButtonTextDisabled]}>
                  Alkitab Offline (Segera Hadir)
                </Text>
              </View>
              <ChevronRight size={18} color="#9E9E9E" />
            </TouchableOpacity>
          </View>

          {/* Updated: Donation Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dukung Aplikasi Ini</Text>
            <View style={styles.donationContent}>
              <View style={styles.donationHeader}>
                <Heart size={24} color={COLORS.primary} />
                <Text style={styles.donationDescription}>
                  Jika aplikasi ini memberkati Anda, dukung pengembangan lebih lanjut.
                </Text>
              </View>
              
              {/* Support Button instead of direct bank details */}
              <TouchableOpacity 
                style={styles.supportButton}
                onPress={() => setShowBankDetails(true)}
              >
                <Text style={styles.supportButtonText}>💝 Dukung Sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Bank Details Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showBankDetails}
            onRequestClose={() => setShowBankDetails(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Detail Donasi</Text>
                  <TouchableOpacity 
                    onPress={() => setShowBankDetails(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.bankDetailsModal}>
                  <Text style={styles.modalDescription}>
                    Terima kasih atas dukungan Anda! 🙏
                  </Text>
                  
                  <View style={styles.bankInfo}>
                    <Text style={styles.bankDetailsTitle}>Detail Transfer</Text>
                    <View style={styles.bankDetailRow}>
                      <Text style={styles.bankLabel}>Bank:</Text>
                      <Text style={styles.bankValue}>BCA</Text>
                    </View>
                    <View style={styles.bankDetailRow}>
                      <Text style={styles.bankLabel}>No Rek:</Text>
                      <Text style={styles.bankValue}>6600398758</Text>
                    </View>
                    <View style={styles.bankDetailRow}>
                      <Text style={styles.bankLabel}>Atas Nama:</Text>
                      <Text style={styles.bankValue}>Ricky Alexander</Text>
                    </View>
                    <View style={styles.bankDetailRow}>
                      <Text style={styles.bankLabel}>Catatan:</Text>
                      <Text style={styles.bankValue}>Liturgi App</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.modalFooter}>
                    Setiap dukungan sangat berarti untuk pengembangan aplikasi ini 💙
                  </Text>
                </View>
              </View>
            </View>
          </Modal>

          {/* New: Legal Links Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informasi Legal</Text>
            
            <TouchableOpacity style={styles.legalButton} onPress={handlePrivacyPolicy}>
              <View style={styles.legalButtonContent}>
                <Shield size={20} color={COLORS.primary} />
                <Text style={styles.legalButtonText}>Privacy Policy</Text>
              </View>
              <ChevronRight size={18} color="#9E9E9E" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.legalButton} onPress={handleTermsOfUse}>
              <View style={styles.legalButtonContent}>
                <FileText size={20} color={COLORS.primary} />
                <Text style={styles.legalButtonText}>Terms of Use</Text>
              </View>
              <ChevronRight size={18} color="#9E9E9E" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.legalButton} onPress={handleFAQ}>
              <View style={styles.legalButtonContent}>
                <HelpCircle size={20} color={COLORS.primary} />
                <Text style={styles.legalButtonText}>FAQ</Text>
              </View>
              <ChevronRight size={18} color="#9E9E9E" />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.legalButton, styles.lastLegalButton]} onPress={handleContributors}>
              <View style={styles.legalButtonContent}>
                <Users size={20} color={COLORS.primary} />
                <Text style={styles.legalButtonText}>Contributors</Text>
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
  disabledButton: {
    opacity: 0.6,
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
  // New: Donation styles
  donationContent: {
    paddingVertical: 8,
  },
  donationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  donationDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMain,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  bankDetails: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  bankDetailsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textMain,
    marginBottom: 4,
  },
  bankDetailsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMain,
    marginBottom: 2,
  },
  // New: Legal button styles
  legalButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastLegalButton: {
    borderBottomWidth: 0,
  },
  legalButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legalButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMain,
    marginLeft: 12,
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
  supportButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  supportButtonText: {
    color: '#FFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: COLORS.textMain,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  bankDetailsModal: {
    padding: 20,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 24,
  },
  bankInfo: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bankLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.textMuted,
    flex: 1,
  },
  bankValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.textMain,
    flex: 2,
    textAlign: 'right',
  },
  modalFooter: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});

// Alternative icon mapping
const getAvatarIcon = (ageCategory?: string) => {
  if (!ageCategory) return UserIcon; // Default icon
  
  switch (ageCategory as AgeCategory) {
    case AgeCategory.TEEN_YOUTH:
      return Heart; // Heart for youth energy
    case AgeCategory.YOUNG_ADULT:
      return UserIcon; // Standard user icon
    case AgeCategory.ADULT:
      return Users; // Users icon for established adults
    case AgeCategory.SENIOR:
      return Crown; // Crown for wisdom/seniority
    default:
      return UserIcon;
  }
};

// Add this function in your ProfileScreen component
const copyToClipboard = async (text: string, label: string) => {
  try {
    await Clipboard.setStringAsync(text);
    Alert.alert('Berhasil!', `${label} telah disalin ke clipboard`);
  } catch (error) {
    Alert.alert('Error', 'Gagal menyalin ke clipboard');
  }
};

<View style={styles.bankDetailRow}>
  <Text style={styles.bankLabel}>No. Rekening:</Text>
  <View style={styles.bankValueContainer}>
    <Text style={styles.bankValue}>6600398758</Text>
    <TouchableOpacity 
      onPress={() => copyToClipboard('6600398758', 'Nomor rekening')}
      style={styles.copyButton}
    >
      <Copy size={16} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
</View>
