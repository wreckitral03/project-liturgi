import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { COLORS } from '@/utils/theme';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <SafeAreaView style={{ backgroundColor: COLORS.primary, flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kebijakan Privasi</Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.lastUpdated}>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</Text>
            
            <Text style={styles.sectionTitle}>1. Informasi yang Kami Kumpulkan</Text>
            <Text style={styles.paragraph}>
              Aplikasi Liturgi mengumpulkan informasi berikut untuk memberikan layanan terbaik:
            </Text>
            <Text style={styles.bulletPoint}>• Informasi akun: nama, email, dan kata sandi</Text>
            <Text style={styles.bulletPoint}>• Data penggunaan: riwayat bacaan, preferensi, dan aktivitas dalam aplikasi</Text>
            <Text style={styles.bulletPoint}>• Informasi perangkat: jenis perangkat, sistem operasi, dan pengidentifikasi unik</Text>

            <Text style={styles.sectionTitle}>2. Bagaimana Kami Menggunakan Informasi</Text>
            <Text style={styles.paragraph}>
              Informasi yang dikumpulkan digunakan untuk:
            </Text>
            <Text style={styles.bulletPoint}>• Menyediakan dan memelihara layanan aplikasi</Text>
            <Text style={styles.bulletPoint}>• Mempersonalisasi pengalaman pengguna</Text>
            <Text style={styles.bulletPoint}>• Meningkatkan fitur dan fungsionalitas aplikasi</Text>
            <Text style={styles.bulletPoint}>• Memberikan dukungan teknis dan layanan pelanggan</Text>
            <Text style={styles.bulletPoint}>• Mengirim notifikasi penting terkait layanan</Text>

            <Text style={styles.sectionTitle}>3. Berbagi Informasi</Text>
            <Text style={styles.paragraph}>
              Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga, kecuali:
            </Text>
            <Text style={styles.bulletPoint}>• Dengan persetujuan eksplisit dari Anda</Text>
            <Text style={styles.bulletPoint}>• Untuk mematuhi kewajiban hukum</Text>
            <Text style={styles.bulletPoint}>• Untuk melindungi hak, properti, atau keamanan kami dan pengguna lain</Text>

            <Text style={styles.sectionTitle}>4. Keamanan Data</Text>
            <Text style={styles.paragraph}>
              Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Data disimpan dengan enkripsi dan akses dibatasi hanya untuk personel yang berwenang.
            </Text>

            <Text style={styles.sectionTitle}>5. Hak Pengguna</Text>
            <Text style={styles.paragraph}>
              Anda memiliki hak untuk:
            </Text>
            <Text style={styles.bulletPoint}>• Mengakses dan memperbarui informasi pribadi Anda</Text>
            <Text style={styles.bulletPoint}>• Menghapus akun dan data pribadi Anda</Text>
            <Text style={styles.bulletPoint}>• Membatasi pemrosesan data pribadi Anda</Text>
            <Text style={styles.bulletPoint}>• Meminta salinan data pribadi Anda</Text>

            <Text style={styles.sectionTitle}>6. Penyimpanan Data</Text>
            <Text style={styles.paragraph}>
              Data pribadi Anda akan disimpan selama akun Anda aktif atau seperlunya untuk menyediakan layanan. Setelah penghapusan akun, data akan dihapus dalam waktu 30 hari, kecuali diwajibkan oleh hukum untuk menyimpannya lebih lama.
            </Text>

            <Text style={styles.sectionTitle}>7. Perubahan Kebijakan</Text>
            <Text style={styles.paragraph}>
              Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diberitahukan melalui aplikasi atau email. Penggunaan berkelanjutan setelah perubahan menunjukkan persetujuan Anda terhadap kebijakan yang diperbarui.
            </Text>

            <Text style={styles.sectionTitle}>8. Hubungi Kami</Text>
            <Text style={styles.paragraph}>
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di:
            </Text>
            <Text style={styles.contactInfo}>Email: privacy@liturgi-app.com</Text>
            <Text style={styles.contactInfo}>Alamat: Jakarta, Indonesia</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
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
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  lastUpdated: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textMain,
    marginTop: 20,
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMain,
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletPoint: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMain,
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 8,
  },
  contactInfo: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 4,
  },
});