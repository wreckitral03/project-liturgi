import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { COLORS } from '@/utils/theme';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Apa itu aplikasi Liturgi?",
    answer: "Aplikasi Liturgi adalah platform digital yang menyediakan bacaan harian, liturgi Katolik, fitur chat AI untuk diskusi spiritual, dan berbagai fitur untuk mendukung kehidupan rohani Anda sehari-hari."
  },
  {
    question: "Apakah aplikasi ini gratis?",
    answer: "Ya, aplikasi Liturgi dapat diunduh dan digunakan secara gratis. Namun, kami menerima donasi sukarela untuk mendukung pengembangan dan pemeliharaan aplikasi."
  },
  {
    question: "Bagaimana cara membuat akun?",
    answer: "Anda dapat membuat akun dengan mengetuk tombol 'Masuk/Daftar' di halaman profil, kemudian pilih 'Daftar' dan isi informasi yang diperlukan seperti nama, email, dan kata sandi."
  },
  {
    question: "Apakah saya perlu koneksi internet untuk menggunakan aplikasi?",
    answer: "Sebagian besar fitur memerlukan koneksi internet. Namun, fitur Alkitab offline akan segera tersedia yang memungkinkan Anda membaca Alkitab tanpa koneksi internet."
  },
  {
    question: "Bagaimana cara menggunakan fitur chat AI?",
    answer: "Buka tab 'Chat' di bagian bawah aplikasi, kemudian ketik pertanyaan atau topik spiritual yang ingin Anda diskusikan. AI akan memberikan respons berdasarkan perspektif Kristen."
  },
  {
    question: "Apa itu fitur ringkasan harian?",
    answer: "Fitur ringkasan harian memberikan refleksi spiritual berdasarkan bacaan liturgi hari itu, beserta checklist aktivitas spiritual yang dapat Anda lakukan untuk memperdalam iman."
  },
  {
    question: "Bagaimana cara mengubah informasi profil saya?",
    answer: "Saat ini fitur edit profil sedang dalam pengembangan. Untuk mengubah informasi akun, silakan hubungi tim dukungan kami melalui email."
  },
  {
    question: "Apakah data pribadi saya aman?",
    answer: "Ya, kami sangat serius dalam melindungi privasi Anda. Data pribadi dienkripsi dan disimpan dengan aman. Silakan baca Kebijakan Privasi kami untuk informasi lebih detail."
  },
  {
    question: "Bagaimana cara menghapus akun saya?",
    answer: "Untuk menghapus akun, silakan hubungi tim dukungan kami di support@liturgi-app.com. Kami akan memproses permintaan Anda dalam waktu 7 hari kerja."
  },
  {
    question: "Aplikasi tidak berfungsi dengan baik, apa yang harus saya lakukan?",
    answer: "Coba tutup dan buka kembali aplikasi. Jika masalah berlanjut, pastikan Anda menggunakan versi terbaru aplikasi. Jika masih bermasalah, hubungi tim dukungan kami."
  },
  {
    question: "Bagaimana cara memberikan donasi?",
    answer: "Anda dapat memberikan donasi melalui transfer bank ke rekening BCA 1234567890 a.n. Ricky Rahadian. Detail lengkap tersedia di halaman profil aplikasi."
  },
  {
    question: "Apakah aplikasi ini tersedia untuk iOS?",
    answer: "Saat ini aplikasi tersedia untuk Android dan iOS melalui Expo. Kami sedang mengembangkan versi native untuk kedua platform."
  },
  {
    question: "Bagaimana cara melaporkan bug atau memberikan saran?",
    answer: "Kami sangat menghargai feedback Anda! Silakan kirim laporan bug atau saran ke feedback@liturgi-app.com atau hubungi kami melalui media sosial."
  },
  {
    question: "Apakah konten dalam aplikasi sesuai dengan ajaran Kristen?",
    answer: "Ya, semua konten telah direview oleh tim teologi kami untuk memastikan kesesuaian dengan ajaran Kristen yang ortodoks dan dapat dipertanggungjawabkan secara biblika."
  }
];

export default function FAQScreen() {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <SafeAreaView style={{ backgroundColor: COLORS.primary, flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pertanyaan Umum (FAQ)</Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introSection}>
            <Text style={styles.introText}>
              Temukan jawaban untuk pertanyaan yang sering diajukan tentang aplikasi Liturgi. Jika Anda tidak menemukan jawaban yang Anda cari, jangan ragu untuk menghubungi tim dukungan kami.
            </Text>
          </View>

          {faqData.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.questionContainer}
                onPress={() => toggleExpanded(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.question}>{item.question}</Text>
                {expandedItems.includes(index) ? (
                  <ChevronUp size={20} color={COLORS.primary} />
                ) : (
                  <ChevronDown size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
              
              {expandedItems.includes(index) && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Masih ada pertanyaan?</Text>
            <Text style={styles.contactText}>
              Jika Anda tidak menemukan jawaban yang Anda cari, silakan hubungi tim dukungan kami:
            </Text>
            <Text style={styles.contactInfo}>Email: support@liturgi-app.com</Text>
            <Text style={styles.contactInfo}>Waktu respons: 1-2 hari kerja</Text>
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
  introSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  introText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMain,
    lineHeight: 20,
    textAlign: 'center',
  },
  faqItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  question: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: COLORS.textMain,
    flex: 1,
    marginRight: 12,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  answer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMain,
    lineHeight: 20,
    marginTop: 12,
  },
  contactSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  contactTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textMain,
    marginBottom: 8,
    textAlign: 'center',
  },
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMain,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  contactInfo: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
});