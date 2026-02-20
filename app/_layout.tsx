import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { checkSession } from '../redux/slices/userSlice';
import { RootState, store } from '../redux/store';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthWrapper() {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const segments = useSegments();
  const router = useRouter();
  const dispatch = useDispatch();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    dispatch(checkSession());
  }, []);

  useEffect(() => {
    if (loading || !navigationState?.key) return;

    const inAuthGroup = segments[0] === 'login';

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, segments, loading, navigationState?.key]);

  if (!navigationState?.key) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthWrapper />
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
