import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLORS } from '@/utils/theme';

interface ReadingSectionProps {
  icon: string;
  title: string;
  reference: string;
  content: string;
  isFirst?: boolean;
}

export default function ReadingSection({ icon, title, reference, content, isFirst }: ReadingSectionProps) {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <View style={[styles.container, isFirst && { marginTop: 0 }]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.reference}>{reference}</Text>
        </View>
        <TouchableOpacity onPress={toggleExpanded}>
          {expanded 
            ? <ChevronUp size={24} color={COLORS.textMuted} />
            : <ChevronDown size={24} color={COLORS.textMuted} />
          }
        </TouchableOpacity>
      </View>
      
      {expanded && (
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{content}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textMain,
    marginBottom: 4,
  },
  reference: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  content: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textMain,
  },
});