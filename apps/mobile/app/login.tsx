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
import Svg, { Circle, Path } from 'react-native-svg';

import { login } from '@/api/client';
import { Colors } from '@/constants/colors';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    Keyboard.dismiss();

    if (!email.trim()) {
      setError('Veuillez saisir votre email.');
      return;
    }

    if (!password) {
      setError('Veuillez saisir votre mot de passe.');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      const response = await login({
        email: email.trim(),
        password,
      });

      router.replace('/home');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la connexion.';

      if (
        message ===
        'Veuillez vérifier votre adresse email avant de vous connecter.'
      ) {
        router.push({
          pathname: '/verify-email',
          params: {
            email: email.trim(),
          },
        });

        return;
      }

      setError(message);
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
          accessibilityRole="button"
          accessibilityLabel="Retour"
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
        <Text style={styles.title}>
          Bon retour
        </Text>

        <Text style={styles.subtitle}>
          Connectez-vous à votre carnet
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            Email
          </Text>

          <View
            style={[
              styles.inputWrap,
              error &&
                !email.trim() &&
                styles.inputError,
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
              returnKeyType="next"
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Mot de passe
          </Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setError(null);
              }}
              placeholder="••••••••"
              placeholderTextColor="#A9AFAD"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              editable={!isLoading}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword((value) => !value)
              }
              accessibilityRole="button"
              accessibilityLabel={
                showPassword
                  ? 'Masquer le mot de passe'
                  : 'Afficher le mot de passe'
              }
            >
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
              >
                <Path
                  d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
                  fill="none"
                  stroke={Colors.attenue}
                  strokeWidth={2}
                />

                <Circle
                  cx="12"
                  cy="12"
                  r="3"
                  fill="none"
                  stroke={Colors.attenue}
                  strokeWidth={2}
                />
              </Svg>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={styles.forgot}
          onPress={() => {
            // Fonctionnalité à implémenter plus tard.
          }}
          disabled={isLoading}
        >
          <Text style={styles.forgotText}>
            Mot de passe oublié ?
          </Text>
        </Pressable>

        {error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorIcon}>
              <Svg
                width={13}
                height={13}
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
            </View>

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        <Pressable
          style={[
            styles.primaryButton,
            isLoading && styles.primaryButtonDisabled,
          ]}
          onPress={handleLogin}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityState={{
            disabled: isLoading,
          }}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading
              ? 'Connexion...'
              : 'Se connecter'}
          </Text>
        </Pressable>

        <Text style={styles.switchLine}>
          Pas encore de compte ?{' '}
          <Text
            style={styles.switchLink}
            onPress={() => {
              Keyboard.dismiss();
              router.push('/signup');
            }}
          >
            Créer un compte
          </Text>
        </Text>
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
    paddingTop: 20,
    paddingBottom: 30,
  },

  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 21,
    color: Colors.texte,
    marginBottom: 4,
  },

  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Colors.attenue,
    marginBottom: 24,
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

  eyeButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  forgot: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    marginTop: 2,
    marginBottom: 18,
  },

  forgotText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: Colors.accent,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 12,
  },

  errorIcon: {
    paddingTop: 2,
  },

  errorText: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    lineHeight: 19,
    color: Colors.erreur,
  },

  primaryButton: {
    width: '100%',
    minHeight: 44,
    marginTop: 6,
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

  switchLine: {
    textAlign: 'center',
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Colors.attenue,
    marginTop: 18,
  },

  switchLink: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.accent,
  },
});
