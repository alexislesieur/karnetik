import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';
import {
  getCurrentUser,
  getStoredToken,
  type User,
} from '@/api/client';
import { Colors } from '@/constants/colors';

export default function IndexScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await getStoredToken();

        if (!token) {
          router.replace('/(auth)/welcome');
          return;
        }

        let user: User;

        try {
          user = await getCurrentUser();
        } catch {
          router.replace('/(auth)/welcome');
          return;
        }

        if (!user.email_verifie) {
          router.replace('/(auth)/verify-email');
          return;
        }

        if (!user.onboarding_completed) {
          router.replace('/(onboarding)/name');
          return;
        }

        router.replace('/(app)/home');
      } finally {
        setIsLoading(false);
      }
    }

    bootstrap();
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.accent} />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: Colors.surface,
  },
};
