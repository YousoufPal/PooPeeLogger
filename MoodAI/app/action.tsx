import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ActionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  
  // Parse the mood from the navigation params
  const mood = params.mood ? JSON.parse(params.mood as string) : null;
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleViewHistory = () => {
    router.push('/history');
  };

  return (
    <View style={[styles.container, mood ? { backgroundColor: mood.color } : null]}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <IconSymbol 
          size={24} 
          name="arrow.left" 
          color={Colors[colorScheme ?? 'light'].text} 
        />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={styles.emoji}>{mood?.emoji}</Text>
        <Text style={styles.title}>You're feeling {mood?.label}</Text>
        
        <View style={styles.actionsContainer}>
          <Text style={styles.subtitle}>Recommended actions:</Text>
          
          {mood?.label === 'Happy' && (
            <View style={styles.actionsList}>
              <Text style={styles.actionItem}>• Journal about what went well today</Text>
              <Text style={styles.actionItem}>• Share your joy with someone you care about</Text>
              <Text style={styles.actionItem}>• Practice gratitude meditation</Text>
            </View>
          )}
          
          {mood?.label === 'Sad' && (
            <View style={styles.actionsList}>
              <Text style={styles.actionItem}>• Take a few deep breaths</Text>
              <Text style={styles.actionItem}>• Listen to comforting music</Text>
              <Text style={styles.actionItem}>• Reach out to a supportive friend</Text>
            </View>
          )}
          
          {mood?.label === 'Angry' && (
            <View style={styles.actionsList}>
              <Text style={styles.actionItem}>• Practice deep breathing</Text>
              <Text style={styles.actionItem}>• Go for a walk or exercise</Text>
              <Text style={styles.actionItem}>• Write down what's bothering you</Text>
            </View>
          )}
          
          {mood?.label === 'Calm' && (
            <View style={styles.actionsList}>
              <Text style={styles.actionItem}>• Practice mindfulness meditation</Text>
              <Text style={styles.actionItem}>• Set intentions for the day</Text>
              <Text style={styles.actionItem}>• Enjoy the peaceful moment</Text>
            </View>
          )}
          
          {mood?.label === 'Confused' && (
            <View style={styles.actionsList}>
              <Text style={styles.actionItem}>• Make a list of your thoughts</Text>
              <Text style={styles.actionItem}>• Talk to someone who can offer perspective</Text>
              <Text style={styles.actionItem}>• Take a break to clear your mind</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity style={styles.historyButton} onPress={handleViewHistory}>
          <Text style={styles.buttonText}>View Mood History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actionsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  actionsList: {
    gap: 10,
  },
  actionItem: {
    fontSize: 16,
    lineHeight: 24,
  },
  historyButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});