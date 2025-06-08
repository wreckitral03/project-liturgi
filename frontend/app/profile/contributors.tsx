import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Linkedin } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { COLORS } from '@/utils/theme';

interface Contributor {
  id: string;
  name: string;
  photo: string;
  linkedin: string;
  contribution: string;
}

const contributorsData: Contributor[] = [
  {
    id: '1',
    name: 'Ricky Alexander',
    photo: 'https://via.placeholder.com/80x80/4A90E2/FFFFFF?text=RA',
    linkedin: 'https://linkedin.com/in/rickyalexander',
    contribution: 'Lead Developer & Project Founder - Developed the core application architecture and spiritual content integration'
  },
  {
    id: '2',
    name: 'Maria Santos',
    photo: 'https://via.placeholder.com/80x80/7B68EE/FFFFFF?text=MS',
    linkedin: 'https://linkedin.com/in/mariasantos',
    contribution: 'UI/UX Designer - Designed the user interface and user experience for spiritual engagement'
  },
  {
    id: '3',
    name: 'Father John Paul',
    photo: 'https://via.placeholder.com/80x80/32CD32/FFFFFF?text=JP',
    linkedin: 'https://linkedin.com/in/fatherjohnpaul',
    contribution: 'Spiritual Advisor - Provided theological guidance and liturgical content validation'
  },
  {
    id: '4',
    name: 'Sarah Chen',
    photo: 'https://via.placeholder.com/80x80/FF6347/FFFFFF?text=SC',
    linkedin: 'https://linkedin.com/in/sarahchen',
    contribution: 'Backend Developer - Built the API infrastructure and database architecture'
  },
  {
    id: '5',
    name: 'David Rodriguez',
    photo: 'https://via.placeholder.com/80x80/FFD700/FFFFFF?text=DR',
    linkedin: 'https://linkedin.com/in/davidrodriguez',
    contribution: 'AI Integration Specialist - Implemented the spiritual AI chat functionality'
  }
];

export default function ContributorsScreen() {
  const router = useRouter();

  const handleLinkedInPress = (linkedinUrl: string) => {
    Linking.openURL(linkedinUrl);
  };

  const renderContributor = (contributor: Contributor) => (
    <View key={contributor.id} style={styles.contributorCard}>
      <Image 
        source={{ uri: contributor.photo }} 
        style={styles.contributorPhoto}
        defaultSource={{ uri: 'https://via.placeholder.com/80x80/CCCCCC/FFFFFF?text=?' }}
      />
      <View style={styles.contributorInfo}>
        <View style={styles.contributorHeader}>
          <Text style={styles.contributorName}>{contributor.name}</Text>
          <TouchableOpacity 
            style={styles.linkedinButton}
            onPress={() => handleLinkedInPress(contributor.linkedin)}
          >
            <Linkedin size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.contributorRole}>{contributor.contribution}</Text>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <SafeAreaView style={{ backgroundColor: COLORS.primary, flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contributors</Text>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introSection}>
            <Text style={styles.introTitle}>Tim Pengembang</Text>
            <Text style={styles.introDescription}>
              Aplikasi Liturgi dikembangkan oleh tim yang berdedikasi untuk mendukung kehidupan spiritual umat Kristiani. 
              Terima kasih kepada semua kontributor yang telah memberikan waktu dan keahlian mereka.
            </Text>
          </View>

          <View style={styles.contributorsSection}>
            {contributorsData.map(renderContributor)}
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              Ingin berkontribusi? Hubungi kami di support@liturgi-app.com
            </Text>
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
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  introTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textMain,
    marginBottom: 12,
  },
  introDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  contributorsSection: {
    marginBottom: 24,
  },
  contributorCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  contributorPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  contributorInfo: {
    flex: 1,
  },
  contributorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contributorName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textMain,
    flex: 1,
  },
  linkedinButton: {
    padding: 4,
  },
  contributorRole: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  footerSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});