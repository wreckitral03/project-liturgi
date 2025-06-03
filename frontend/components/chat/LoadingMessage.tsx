import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/utils/theme';

interface LoadingMessageProps {
  isVisible: boolean;
}

const WAITING_MESSAGES = [
  "Sedang mengambil jawabanmu, mohon tunggu sebentar ya! 🙏",
  "Permintaanmu sedang diproses. Terima kasih atas kesabarannya ✨",
  "Sebentar lagi... saya sedang menyiapkan ayat yang tepat untukmu 📖",
  "Terima kasih sudah menunggu! Proses sedang berjalan 💫",
  "Sedang mencari ayat yang sesuai dengan situasimu... 🔍",
  "Hampir selesai! Saya sedang mempersiapkan respons terbaik 💝",
  "Mohon bersabar sebentar, saya sedang merenungkan kata-kata yang tepat 🤲",
  "Sedang menghubungkan dengan kebijaksanaan spiritual... ⭐"
];

const TIPS_AND_ENCOURAGEMENT = [
  "💡 Tip: Cobalah untuk berdoa sejenak sambil menunggu",
  "🌟 Ingat: Tuhan selalu mendengar setiap doa kita",
  "💪 Tetap kuat! Setiap tantangan adalah kesempatan untuk bertumbuh",
  "🕊️ Kedamaian dimulai dari hati yang tenang",
  "📚 Alkitab berisi lebih dari 31.000 ayat penuh kebijaksanaan",
  "🙏 Bersyukur adalah kunci kebahagiaan sejati",
  "✨ Setiap hari adalah kesempatan baru untuk berbuat baik"
];

export default function LoadingMessage({ isVisible }: LoadingMessageProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setCurrentMessageIndex(0);
      setShowTip(false);
      return;
    }

    // Rotate main messages every 2 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % WAITING_MESSAGES.length);
    }, 2000);

    // Show tips after 5 seconds, then rotate every 4 seconds
    const tipTimeout = setTimeout(() => {
      setShowTip(true);
      setCurrentMessageIndex(0); // Reset index for tips
      const tipInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % TIPS_AND_ENCOURAGEMENT.length);
      }, 4000);
      
      return () => clearInterval(tipInterval);
    }, 5000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(tipTimeout);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
        <Text style={styles.messageText}>
          {showTip ? TIPS_AND_ENCOURAGEMENT[currentMessageIndex] : WAITING_MESSAGES[currentMessageIndex]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  messageContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 2,
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  messageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textMain,
    textAlign: 'center',
    lineHeight: 20,
  },
});