import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';

export default function ActionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  
  // Parse the parameters
  const mood = params.mood ? JSON.parse(params.mood as string) : null;
  const analysis = params.analysis ? JSON.parse(params.analysis as string) : null;
  const recommendations = params.recommendations ? JSON.parse(params.recommendations as string) : null;
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleViewHistory = () => {
    router.push('/history');
  };

  const openSpotifyTrack = (uri: string) => {
    Linking.openURL(uri);
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
          <Text style={styles.emoji}>{mood?.emoji}</Text>
          <Text style={styles.title}>You're feeling {mood?.label}</Text>
          
          {/* AI Analysis Section */}
          {analysis && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="brain-outline" size={24} color="#333" />
                <Text style={styles.cardTitle}>Personalized Analysis</Text>
              </View>
              <Text style={styles.analysisText}>{analysis.summary}</Text>
              
              {/* Action Items */}
              <View style={styles.actionItems}>
                <Text style={styles.sectionTitle}>Suggested Actions:</Text>
                {analysis.actionItems.map((item, index) => (
                  <View key={index} style={styles.actionItem}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#3498db" />
                    <Text style={styles.actionItemText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Langflow Insights */}
              {analysis.langflowInsights && (
                <View style={styles.langflowInsights}>
                  <Text style={styles.sectionTitle}>Additional Insights:</Text>
                  <Text style={styles.insightsText}>{analysis.langflowInsights}</Text>
                </View>
              )}
            </View>
          )}
          
          {/* Music Recommendations Section */}
          {recommendations && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="musical-notes-outline" size={24} color="#333" />
                <Text style={styles.cardTitle}>Music for Your Mood</Text>
              </View>
              <Text style={styles.subtitle}>Here's what we recommend:</Text>
              
              {recommendations.tracks.map((track, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.trackItem}
                  onPress={() => openSpotifyTrack(track.uri)}
                >
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackName}>{track.name}</Text>
                    <Text style={styles.artistName}>{track.artists.join(', ')}</Text>
                  </View>
                  <Ionicons name="play-circle-outline" size={24} color="#1DB954" />
                </TouchableOpacity>
              ))}
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
  // ...existing styles...
  langflowInsights: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  insightsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
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
    paddingTop: 100,
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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
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
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  analysisText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  actionItems: {
    marginTop: 15,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  actionItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  trackInfo: {
    flex: 1,
    marginRight: 10,
  },
  trackName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: '#666',
  },
  historyButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});