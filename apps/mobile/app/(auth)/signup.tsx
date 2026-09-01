import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { register } from '@/api/client';
import { Colors } from '@/constants/colors';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup() {
    Keyboard.dismiss();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }

    if (!password) {
      setError('Veuillez saisir un mot de passe.');
      return;
    }

    if (password.length < 8) {
      setError(
        'Le mot de passe doit contenir au moins 8 caractères.',
      );
      return;
    }

    if (password !== passwordConfirmation) {
      setError(
        'Les mots de passe ne correspondent pas.',
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await register({
        email: normalizedEmail,
        password,
        password_confirmation: passwordConfirmation,
      });

      router.replace({
        pathname: '/(auth)/verify-email',
        params: {
          email: response.user.email,
          mode: 'email-verification',
        },
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Impossible de créer votre compte.';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.hero}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace('/(auth)/welcome')}
          disabled={isLoading}
        >
          <Text style={styles.backArrow}>
            ‹
          </Text>
        </Pressable>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.title}>
          Créer votre compte
        </Text>

        <Text style={styles.subtitle}>
          Quelques secondes pour commencer.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            Email
          </Text>

          <View style={styles.inputWrap}>
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
              textContentType="emailAddress"
              editable={!isLoading}
              returnKeyType="next"
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
              autoComplete="new-password"
              textContentType="newPassword"
              editable={!isLoading}
              returnKeyType="next"
            />

            <Pressable
              style={styles.toggleButton}
              onPress={() =>
                setShowPassword((value) => !value)
              }
              disabled={isLoading}
            >
              <Text style={styles.toggleText}>
                {showPassword ? 'Masquer' : 'Voir'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Confirmer le mot de passe
          </Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={passwordConfirmation}
              onChangeText={(value) => {
                setPasswordConfirmation(value);
                setError(null);
              }}
              placeholder="••••••••"
              placeholderTextColor="#A9AFAD"
              secureTextEntry={!showConfirmation}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />

            <Pressable
              style={styles.toggleButton}
              onPress={() =>
                setShowConfirmation((value) => !value)
              }
              disabled={isLoading}
            >
              <Text style={styles.toggleText}>
                {showConfirmation ? 'Masquer' : 'Voir'}
              </Text>
            </Pressable>
          </View>
        </View>

        {error && (
          <Text style={styles.errorText}>
            {error}
          </Text>
        )}

        <Pressable
          style={[
            styles.primaryButton,
            isLoading && styles.primaryButtonDisabled,
          ]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.surface} />
          ) : (
            <Text style={styles.primaryButtonText}>
              Créer mon compte
            </Text>
          )}
        </Pressable>

        <View style={styles.switchLine}>
          <Text style={styles.switchText}>
            Déjà un compte ?{' '}
          </Text>

          <Pressable
            onPress={() => router.replace('/(auth)/login')}
            disabled={isLoading}
          >
            <Text style={styles.switchLink}>
              Se connecter
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  hero: {
    height: 56,
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

  backArrow: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 30,
    lineHeight: 32,
    color: Colors.texte,
  },

  sheet: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 30,
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

  input: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.texte,
  },

  toggleButton: {
    paddingHorizontal: 14,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  toggleText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: Colors.accent,
  },

  errorText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    lineHeight: 19,
    color: Colors.erreur,
    marginBottom: 10,
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

  switchLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  switchText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Colors.attenue,
  },

  switchLink: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: Colors.accent,
  },
});
