import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  date: string;
  type: string;
  expanded: boolean;
  onPress: () => void;
}

const typeColors: Record<string, string> = {
  PUSH: '#FF6B6B',
  PULL: '#4ECDC4',
  LEG: '#FFD93D',
  CARDIO: '#6A4C93',
  UPPER: '#FF9F1C',
  LOWER: '#1B998B',
  FULL: '#2EC4B6',
};

export default function WorkoutHeader({
  date,
  type,
  expanded,
  onPress,
}: Props) {
    const badgeColor = typeColors[type] || '#888';

  return (
    <TouchableOpacity onPress={onPress} style={styles.header} activeOpacity={0.8}>
      <Text style={styles.date}>{date}</Text>

      <View style={styles.rightSection}>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.type}>{type}</Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          style={{ marginLeft: 6 }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff'
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 15,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
});