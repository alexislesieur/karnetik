import { useEffect, useRef, useState } from 'react';
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
import Svg, { Circle, Path } from 'react-native-svg';

import {
  resendPasswordReset,
  resendVerification,
  verifyEmail,
  verifyPasswordReset,
} from '@/api/client';
import { Colors } from '@/constants/colors';

export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();

  const {
    email = '',
    mode,
  } = useLocalSearchParams<{
    email?: string;
    mode?: string;
  }>();

  const isPasswordReset =
    mode === 'password-reset';

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] =
    useState(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  async function handleVerify() {
    if (code.length !== 6 || isLoading) {
      return;
    }

    Keyboard.dismiss();
    setError(null);
    setIsLoading(true);

    try {
      if (isPasswordReset) {
        await verifyPasswordReset({
          email,
          code,
        });

        router.replace({
          pathname: '/reset-password',
          params: {
            email,
            code,
          },
        });

        return;
      }

      await verifyEmail({
        email,
        code,
      });

      router.replace('/email-success');
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

  async function handleResend() {
    if (isResending || isLoading) {
      return;
    }

    Keyboard.dismiss();
    setError(null);
    setIsResending(true);

    try {
      if (isPasswordReset) {
        await resendPasswordReset({
          email,
        });
      } else {
        await resendVerification({
          email,
        });
      }

      setCode('');

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de renvoyer le code.',
      );
    } finally {
      setIsResending(false);
    }
  }

  function handleCodeChange(value: string) {
    const digitsOnly = value
      .replace(/\D/g, '')
      .slice(0, 6);

    setCode(digitsOnly);
    setError(null);

    if (digitsOnly.length === 6) {
      Keyboard.dismiss();
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

      <View style={styles.content}>
        <View style={styles.icon}>
          <Svg
            width={34}
            height={34}
            viewBox="0 0 24 24"
          >
            <Path
              d="M4 4h16v16H4z"
              fill="none"
              stroke={Colors.accent}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />

            <Path
              d="M4 6l8 6 8-6"
              fill="none"
              stroke={Colors.accent}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        <Text style={styles.title}>
          Vérifiez votre email
        </Text>

        <Text style={styles.subtitle}>
          Entrez le code à 6 chiffres envoyé à
        </Text>

        <Text style={styles.email}>
          {email}
        </Text>

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handleCodeChange}
          keyboardType="number-pad"
          maxLength={6}
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          style={styles.codeInput}
          editable={!isLoading}
          onSubmitEditing={handleVerify}
        />

        <Pressable
          style={styles.digits}
          onPress={() => inputRef.current?.focus()}
        >
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <View
                key={index}
                style={[
                  styles.digit,
                  code.length > index &&
                    styles.digitFilled,
                  error &&
                    styles.digitError,
                ]}
              >
                <Text style={styles.digitText}>
                  {code[index] ?? ''}
                </Text>
              </View>
            ),
          )}
        </Pressable>

        {error && (
          <View style={styles.errorContainer}>
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

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        <Pressable
          style={[
            styles.verifyButton,
            (code.length !== 6 || isLoading) &&
              styles.verifyButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={
            code.length !== 6 || isLoading
          }
        >
          <Text style={styles.verifyButtonText}>
            {isLoading
              ? 'Vérification...'
              : 'Vérifier le code'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.resendButton}
          onPress={handleResend}
          disabled={isResending || isLoading}
        >
          <Text style={styles.resendText}>
            {isResending
              ? 'Envoi...'
              : 'Renvoyer le code'}
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

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 25,
  },

  icon: {
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
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    color: Colors.attenue,
    textAlign: 'center',
  },

  email: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 15,
    color: Colors.texte,
    marginTop: 4,
    marginBottom: 26,
  },

  codeInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  digits: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  digit: {
    width: 44,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.fond,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  digitFilled: {
    borderColor: Colors.accent,
    backgroundColor: Colors.surface,
  },

  digitError: {
    borderColor: Colors.erreur,
  },

  digitText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    color: Colors.texte,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },

  errorText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    color: Colors.erreur,
  },

  verifyButton: {
    width: '100%',
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },

  verifyButtonDisabled: {
    opacity: 0.5,
  },

  verifyButtonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: Colors.surface,
  },

  resendButton: {
    paddingVertical: 16,
  },

  resendText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: Colors.accent,
  },
});
