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
import { Stack, router } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { login } from '@/api/client';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    Keyboard.dismiss();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }

    if (!password) {
      setError('Veuillez saisir votre mot de passe.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await login({
        email: normalizedEmail,
        password,
      });

      /*
       * L'API refuse la connexion si l'email
       * n'est pas encore vérifié.
       *
       * Dans ce cas, on renvoie l'utilisateur
       * vers l'écran de vérification.
       */
      if (!response.user.email_verifie) {
        router.replace({
          pathname: '/verify-email',
          params: {
            email: normalizedEmail,
            mode: 'email-verification',
          },
        });

        return;
      }

      router.replace('/home');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Impossible de vous connecter.';

      /*
       * Si l'API indique que l'adresse email
       * doit être vérifiée, on renvoie directement
       * vers l'OTP.
       */
      if (
        message
          .toLowerCase()
          .includes('vérifier votre adresse email') ||
        message
          .toLowerCase()
          .includes('verifier votre adresse email')
      ) {
        router.replace({
          pathname: '/verify-email',
          params: {
            email: normalizedEmail,
            mode: 'email-verification',
          },
        });

        return;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleForgotPassword() {
    router.push('/forgot-password');
  }

  function handleCreateAccount() {
    router.push('/signup');
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Pressable
        style={styles.screen}
        onPress={Keyboard.dismiss}
      >
        <View style={styles.hero}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
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
                autoComplete="password"
                editable={!isLoading}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
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
          </View>

          <Pressable
            style={styles.forgot}
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotText}>
              Mot de passe oublié ?
            </Text>
          </Pressable>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          )}

          <Pressable
            style={[
              styles.primaryButton,
              isLoading &&
                styles.primaryButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator
                color={Colors.surface}
              />
            ) : (
              <Text style={styles.primaryButtonText}>
                Se connecter
              </Text>
            )}
          </Pressable>

          <View style={styles.switchLine}>
            <Text style={styles.switchText}>
              Pas encore de compte ?{' '}
            </Text>

            <Pressable
              onPress={handleCreateAccount}
              disabled={isLoading}
            >
              <Text style={styles.switchLink}>
                Créer un compte
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  hero: {
    height: 56,
    flexShrink: 0,
    alignItems: 'center',
    paddingHorizontal: 22,
    justifyContent: 'center',
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

  input: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    marginBottom: 12,
  },

  forgotText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: Colors.accent,
  },

  errorContainer: {
    marginBottom: 12,
  },

  errorText: {
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
