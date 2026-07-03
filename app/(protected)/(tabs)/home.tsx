import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../../store/AuthStore';

export default function Home() {
  const { user, signOut } = useAuthStore();

  return (
    <View style={{ flex: 1, padding: 24, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Hola, {user?.email}</Text>
      <Pressable onPress={() => router.push('/(protected)/(tabs)/profile')}>
        <Text>Ir a Perfil →</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/(protected)/(tabs)/transactions')}>
        <Text>Ir a Transacciones →</Text>
      </Pressable>
      <Pressable onPress={signOut}>
        <Text style={{ color: 'red' }}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}