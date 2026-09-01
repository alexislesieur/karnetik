import { useMemo, useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { resetPassword } from '@/api/client';
import { Colors } from '@/constants/colors';

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();

  const {
    email = '',
    code = '',
  } = useLocalSearchParams<{
    email?: string;
    code?: string;
  }>();

  const [password, setPassword] = useState('');
  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showPasswordConfirmation,
    setShowPasswordConfirmation,
  ] = useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSuccess, setIsSuccess] =
    useState(false);

  const strength = useMemo(() => {
    let score = 0;

    if (password.length >= 6) {
      score++;
    }

    if (password.length >= 10) {
      score++;
    }

    if (
      /[0-9]/.test(password) &&
      /[A-Z]/.test(password)
    ) {
      score++;
    }

    return score;
  }, [password]);

  const passwordsMatch =
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation;

  async function handleReset() {
    Keyboard.dismiss();
    setError(null);

    if (!password) {
      setError(
        'Veuillez saisir un nouveau mot de passe.',
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

      await resetPassword({
        email,
        code,
        password,
        password_confirmation:
          passwordConfirmation,
      });

      setIsSuccess(true);

      setTimeout(() => {
        router.replace('/login');
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de réinitialiser le mot de passe.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <View
        style={[
          styles.successScreen,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={styles.successIcon}>
          <Svg
            width={34}
            height={34}
            viewBox="0 0 24 24"
          >
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke={Colors.succes}
              strokeWidth={2.5}
            />

            <Path
              d="M8.5 12.5l2.5 2.5 4.5-5"
              fill="none"
              stroke={Colors.succes}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        <Text style={styles.successTitle}>
          Mot de passe réinitialisé
        </Text>

        <Text style={styles.successSubtitle}>
          Votre nouveau mot de passe a bien été
          enregistré.
        </Text>
      </View>
    );
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
          disabled={isLoading}
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
          Nouveau mot de passe
        </Text>

        <Text style={styles.subtitle}>
          Choisissez un mot de passe pour votre
          compte.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            Nouveau mot de passe
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
              autoComplete="password-new"
              editable={!isLoading}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword(
                  (value) => !value,
                )
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

          <View style={styles.strengthRow}>
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.strengthBar,
                  index < strength &&
                    styles.strengthBarActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Confirmer le mot de passe
          </Text>

          <View
            style={[
              styles.inputWrap,
              passwordConfirmation.length > 0 &&
                !passwordsMatch &&
                styles.inputError,
            ]}
          >
            <TextInput
              style={styles.input}
              value={passwordConfirmation}
              onChangeText={(value) => {
                setPasswordConfirmation(value);
                setError(null);
              }}
              placeholder="••••••••"
              placeholderTextColor="#A9AFAD"
              secureTextEntry={
                !showPasswordConfirmation
              }
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
              editable={!isLoading}
              onSubmitEditing={handleReset}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() =>
                setShowPasswordConfirmation(
                  (value) => !value,
                )
              }
              accessibilityRole="button"
              accessibilityLabel={
                showPasswordConfirmation
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

          {passwordConfirmation.length > 0 &&
            (passwordsMatch ? (
              <View style={styles.statusRow}>
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
                    stroke={Colors.succes}
                    strokeWidth={2.5}
                  />

                  <Path
                    d="M8.5 12.5l2.5 2.5 4.5-5"
                    fill="none"
                    stroke={Colors.succes}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>

                <Text style={styles.successText}>
                  Les mots de passe correspondent
                </Text>
              </View>
            ) : (
              <View style={styles.statusRow}>
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
                  Les mots de passe ne correspondent
                  pas
                </Text>
              </View>
            ))}
        </View>

        {error && (
          <Text style={styles.formError}>
            {error}
          </Text>
        )}

        <Pressable
          style={[
            styles.primaryButton,
            isLoading &&
              styles.primaryButtonDisabled,
          ]}
          onPress={handleReset}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading
              ? 'Réinitialisation...'
              : 'Réinitialiser le mot de passe'}
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
    backgroundColor: Colors.accentLight,
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

  eyeButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  strengthRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 7,
  },

  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.bordure,
  },

  strengthBarActive: {
    backgroundColor: Colors.accent,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 7,
  },

  successText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    color: Colors.succes,
  },

  errorText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    color: Colors.erreur,
  },

  formError: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    lineHeight: 19,
    color: Colors.erreur,
    marginBottom: 12,
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

  successScreen: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  successTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    color: Colors.texte,
    textAlign: 'center',
    marginBottom: 8,
  },

  successSubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    lineHeight: 23,
    color: Colors.attenue,
    textAlign: 'center',
  },
});
