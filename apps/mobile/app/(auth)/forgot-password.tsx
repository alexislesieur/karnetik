import { useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { forgotPassword } from '@/api/client';
import { Colors } from '@/constants/colors';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    Keyboard.dismiss();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError('Entrez une adresse email valide');
      return;
    }

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail,
      );

    if (!emailIsValid) {
      setError('Entrez une adresse email valide');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      await forgotPassword({
        email: normalizedEmail,
      });

      router.push({
        pathname: '/verify-email',
        params: {
          email: normalizedEmail,
          mode: 'password-reset',
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Pressable
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
      onPress={Keyboard.dismiss}
    >
      <View style={styles.hero}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            Keyboard.dismiss();
            router.back();
          }}
        >
          <Svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
          >
            <Path
              d="M15 6l-6 6 6 6"
              fill="none"
              stroke={Colors.texte}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>

      <View style={styles.sheet}>
        <View style={styles.lockIcon}>
          <Svg
            width={34}
            height={34}
            viewBox="0 0 24 24"
          >
            <Rect
              x="4"
              y="10"
              width="16"
              height="10"
              rx="2"
              fill="none"
              stroke={Colors.accent}
              strokeWidth={1.8}
            />

            <Path
              d="M8 10V7a4 4 0 0 1 8 0v3"
              fill="none"
              stroke={Colors.accent}
              strokeWidth={1.8}
            />
          </Svg>
        </View>

        <Text style={styles.title}>
          Mot de passe oublié ?
        </Text>

        <Text style={styles.subtitle}>
          Entrez votre email, on vous envoie un
          code pour le réinitialiser.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            Email
          </Text>

          <View
            style={[
              styles.inputWrap,
              error && styles.inputError,
            ]}
          >
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setError(null);
              }}
              placeholder="nom@exemple.fr"
              placeholderTextColor="#A9AFAD"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              editable={!isLoading}
            />
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Svg
                width={12}
                height={12}
                viewBox="0 0 24 24"
              >
                <Circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke={Colors.erreur}
                  strokeWidth={2.5}
                />

                <Path
                  d="M12 8v5M12 16h.01"
                  fill="none"
                  stroke={Colors.erreur}
                  strokeWidth={2.5}
                />
              </Svg>

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          )}
        </View>

        <Pressable
          style={[
            styles.primaryButton,
            isLoading &&
              styles.primaryButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading
              ? 'Envoi...'
              : 'Envoyer le code'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  hero: {
    height: 56,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.fond,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },

  sheet: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 10,
    paddingBottom: 30,
  },

  lockIcon: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: Colors.accentClair,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    color: Colors.texte,
    marginBottom: 8,
  },

  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    lineHeight: 23,
    color: Colors.attenue,
    marginBottom: 26,
  },

  field: {
    marginBottom: 15,
  },

  label: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: Colors.texte,
    marginBottom: 7,
  },

  inputWrap: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.fond,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 12,
  },

  inputError: {
    borderColor: Colors.erreur,
  },

  input: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.texte,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 7,
  },

  errorText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    color: Colors.erreur,
  },

  primaryButton: {
    width: '100%',
    minHeight: 44,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },

  primaryButtonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: Colors.surface,
  },
});
