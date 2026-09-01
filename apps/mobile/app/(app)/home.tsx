import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { clearToken } from '@/api/client';
import { Colors } from '@/constants/colors';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  async function handleLogout() {
    await clearToken();
    router.replace('/(auth)/welcome');
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 32,
          paddingBottom: insets.bottom + 20,
        },
      ]}
    >
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
