import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function JournalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mood = params.mood ? JSON.parse(params.mood as string) : null;
  const [answers, setAnswers] = useState(['', '', '']);

  const getMoodQuestions = (moodLabel: string) => {
    switch(moodLabel) {
      case 'Happy':
        return [
          'What made you feel happy today?',
          'Who were you with when you felt this happiness?',
          'How can you recreate this feeling in the future?'
        ];
      case 'Sad':
        return [
          'What triggered this feeling?',
          'Have you felt this way before?',
          'What usually helps you feel better?'
        ];
      case 'Angry':
        return [
          'What caused your anger?',
          'How did your body feel when you got angry?',
          'What would help you feel calmer right now?'
        ];
      case 'Calm':
        return [
          'What helped you achieve this peaceful state?',
          'How does your body feel right now?',
          'What activities contribute to your sense of calm?'
        ];
      case 'Confused':
        return [
          "What's causing you to feel uncertain?",
          'What would help bring more clarity?',
          'Who could you talk to about this?'
        ];
      case 'Stressed':
        return [
          'What is causing you to feel stressed?',
          'How is this stress affecting your body and mind?',
          'What coping strategies could help you manage this stress?'
        ];
      default:
        return [
          'How are you feeling?',
          'What caused this feeling?',
          'What would help you right now?'
        ];
    }
  };

  const handleGoBack = () => {
    router.back();
  };


  const handleSave = async () => {
    try {
      const combinedAnswers = answers.join('\n\n');
      const response = await fetch('http://your-backend-url/langflow/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: combinedAnswers,
          mood: mood,
          questions: questions 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Something went wrong with the request');
      }
  
      const aiResponse = await response.json();
  
      router.push({
        pathname: '/action', // Changed from '/screens/response' to '/action'
        params: { 
          mood: JSON.stringify(mood),
          analysis: JSON.stringify(aiResponse)
        }
      });
  
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  
  

  const questions = getMoodQuestions(mood?.label || '');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journal Entry</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.moodHeader}>
            <Text style={styles.emoji}>{mood?.emoji}</Text>
            <Text style={styles.moodText}>You're feeling {mood?.label}</Text>
          </View>

          {questions.map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionText}>{question}</Text>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Type your answer here..."
                value={answers[index]}
                onChangeText={(text) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = text;
                  setAnswers(newAnswers);
                }}
                placeholderTextColor="#666"
              />
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  moodHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  moodText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }
});
