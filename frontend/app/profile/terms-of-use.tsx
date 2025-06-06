import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { COLORS } from '@/utils/theme';

export default function TermsOfUseScreen() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <SafeAreaView style={{ backgroundColor: COLORS.primary, flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Syarat dan Ketentuan</Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.lastUpdated}>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</Text>
            
            <Text style={styles.sectionTitle}>1. Penerimaan Syarat</Text>
            <Text style={styles.paragraph}>
              Dengan mengunduh, menginstal, atau menggunakan aplikasi Liturgi, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan syarat ini, harap jangan gunakan aplikasi ini.
            </Text>

            <Text style={styles.sectionTitle}>2. Deskripsi Layanan</Text>
            <Text style={styles.paragraph}>
              Aplikasi Liturgi adalah platform digital yang menyediakan:
            </Text>
            <Text style={styles.bulletPoint}>• Bacaan harian dan liturgi Katolik</Text>
            <Text style={styles.bulletPoint}>• Fitur chat dengan AI untuk diskusi spiritual</Text>
            <Text style={styles.bulletPoint}>• Ringkasan dan refleksi harian</Text>
            <Text style={styles.bulletPoint}>• Akses offline ke konten Alkitab</Text>
            <Text style={styles.bulletPoint}>• Fitur checklist untuk aktivitas spiritual</Text>

            <Text style={styles.sectionTitle}>3. Akun Pengguna</Text>
            <Text style={styles.paragraph}>
              Untuk menggunakan fitur tertentu, Anda perlu membuat akun dengan memberikan informasi yang akurat dan lengkap. Anda bertanggung jawab untuk:
            </Text>
            <Text style={styles.bulletPoint}>• Menjaga kerahasiaan kata sandi akun Anda</Text>
            <Text style={styles.bulletPoint}>• Semua aktivitas yang terjadi di bawah akun Anda</Text>
            <Text style={styles.bulletPoint}>• Memberitahu kami segera jika terjadi penggunaan tidak sah</Text>

            <Text style={styles.sectionTitle}>4. Penggunaan yang Dapat Diterima</Text>
            <Text style={styles.paragraph}>
              Anda setuju untuk menggunakan aplikasi ini hanya untuk tujuan yang sah dan sesuai dengan nilai-nilai Katolik. Anda tidak boleh:
            </Text>
            <Text style={styles.bulletPoint}>• Menggunakan aplikasi untuk tujuan ilegal atau tidak etis</Text>
            <Text style={styles.bulletPoint}>• Mengganggu atau merusak fungsi aplikasi</Text>
            <Text style={styles.bulletPoint}>• Menyebarkan konten yang menyinggung, cabul, atau tidak pantas</Text>
            <Text style={styles.bulletPoint}>• Melanggar hak kekayaan intelektual pihak lain</Text>
            <Text style={styles.bulletPoint}>• Menggunakan aplikasi untuk spam atau aktivitas komersial tanpa izin</Text>

            <Text style={styles.sectionTitle}>5. Konten dan Hak Kekayaan Intelektual</Text>
            <Text style={styles.paragraph}>
              Semua konten dalam aplikasi, termasuk teks, gambar, audio, dan video, dilindungi oleh hak cipta dan hak kekayaan intelektual lainnya. Anda dapat menggunakan konten untuk keperluan pribadi dan non-komersial.
            </Text>

            <Text style={styles.sectionTitle}>6. Privasi dan Data</Text>
            <Text style={styles.paragraph}>
              Penggunaan data pribadi Anda diatur oleh Kebijakan Privasi kami. Dengan menggunakan aplikasi ini, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan tersebut.
            </Text>

            <Text style={styles.sectionTitle}>7. Pembatasan Tanggung Jawab</Text>
            <Text style={styles.paragraph}>
              Aplikasi ini disediakan "sebagaimana adanya" tanpa jaminan apa pun. Kami tidak bertanggung jawab atas:
            </Text>
            <Text style={styles.bulletPoint}>• Gangguan layanan atau downtime</Text>
            <Text style={styles.bulletPoint}>• Kehilangan data atau informasi</Text>
            <Text style={styles.bulletPoint}>• Kerusakan yang timbul dari penggunaan aplikasi</Text>
            <Text style={styles.bulletPoint}>• Konten dari pihak ketiga</Text>

            <Text style={styles.sectionTitle}>8. Penghentian Layanan</Text>
            <Text style={styles.paragraph}>
              Kami berhak menghentikan atau menangguhkan akses Anda ke aplikasi kapan saja, dengan atau tanpa pemberitahuan, jika Anda melanggar syarat dan ketentuan ini.
            </Text>

            <Text style={styles.sectionTitle}>9. Perubahan Syarat</Text>
            <Text style={styles.paragraph}>
              Kami dapat mengubah syarat dan ketentuan ini kapan saja. Perubahan akan diberitahukan melalui aplikasi. Penggunaan berkelanjutan setelah perubahan menunjukkan persetujuan Anda.
            </Text>

            <Text style={styles.sectionTitle}>10. Hukum yang Berlaku</Text>
            <Text style={styles.paragraph}>
              Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui pengadilan yang berwenang di Jakarta.
            </Text>

            <Text style={styles.sectionTitle}>11. Kontak</Text>
            <Text style={styles.paragraph}>
              Untuk pertanyaan tentang syarat dan ketentuan ini, hubungi kami di:
            </Text>
            <Text style={styles.contactInfo}>Email: legal@liturgi-app.com</Text>
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