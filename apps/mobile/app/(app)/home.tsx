import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  clearToken,
  getStoredUser,
  type User,
} from '@/api/client';
import { Colors } from '@/constants/colors';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const storedUser = await getStoredUser();

        if (!storedUser) {
          router.replace('/(auth)/welcome');
          return;
        }

        setUser(storedUser);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);

      await clearToken();

      router.replace('/(auth)/welcome');
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  const prenom = user?.prenom?.trim();

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
          Bonjour{prenom ? ` ${prenom}` : ''} !
        </Text>

        <Text style={styles.subtitle}>
          Ton carnet est prêt.
        </Text>
      </View>

      <Pressable
        style={[
          styles.logoutButton,
          isLoggingOut && styles.logoutButtonDisabled,
        ]}
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator color={Colors.accent} />
        ) : (
          <Text style={styles.logoutButtonText}>
            Se déconnecter
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },

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

  logoutButtonDisabled: {
    opacity: 0.7,
  },

  logoutButtonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: Colors.accent,
  },
});
