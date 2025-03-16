import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const moods = [
  { emoji: '😀', label: 'Happy', color: '#FFD700' },
  { emoji: '😢', label: 'Sad', color: '#1E90FF' },
  { emoji: '😡', label: 'Angry', color: '#DC143C' },
  { emoji: '😌', label: 'Calm', color: '#32CD32' },
  { emoji: '😕', label: 'Confused', color: '#FF8C00' },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedMood, setSelectedMood] = useState(null);
  const backgroundColor = selectedMood ? selectedMood.color : '#fff';
  const scaleAnim = new Animated.Value(1);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start(() => {
      navigation.navigate('Action', { mood });
    });
  };

  return (
    <View style={[styles.container, { backgroundColor }]}> 
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.moodContainer}>
        {moods.map((mood) => (
          <TouchableOpacity key={mood.label} onPress={() => handleMoodSelect(mood)}>
            <Animated.Text style={[styles.moodEmoji, { transform: [{ scale: scaleAnim }] }]}>
              {mood.emoji}
            </Animated.Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  moodEmoji: {
    fontSize: 40,
    padding: 10,
  },
});

export default HomeScreen;
