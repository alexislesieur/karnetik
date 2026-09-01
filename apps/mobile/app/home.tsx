import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '@/constants/colors';

export default function HomeScreen() {
  async function handleLogout() {
    try {
      await AsyncStorage.removeItem('token');
    } finally {
      router.replace('/login');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Bienvenue sur Karnetik
        </Text>

        <Text style={styles.subtitle}>
          Ton compte a bien été créé.
        </Text>
      </View>

      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>
          Se déconnecter
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 120,
    paddingBottom: 40,
    backgroundColor: Colors.surface,
  },

  content: {
    alignItems: 'center',
  },

  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: Colors.texte,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.attenue,
    textAlign: 'center',
  },

  logoutButton: {
    width: '100%',
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.bordure,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },

  logoutButtonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: Colors.accent,
  },
});
