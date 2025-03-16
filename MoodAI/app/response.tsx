import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';

interface AIResponse {
  summary: string;
  actionItems: string[];
  langflowInsights?: string;
}

export default function ResponseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  
  // Parse the AI response from params
  const aiResponse: AIResponse = params.aiResponse ? JSON.parse(params.aiResponse as string) : null;
  const mood = params.mood ? JSON.parse(params.mood as string) : null;
  
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
          
          {/* AI Analysis Section */}
          {aiResponse && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="analytics-outline" size={24} color="#333" />
                <Text style={styles.cardTitle}>AI Analysis</Text>
              </View>
              
              <Text style={styles.summaryText}>{aiResponse.summary}</Text>
              
              {/* Action Items */}
              <View style={styles.actionItems}>
                <Text style={styles.sectionTitle}>Recommended Actions:</Text>
                {aiResponse.actionItems.map((item, index) => (
                  <View key={index} style={styles.actionItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#3498db" />
                    <Text style={styles.actionItemText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Additional Insights */}
              {aiResponse.langflowInsights && (
                <View style={styles.insights}>
                  <Text style={styles.sectionTitle}>Additional Insights:</Text>
                  <Text style={styles.insightsText}>{aiResponse.langflowInsights}</Text>
                </View>
              )}
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
  insights: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  insightsText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontStyle: 'italic',
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