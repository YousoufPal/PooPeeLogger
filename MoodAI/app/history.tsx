import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  StatusBar,
  SafeAreaView,
  Animated,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

const { width, height } = Dimensions.get('window');

interface MoodEntry {
  date: string;
  emoji: string;
  label: string;
  color: string;
  notes: string;
}

interface GroupedHistory {
  [key: string]: MoodEntry[];
}

// Example history data - in a real app, you would store and retrieve this from a database or storage
const moodHistory: MoodEntry[] = [
  { date: '2023-11-21', emoji: '😀', label: 'Happy', color: '#FFD700', notes: 'Had a great day at work. Project was well received.' },
  { date: '2023-11-20', emoji: '😢', label: 'Sad', color: '#1E90FF', notes: 'Missing family today.' },
  { date: '2023-11-19', emoji: '😡', label: 'Angry', color: '#DC143C', notes: 'Frustrated with traffic and long commute.' },
  { date: '2023-11-18', emoji: '😌', label: 'Calm', color: '#32CD32', notes: 'Meditation session helped me relax.' },
  { date: '2023-11-17', emoji: '😕', label: 'Confused', color: '#FF8C00', notes: 'Unsure about next steps in my project.' },
  { date: '2023-11-16', emoji: '😀', label: 'Happy', color: '#FFD700', notes: 'Birthday celebrations with friends!' },
  { date: '2023-11-15', emoji: '😌', label: 'Calm', color: '#32CD32', notes: 'Peaceful day reading by the window.' },
];

// Group history by month
const groupByMonth = (history: MoodEntry[]) => {
  const grouped: GroupedHistory = {};
  history.forEach(entry => {
    const date = new Date(entry.date);
    const monthYear = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0].slice(0, 7);
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(entry);
  });
  return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])); // Sort by most recent month first
};

const formatMonthYear = (monthYearStr: string) => {
  const date = new Date(monthYearStr + '-01');
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { day: 'numeric', month: 'short' });
};

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status when component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        // Show alert and redirect to profile if not authenticated
        Alert.alert(
          'Login Required',
          'Please log in to view your mood history.',
          [
            { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
          ]
        );
      }
    });

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        Alert.alert(
          'Login Required',
          'Please log in to view your mood history.',
          [
            { text: 'OK', onPress: () => router.replace('/(tabs)/profile') }
          ]
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // If not authenticated, don't render the history content
  if (!session) {
    return null;
  }

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'happy', label: 'Happy', emoji: '😀' },
    { id: 'sad', label: 'Sad', emoji: '😢' },
    { id: 'angry', label: 'Angry', emoji: '😡' },
    { id: 'calm', label: 'Calm', emoji: '😌' },
    { id: 'confused', label: 'Confused', emoji: '😕' },
    { id: 'stressed', label: 'Stressed', emoji: '😫' },
  ];
  
  const filteredHistory = activeFilter === 'all' 
    ? moodHistory 
    : moodHistory.filter(entry => entry.label.toLowerCase() === activeFilter);
    
  const groupedHistory = groupByMonth(filteredHistory);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const toggleItemExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const toggleMonthExpanded = (month: string) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mood History</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="options-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Filter Tabs */}
      <View style={styles.filterWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContainer}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              style={[
                styles.filterTab,
                activeFilter === option.id && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(option.id)}
            >
              {option.emoji && <Text style={styles.filterEmoji}>{option.emoji}</Text>}
              <Text 
                style={[
                  styles.filterText,
                  activeFilter === option.id && styles.activeFilterText
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Mood Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Mood Insights</Text>
        <View style={styles.statsContent}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{moodHistory.length}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {moodHistory.filter(item => item.label === 'Happy').length}
            </Text>
            <Text style={styles.statLabel}>Happy Days</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>
              {moodHistory.length > 0 ? moodHistory[0].emoji : '😀'}
            </Text>
            <Text style={styles.statLabel}>Latest Mood</Text>
          </View>
        </View>
      </View>
      
      {/* History List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {groupedHistory.length > 0 ? (
          groupedHistory.map(([month, entries]) => (
            <View key={month} style={styles.monthSection}>
              <TouchableOpacity 
                style={styles.monthHeader} 
                onPress={() => toggleMonthExpanded(month)}
              >
                <Text style={styles.monthTitle}>{formatMonthYear(month)}</Text>
                <Ionicons 
                  name={expandedMonth === month ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666"
                />
              </TouchableOpacity>
              
              {(expandedMonth === month || expandedMonth === null) && entries.map((entry, index) => (
                <TouchableOpacity 
                  key={`${entry.date}-${index}`} 
                  style={[
                    styles.historyCard,
                    { borderLeftColor: entry.color }
                  ]}
                  onPress={() => toggleItemExpanded(`${entry.date}-${index}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.historyCardHeader}>
                    <View style={styles.dateEmojiContainer}>
                      <Text style={styles.historyEmoji}>{entry.emoji}</Text>
                      <View style={styles.historyDetails}>
                        <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                        <Text style={styles.historyMood}>{entry.label}</Text>
                      </View>
                    </View>
                    <Ionicons 
                      name={expandedItems[`${entry.date}-${index}`] ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#666"
                    />
                  </View>
                  
                  {expandedItems[`${entry.date}-${index}`] && (
                    <View style={styles.expandedContent}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesText}>{entry.notes}</Text>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                          <Ionicons name="create-outline" size={18} color="#3498db" />
                          <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                          <Ionicons name="analytics-outline" size={18} color="#3498db" />
                          <Text style={styles.actionText}>Insights</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No entries found</Text>
            <Text style={styles.emptyStateText}>
              {activeFilter !== 'all' 
                ? `You don't have any '${activeFilter}' mood entries.`
                : 'Start tracking your mood to see history here.'}
            </Text>
          </View>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Bottom Navigation Bar */}
      <BlurView intensity={90} style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
            <Ionicons name="home-outline" size={24} color="#555" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="time" size={24} color="#3498db" />
            <Text style={[styles.navText, styles.activeNavText]}>History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/therapist')}>
            <Ionicons name="chatbubbles-outline" size={24} color="#555" />
            <Text style={styles.navText}>Therapist</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="person-outline" size={24} color="#555" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f7',
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
    height: 44,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  filterWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 10,
    flexDirection: 'row',
  },
  filterTab: {
    width: 65,     // Increased width
    height: 65,    // Increased height to match width
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    padding: 6,    // Slightly increased padding
  },
  activeFilterTab: {
    backgroundColor: '#3498db',
  },
  filterText: {
    fontSize: 12,   // Increased font size
    fontWeight: '500',
    color: '#555',
    marginTop: 4,   // Increased spacing between emoji and text
    textAlign: 'center',
  },
  filterEmoji: {
    fontSize: 24,   // Increased emoji size
    lineHeight: 28, // Adjusted line height
  },
  activeFilterText: {
    color: '#fff',
  },
  statsCard: {
    margin: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statEmoji: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    height: 30,
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  monthSection: {
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dateEmojiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyEmoji: {
    fontSize: 24,
    marginRight: 12,
    width: 32,
    textAlign: 'center',
  },
  historyDetails: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
  historyMood: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    paddingRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: '#3498db',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
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