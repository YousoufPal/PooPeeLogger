import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from '../supabaseClient';

const { width, height } = Dimensions.get('window');

const moods = [
  { emoji: '😀', label: 'Happy', color: '#FFD700' },
  { emoji: '😢', label: 'Sad', color: '#1E90FF' },
  { emoji: '😡', label: 'Angry', color: '#DC143C' },
  { emoji: '😌', label: 'Calm', color: '#32CD32' },
  { emoji: '😕', label: 'Confused', color: '#FF8C00' },
  { emoji: '😫', label: 'Stressed', color: '#9932CC' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scaleAnim = new Animated.Value(1);
  
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start(() => {
      // Navigate to the journal page with the selected mood
      router.push({ pathname: '/journal', params: { mood: JSON.stringify(mood) } });
    });
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      alert('Login successful!');
    }
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert('Sign-up failed: ' + error.message);
    } else {
      alert('Sign-up successful! Please check your email to confirm your account.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Navigation Bar */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>MoodAI</Text>
          <View style={styles.headerRight}>
            {isAuthenticated ? (
              <TouchableOpacity onPress={handleLogout} style={styles.authButton}>
                <Text style={styles.authButtonText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity onPress={handleLogin} style={styles.authButton}>
                  <Text style={styles.authButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignUp} style={[styles.authButton, styles.signUpButton]}>
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            {isAuthenticated ? 'Welcome back!' : 'Track your emotional journey'}
          </Text>
          <Text style={styles.subtitleText}>
            Select your current mood to begin
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.moodSelectorCard}>
            <Text style={styles.title}>How are you feeling today?</Text>
            <View style={styles.moodContainer}>
              {moods.map((mood) => (
                <TouchableOpacity 
                  key={mood.label} 
                  onPress={() => handleMoodSelect(mood)}
                  style={[
                    styles.moodButton,
                    selectedMood?.label === mood.label && { backgroundColor: mood.color + '30' }
                  ]}
                >
                  <Animated.Text 
                    style={[
                      styles.moodEmoji, 
                      selectedMood?.label === mood.label && { transform: [{ scale: scaleAnim }] }
                    ]}
                  >
                    {mood.emoji}
                  </Animated.Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="information-circle-outline" size={24} color="#555" />
              <Text style={styles.infoCardTitle}>Why Track Your Mood?</Text>
            </View>
            <Text style={styles.infoCardText}>
              Regular mood tracking helps identify patterns in your emotional well-being 
              and provides insights for better mental health management.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BlurView intensity={90} style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => {}}>
            <Ionicons name="home" size={24} color="#3498db" />
            <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/history')}>
            <Ionicons name="time-outline" size={24} color="#555" />
            <Text style={styles.navText}>History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/therapist')}>
            <Ionicons name="chatbubbles-outline" size={24} color="#555" />
            <Text style={styles.navText}>Therapist</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
            <Ionicons name="person-outline" size={24} color="#555" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for bottom nav
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    marginRight: 8,
  },
  input: {
    height: 40,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 8,
    width: 200,
  },
  authButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
    borderRadius: 20,
  },
  authButtonText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
  },
  signUpText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  mainContent: {
    paddingHorizontal: 16,
  },
  moodSelectorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  moodButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    width: width / 3 - 24,
    backgroundColor: '#f8f8f8',
  },
  moodEmoji: {
    fontSize: 36,
    marginBottom: 5,
  },
  moodLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  infoCardText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#555',
  },
  activeNavText: {
    color: '#3498db',
    fontWeight: '600',
  },
});
