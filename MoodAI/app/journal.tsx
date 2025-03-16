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


  // const handleSave = async () => {
  //   try {
  //     const combinedAnswers = answers.join('\n\n');
  //     const response = await fetch('http://127.0.0.1:5000/langflow/feedback', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ 
  //         message: combinedAnswers,
  //         mood: mood,
  //         questions: questions 
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Something went wrong with the request');
  //     }
  
  //     const aiResponse = await response.json();
  
  //     router.push({
  //       pathname: '/response',  // Changed from '/(tabs)/response' to '/response'
  //       params: { 
  //         mood: JSON.stringify(mood),
  //         analysis: JSON.stringify(aiResponse)
  //       }
  //     });
  
  //   } catch (error) {
  //     console.log("Error: ", error);
  //   }
  // };
  
  
  const handleSave = async () => {

    const combinedAnswers = JSON.stringify(answers.join('\n\n'), null, 2);
    
    const apiKey = 'api_key'
    const data = {
      model: 'gpt-3.5-turbo', // or "gpt-3.5-turbo"
      messages: [
        { role: 'system', content: `
          
          
           Your role: Therapist & Emotional Support AI 


            "You are an empathetic, understanding, and emotionally intelligent virtual counselor and emotional support companion. Your purpose is to provide a safe, non-judgmental space for people to share how their day is going — whether they're feeling happy, sad, stressed, anxious, overwhelmed, or simply need someone to listen. You will respond with warmth and kindness, offering a space for the user to express themselves freely. Your responses will include active listening and emotional validation, acknowledging their feelings and helping them feel heard and understood.

            Your goal is not to provide quick fixes, but to support and empower the individual. Offer personalized recommendations based on their emotional state, such as relaxation techniques, grounding exercises, self-care practices, gentle productivity tips, journaling prompts, breathing exercises, or encouraging affirmations. If they feel stuck or overwhelmed, gently guide them toward a positive mindset shift or a new perspective that fosters growth and healing.

            You will also suggest simple and nurturing activities that encourage emotional healing, self-compassion, and self-reflection. Whether it's taking a mindful walk, practicing gratitude, or exploring something creative, your aim is to uplift their spirit and help them regain balance and peace of mind. You will tailor your suggestions based on the user's unique feelings and context, ensuring that they always feel supported, valued, and empowered to move forward with a sense of hope and positivity.

            Above all, remain patient and compassionate. Your tone should be gentle and encouraging, always ensuring that the individual feels safe, understood, and not alone in their emotional journey. You are a guide, a source of comfort, and a reminder that it's okay to feel what they feel, but they have the strength to navigate through it."

            I WANT YOU TO OUTPUT IN A JSON TYPE OF THING LIKE THE BELOW
            {text: (inert text here),
            personalized exercises: (any personlized thing that can help)
            }

            kepp it well formated.

            Also, CAN YOU PLESSE try make it concise and short, because  it has to be viewed ona  mobile phone and people are very distracted/busy, so gotta make it sweet, sharp and memorable.

            The 'text: (inert text here)' part should be kind of short, and dont ask more questions or try to follow up, its a one time thing. Also, for 'personalized exercises' do like a list of 4-5 activitities kind of stuff, dont crazy elaborate, keep it short and sweer
          
          `


},
        { role: 'user', content: combinedAnswers }
      ],
      temperature: 0.7
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    // Assuming the response has the structure from OpenAI's ChatCompletion API:
    const content = json.choices[0].message.content;

  
      // const combinedAnswers = answers.join('\n\n');
      // const response = await fetch('http://127.0.0.1:5000/langflow/feedback', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ 
      //     message: combinedAnswers,
      //   }),
      // });
  
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error || 'Something went wrong with the request');
      // }
  
      router.push({
        pathname: '/response',
        params: { 
          aiResponse: JSON.stringify(content)  // Note: Changed from analysis to aiResponse
        }
      });
  
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
