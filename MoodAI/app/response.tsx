import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, StatusBar } from 'react-native';
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
  
  let aiResponse: AIResponse | null = null;
  try {
    const responseString = params.aiResponse ? JSON.parse(params.aiResponse as string) : null;
    if (responseString) {
      aiResponse = JSON.parse(responseString);
      console.log('Parsed AI Response:', aiResponse); 
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Image 
              source={require('../assets/images/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.headerTitle}>MindfulMinds</Text>
          </View>
        </View>
      </View>

      <View style={[styles.container, mood ? { backgroundColor: mood.color + '20' } : null]}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    resizeMode: 'contain',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
