import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform, SafeAreaView } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabaseClient';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      WebBrowser.warmUpAsync();
      
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);

  useEffect(() => {
    // Handle deep linking
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.replace('/(tabs)');
      }
    });

    const handleUrl = async (url: string) => {
      if (url && url.includes('auth/callback')) {
        const urlObject = new URL(url);
        const params = Object.fromEntries(urlObject.searchParams.entries());
        
        if (params?.access_token && params?.refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (error) {
            console.error('Error setting auth session:', error.message);
          }
        }
        
        if (Platform.OS !== 'web') {
          await WebBrowser.dismissAuthSession();
        }
      }
    };

    // Handle deep linking
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    return () => {
      linkingSubscription.remove();
    };
  }, [router]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="history" />
          <Stack.Screen name="action" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
