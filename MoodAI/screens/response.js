import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ResponseScreen = () => {
  const router = useRouter();
  const { aiResponse } = router.params; // Access aiResponse from params

  return (
    <View style={styles.container}>
      <Text style={styles.header}>AI Response</Text>
      <Text>{JSON.stringify(aiResponse)}</Text> {/* Display aiResponse */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ResponseScreen;
