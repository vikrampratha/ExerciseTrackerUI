import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  selected: string | null;
  onSelect: (type: string | null) => void;
}

const types = ['PUSH', 'PULL', 'LEGS', 'UPPER', 'LOWER', 'FULL', 'CARDIO'];

const typeColors: Record<string, string> = {
  PUSH: '#E63946',
  PULL: '#457B9D',
  LEGS: '#2A9D8F',
  UPPER: '#F4A261',
  LOWER: '#6A4C93',
  FULL: '#264653',
  CARDIO: '#E9C46A',
};

export default function WorkoutFilterBar({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={{ flexGrow: 0 }}
    >
      {/* ALL Badge */}
      <TouchableOpacity
        style={[
          styles.badge,
          selected === null && styles.activeBadge,
        ]}
        onPress={() => onSelect(null)}
      >
        <Text style={[
          styles.badgeText,
          selected === null && styles.activeBadgeText
        ]}>
          ALL
        </Text>
      </TouchableOpacity>

      {types.map(type => {
        const isActive = selected === type;
        return (
          <TouchableOpacity
            key={type}
            style={[
              styles.badge,
              { borderColor: typeColors[type] },
              isActive && { backgroundColor: typeColors[type] }
            ]}
            onPress={() => onSelect(type)}
          >
            <Text style={[
              styles.badgeText,
              isActive && styles.activeBadgeText
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: '#25292e',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ccc',
    marginRight: 10,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
  activeBadge: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  activeBadgeText: {
    color: '#fff',
  },
});