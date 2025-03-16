import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ChatPage() {
  const router = useRouter();
  const { params } = router;
  const mood = params?.mood || 'unknown';

  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = () => {
    // Simulate ChatGPT response
    setResponse(`ChatGPT: I see you're feeling ${mood}. Let's talk about it.`);
    setUserInput('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Why are you feeling {mood}?</Text>

          {/* Chat Display */}
          <View style={styles.chatContainer}>
            {response ? (
              <View style={styles.responseBubble}>
                <Text style={styles.responseText}>{response}</Text>
              </View>
            ) : null}
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your feelings here..."
              value={userInput}
              onChangeText={setUserInput}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Voice Record Button */}
          <TouchableOpacity style={styles.voiceButton}>
            <Ionicons name="mic" size={24} color="#fff" />
            <Text style={styles.voiceButtonText}>Record Voice</Text>
          </TouchableOpacity>
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
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  responseBubble: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  sendButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  voiceButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
});