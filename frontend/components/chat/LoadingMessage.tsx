import { MotiView, MotiText } from 'moti'
import { Easing } from 'react-native-reanimated'
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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

// Calculate dynamic timing based on message length
const getMessageDuration = (message: string) => {
  const baseTime = 3000; // 3 seconds minimum
  const extraTime = Math.min(message.length * 50, 3000); // Max 3 extra seconds
  return baseTime + extraTime;
};

export default function LoadingMessage({ isVisible }: LoadingMessageProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [messageKey, setMessageKey] = useState(0); // For triggering text animations

  useEffect(() => {
    if (!isVisible) {
      setCurrentMessageIndex(0);
      setShowTip(false);
      setMessageKey(0);
      return;
    }

    let messageInterval: NodeJS.Timeout;
    let tipTimeout: NodeJS.Timeout;
    let tipInterval: NodeJS.Timeout;

    // Dynamic timing for main messages
    const rotateMessages = () => {
      const currentMessage = WAITING_MESSAGES[currentMessageIndex];
      const duration = getMessageDuration(currentMessage);
      
      messageInterval = setTimeout(() => {
        setCurrentMessageIndex((prev) => {
          const nextIndex = (prev + 1) % WAITING_MESSAGES.length;
          setMessageKey(prev => prev + 1); // Trigger animation
          return nextIndex;
        });
        rotateMessages(); // Schedule next rotation
      }, duration);
    };

    rotateMessages();

    // Show tips after 8 seconds, then rotate every 5 seconds
    tipTimeout = setTimeout(() => {
      setShowTip(true);
      setCurrentMessageIndex(0);
      setMessageKey(prev => prev + 1);
      
      tipInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => {
          const nextIndex = (prev + 1) % TIPS_AND_ENCOURAGEMENT.length;
          setMessageKey(prev => prev + 1);
          return nextIndex;
        });
      }, 5000);
    }, 8000);

    return () => {
      clearTimeout(messageInterval);
      clearTimeout(tipTimeout);
      clearInterval(tipInterval);
    };
  }, [isVisible, currentMessageIndex]);

  if (!isVisible) return null;

  const currentMessage = showTip 
    ? TIPS_AND_ENCOURAGEMENT[currentMessageIndex] 
    : WAITING_MESSAGES[currentMessageIndex];

  return (
    <MotiView
      style={styles.container}
      from={{
        opacity: 0,
        translateY: 20,
        scale: 0.95
      }}
      animate={{
        opacity: 1,
        translateY: 0,
        scale: 1
      }}
      exit={{
        opacity: 0,
        translateY: -10,
        scale: 0.95
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
        duration: 600
      }}
    >
      <View style={styles.messageContainer}>
        {/* Animated Loading Dots */}
        <View style={styles.loadingDots}>
          {[0, 1, 2].map((index) => (
            <MotiView
              key={index}
              style={styles.dot}
              from={{
                scale: 0.8,
                opacity: 0.4
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                type: 'timing',
                duration: 1200,
                easing: Easing.inOut(Easing.ease),
                loop: true,
                delay: index * 200, // Staggered animation
                repeatReverse: false
              }}
            />
          ))}
        </View>

        {/* Animated Message Text */}
        <MotiText
          key={messageKey} // Force re-mount for animation
          style={styles.messageText}
          from={{
            opacity: 0,
            translateY: 10,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            translateY: 0,
            scale: 1
          }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 200,
            duration: 400
          }}
        >
          {currentMessage}
        </MotiText>
      </View>
    </MotiView>
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
    marginHorizontal: 3,
  },
  messageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textMain,
    textAlign: 'center',
    lineHeight: 20,
  },
});