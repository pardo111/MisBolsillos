import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../store/AuthStore';

 

export default function RootLayout() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => { init(); }, []);

  return (
    <>
       <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(protected)" />
      </Stack>
    </>
  );
}