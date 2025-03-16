import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';

interface AIResponse {
  text: string;
  personalized_exercises: string[];
}

export default function ResponseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  
  // Parse the AI response from params with error handling
  let aiResponse: AIResponse | null = null;
  try {
    const responseString = params.aiResponse ? JSON.parse(params.aiResponse as string) : null;
    if (responseString) {
      aiResponse = JSON.parse(responseString);
      console.log('Parsed AI Response:', aiResponse); // For debugging
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }

  let mood = null;
  try {
    mood = params.mood ? JSON.parse(params.mood as string) : null;
  } catch (error) {
    console.error('Error parsing mood:', error);
  }
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleViewHistory = () => {
    router.push('/history');
  };

  return (
    <View style={[styles.container, mood ? { backgroundColor: mood.color + '20' } : null]}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <IconSymbol 
          size={24} 
          name="arrow.left" 
          color={Colors[colorScheme ?? 'light'].text} 
        />
      </TouchableOpacity>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {mood && (
            <View style={styles.moodSection}>
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text style={styles.title}>You're feeling {mood.label}</Text>
            </View>
          )}

          {aiResponse && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="chatbubbles-outline" size={24} color="#333" />
                <Text style={styles.cardTitle}>Analysis & Recommendations</Text>
              </View>
              
              {aiResponse.text && (
                <Text style={styles.summaryText}>{aiResponse.text}</Text>
              )}
              
              {aiResponse.personalized_exercises && aiResponse.personalized_exercises.length > 0 && (
                <View style={styles.actionItems}>
                  <Text style={styles.sectionTitle}>Suggested Actions</Text>
                  {aiResponse.personalized_exercises.map((exercise, index) => (
                    <View key={index} style={styles.actionItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#3498db" />
                      <Text style={styles.actionItemText}>{exercise}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {!aiResponse && (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={40} color="#e74c3c" />
              <Text style={styles.errorTitle}>Oops!</Text>
              <Text style={styles.errorText}>We couldn't process the AI response. Please try again.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.historyButton} onPress={handleViewHistory}>
        <Text style={styles.buttonText}>View Mood History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 100,
  },
  moodSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  actionItems: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  actionItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 12,
    lineHeight: 22,
  },
  errorCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 12,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  historyButton: {
    backgroundColor: '#3498db',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});
