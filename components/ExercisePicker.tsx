import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, LayoutAnimation, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type ExerciseType = 'STRENGTH' | 'WEIGHTED_STRENGTH' | 'CARDIO';

type ExerciseName = {
  id: number;
  name: string;
  type: ExerciseType;
};

type Props = {
  data: ExerciseName[];
  selected: ExerciseName | null;
  onSelect: (exercise: ExerciseName) => void;
};

export default function ExercisePicker({ data, selected, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [inputText, setInputText] = useState(selected?.name || '');
  const inputRef = useRef<TextInput>(null);

  // Update inputText if selected changes externally
  useEffect(() => {
    if (!expanded) {
      setInputText(selected?.name || '');
    }
  }, [selected, expanded]);

  const filteredData = useMemo(
    () =>
      data.filter((e) =>
        e.name.toLowerCase().includes(inputText.toLowerCase())
      ),
    [inputText, data]
  );

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);

    // Clear text and focus input when expanding
    if (!expanded) {
      setInputText('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleSelect = (item: ExerciseName) => {
    onSelect(item);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(false);
  };

  const handleCollapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(false);

    // Reset input back to selected exercise
    setInputText(selected?.name || '');
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        activeOpacity={expanded ? 1 : 0.7}
        style={styles.selectorRow}
        onPress={toggleExpanded}
      >
        <Feather name="search" size={18} style={styles.leftIcon} />

        {expanded ? (
          <TextInput
            ref={inputRef}
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            placeholder="Search exercises"
            autoFocus
            onBlur={handleCollapse}
          />
        ) : (
          <Text style={[styles.input, !selected && { color: '#999' }]}>
            {selected ? selected.name : 'Select Exercise'}
          </Text>
        )}

        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          style={styles.rightIcon}
        />
      </TouchableOpacity>

      {/* Filtered List */}
      {expanded && filteredData.length > 0 && (
        <View style={styles.listContainer}>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text
                  style={[
                    styles.itemText,
                    selected?.id === item.id && styles.selectedItemText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#444c55',
  },
  leftIcon: {
    marginRight: 8,
    color: '#ffd33d',
  },
  rightIcon: {
    marginLeft: 8,
    color: '#ffd33d',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  listContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
  selectedItemText: {
    color: '#ffd33d',
    fontWeight: '600',
  },
});