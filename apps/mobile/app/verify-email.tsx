import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Path,
  Rect,
} from 'react-native-svg';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import {
  resendVerificationCode,
  verifyEmail,
} from '@/api/client';
import { Colors } from '@/constants/colors';

const CODE_LENGTH = 6;
const RESEND_DELAY = 30;
const SUCCESS_DURATION = 2000;

export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();

  const { email } =
    useLocalSearchParams<{
      email?: string;
    }>();

  const [code, setCode] = useState<string[]>(
    Array(CODE_LENGTH).fill(''),
  );

  const [seconds, setSeconds] =
    useState(RESEND_DELAY);

  const [showError, setShowError] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState(
      'Veuillez saisir les 6 chiffres du code',
    );

  const [isVerifying, setIsVerifying] =
    useState(false);

  const [isResending, setIsResending] =
    useState(false);

  const [isSuccess, setIsSuccess] =
    useState(false);

  const inputRefs =
    useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0 || isSuccess) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((value) =>
        Math.max(0, value - 1),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, isSuccess]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    Keyboard.dismiss();

    const timer = setTimeout(() => {
      router.replace('/home');
    }, SUCCESS_DURATION);

    return () => clearTimeout(timer);
  }, [isSuccess]);

  const emailDisplay =
    email || 'nom@exemple.fr';

  function updateCodeAt(
    index: number,
    value: string,
  ) {
    const digits = value.replace(
      /[^0-9]/g,
      '',
    );

    if (digits.length === 0) {
      const next = [...code];
      next[index] = '';

      setCode(next);
      setShowError(false);

      return;
    }

    // Gestion du collage d'un code complet.
    if (digits.length > 1) {
      const pastedDigits = digits.slice(
        0,
        CODE_LENGTH,
      );

      const next = Array(
        CODE_LENGTH,
      ).fill('');

      pastedDigits
        .split('')
        .forEach((digit, i) => {
          next[i] = digit;
        });

      setCode(next);
      setShowError(false);

      if (
        pastedDigits.length ===
        CODE_LENGTH
      ) {
        Keyboard.dismiss();
      } else {
        const focusIndex = Math.min(
          index + pastedDigits.length,
          CODE_LENGTH - 1,
        );

        inputRefs.current[
          focusIndex
        ]?.focus();
      }

      return;
    }

    const next = [...code];
    next[index] = digits;

    setCode(next);
    setShowError(false);

    if (index < CODE_LENGTH - 1) {
      inputRefs.current[
        index + 1
      ]?.focus();
    } else {
      Keyboard.dismiss();
    }
  }

  function handleKeyPress(
    index: number,
    key: string,
  ) {
    if (
      key === 'Backspace' &&
      code[index] === '' &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }
  }

  async function handleVerify() {
    Keyboard.dismiss();

    const fullCode = code.join('');

    if (
      fullCode.length !== CODE_LENGTH
    ) {
      setErrorMessage(
        'Veuillez saisir les 6 chiffres du code',
      );
      setShowError(true);
      return;
    }

    if (!email) {
      setErrorMessage(
        'Adresse email introuvable.',
      );
      setShowError(true);
      return;
    }

    try {
      setIsVerifying(true);
      setShowError(false);

      await verifyEmail({
        email,
        code: fullCode,
      });

      Keyboard.dismiss();
      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Le code de vérification est incorrect.',
      );

      setShowError(true);
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    Keyboard.dismiss();

    if (
      seconds > 0 ||
      !email ||
      isResending
    ) {
      return;
    }

    try {
      setIsResending(true);
      setShowError(false);

      await resendVerificationCode(
        email,
      );

      setSeconds(RESEND_DELAY);

      setCode(
        Array(CODE_LENGTH).fill(''),
      );

      inputRefs.current[0]?.focus();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Impossible de renvoyer le code.',
      );

      setShowError(true);
    } finally {
      setIsResending(false);
    }
  }

  function formatCountdown(
    value: number,
  ) {
    const minutes = Math.floor(
      value / 60,
    );

    const remainingSeconds =
      value % 60;

    return `${minutes}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  }

  if (isSuccess) {
    return (
      <View
        style={[
          styles.successScreen,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <View
          style={[
            styles.confetti,
            styles.confettiOne,
          ]}
        />

        <View
          style={[
            styles.confetti,
            styles.confettiTwo,
          ]}
        />

        <View
          style={[
            styles.confetti,
            styles.confettiThree,
          ]}
        />

        <View
          style={[
            styles.confetti,
            styles.confettiFour,
          ]}
        />

        <View
          style={[
            styles.confetti,
            styles.confettiFive,
          ]}
        />

        <View style={styles.successBadge}>
          <Svg
            width={44}
            height={44}
            viewBox="0 0 24 24"
          >
            <Path
              d="M5 13l4 4L19 7"
              fill="none"
              stroke={Colors.succes}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        <Text style={styles.successTitle}>
          Email vérifié
        </Text>

        <Text style={styles.successText}>
          Votre adresse a bien été confirmée.
          Encore deux petites étapes avant de
          retrouver votre carnet.
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
            />
          </Svg>
        </Pressable>
      </View>

      <View style={styles.sheet}>
        <View style={styles.envelope}>
          <Svg
            width={34}
            height={34}
            viewBox="0 0 24 24"
          >
            <Rect
              x="3"
              y="5"
              width="18"
              height="14"
              rx="2"
              fill="none"
              stroke={Colors.accent}
              strokeWidth={1.8}
            />

            <Path
              d="M3 7l9 6 9-6"
              fill="none"
              stroke={Colors.accent}
              strokeWidth={1.8}
            />
          </Svg>
        </View>

        <Text style={styles.title}>
          Vérifiez votre email
        </Text>

        <Text style={styles.subtitle}>
          Un code à 6 chiffres a été envoyé à{'\n'}
          <Text style={styles.email}>
            {emailDisplay}
          </Text>
        </Text>

        <View style={styles.otpRow}>
          {code.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[
                  index
                ] = ref;
              }}
              style={[
                styles.otpBox,
                showError &&
                  styles.otpBoxInvalid,
              ]}
              value={value}
              onChangeText={(text) =>
                updateCodeAt(
                  index,
                  text,
                )
              }
              onKeyPress={({
                nativeEvent,
              }) =>
                handleKeyPress(
                  index,
                  nativeEvent.key,
                )
              }
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={CODE_LENGTH}
              selectTextOnFocus
              textAlign="center"
              autoCorrect={false}
              autoCapitalize="none"
              editable={!isVerifying}
              accessibilityLabel={`Chiffre ${
                index + 1
              } du code`}
            />
          ))}
        </View>

        {showError && (
          <View style={styles.errorRow}>
            <CircleIcon
              color={Colors.erreur}
            />

            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          </View>
        )}

        <View
          style={styles.resendContainer}
        >
          {seconds > 0 ? (
            <Text style={styles.resendText}>
              Aucun code reçu ? Renvoyer dans{' '}
              <Text
                style={
                  styles.resendValue
                }
              >
                {formatCountdown(
                  seconds,
                )}
              </Text>
            </Text>
          ) : (
            <Pressable
              onPress={handleResend}
              disabled={isResending}
              accessibilityRole="button"
            >
              <Text
                style={styles.resendText}
              >
                Aucun code reçu ?{' '}
                <Text
                  style={
                    styles.resendLink
                  }
                >
                  {isResending
                    ? 'Envoi...'
                    : 'Renvoyer le code'}
                </Text>
              </Text>
            </Pressable>
          )}
        </View>

        <Pressable
          style={[
            styles.primaryButton,
            isVerifying &&
              styles.primaryButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={isVerifying}
          accessibilityRole="button"
          accessibilityState={{
            disabled: isVerifying,
          }}
        >
          {isVerifying ? (
            <View
              style={styles.loadingContent}
            >
              <ActivityIndicator
                size="small"
                color={Colors.surface}
              />

              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Vérification...
              </Text>
            </View>
          ) : (
            <Text
              style={
                styles.primaryButtonText
              }
            >
              Vérifier
            </Text>
          )}
        </Pressable>

        <Text style={styles.changeEmail}>
          Mauvaise adresse ?{' '}
          <Text
            style={
              styles.changeEmailLink
            }
            onPress={() => {
              Keyboard.dismiss();
              router.back();
            }}
          >
            Modifier l’adresse
          </Text>
        </Text>
      </View>
    </Pressable>
  );
}

function CircleIcon({
  color,
}: {
  color: string;
}) {
  return (
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
        stroke={color}
        strokeWidth={2.5}
      />

      <Path
        d="M12 8v5M12 16h.01"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
      />
    </Svg>
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
    backgroundColor: Colors.fond,
    borderRadius: 12,
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

  envelope: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: '#E1EDEC',
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
    lineHeight: 23.25,
    color: Colors.attenue,
    marginBottom: 28,
  },

  email: {
    color: Colors.texte,
    fontFamily: 'Roboto_500Medium',
  },

  otpRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 10,
  },

  otpBox: {
    flex: 1,
    minHeight: 52,
    aspectRatio: 1,
    backgroundColor: Colors.fond,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 0,
    fontFamily: 'Roboto_500Medium',
    fontSize: 22,
    fontWeight: '500',
    color: Colors.texte,
  },

  otpBoxInvalid: {
    borderColor: Colors.erreur,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
  },

  errorText: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    color: Colors.erreur,
  },

  resendContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },

  resendText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Colors.attenue,
    textAlign: 'center',
  },

  resendValue: {
    color: Colors.accent,
    fontFamily: 'Roboto_500Medium',
  },

  resendLink: {
    color: Colors.accent,
    fontFamily: 'Roboto_500Medium',
  },

  primaryButton: {
    width: '100%',
    minHeight: 44,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },

  primaryButtonDisabled: {
    opacity: 0.7,
  },

  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  primaryButtonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: Colors.surface,
  },

  changeEmail: {
    textAlign: 'center',
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Colors.attenue,
    marginTop: 16,
  },

  changeEmailLink: {
    color: Colors.accent,
    fontFamily: 'Roboto_500Medium',
  },

  successScreen: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
    position: 'relative',
    overflow: 'hidden',
  },

  successBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E1EDEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  successTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: Colors.texte,
    marginBottom: 10,
    textAlign: 'center',
  },

  successText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    lineHeight: 24,
    color: Colors.attenue,
    maxWidth: 260,
    textAlign: 'center',
  },

  confetti: {
    position: 'absolute',
    borderRadius: 3,
    opacity: 0.5,
  },

  confettiOne: {
    width: 8,
    height: 8,
    top: '18%',
    left: '20%',
    transform: [
      {
        rotate: '20deg',
      },
    ],
    backgroundColor: Colors.accent,
  },

  confettiTwo: {
    width: 6,
    height: 6,
    top: '14%',
    left: '72%',
    transform: [
      {
        rotate: '-15deg',
      },
    ],
    backgroundColor: '#A6631A',
  },

  confettiThree: {
    width: 7,
    height: 7,
    top: '28%',
    left: '82%',
    transform: [
      {
        rotate: '40deg',
      },
    ],
    backgroundColor: '#3A5A78',
  },

  confettiFour: {
    width: 6,
    height: 6,
    top: '22%',
    left: '10%',
    transform: [
      {
        rotate: '-30deg',
      },
    ],
    backgroundColor: Colors.accent,
  },

  confettiFive: {
    width: 8,
    height: 8,
    top: '10%',
    left: '48%',
    transform: [
      {
        rotate: '10deg',
      },
    ],
    backgroundColor: Colors.succes,
  },
});
