import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { register } from '@/api/client';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] =
    useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [cguAccepted, setCguAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cguError, setCguError] = useState(false);

  const passwordsMatch =
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation;

  const passwordsDoNotMatch =
    passwordConfirmation.length > 0 &&
    password !== passwordConfirmation;

  const passwordStrength = getPasswordStrength(password);

  async function handleRegister() {
    setErrorMessage('');
    setCguError(false);

    if (!email.trim()) {
      setErrorMessage('Veuillez renseigner votre adresse email.');
      return;
    }

    if (!password) {
      setErrorMessage('Veuillez renseigner votre mot de passe.');
      return;
    }

    if (password !== passwordConfirmation) {
      return;
    }

    if (!cguAccepted) {
      setCguError(true);
      return;
    }

    try {
      setIsLoading(true);

      const response = await register({
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });

      console.log('Inscription réussie :', response.user);
      console.log('Token reçu :', response.token);

      router.replace('/home');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de l’inscription.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.hero}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Svg width={18} height={18} viewBox="0 0 24 24">
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
        <Text style={styles.title}>Créer un compte</Text>

        <Text style={styles.subtitle}>
          Ça prend moins d'une minute
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="nom@exemple.fr"
              placeholderTextColor="#A9AFAD"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setErrorMessage('');
              }}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mot de passe</Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.inputPassword}
              placeholder="••••••••"
              placeholderTextColor="#A9AFAD"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
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
              <EyeIcon />
            </Pressable>
          </View>

          <View style={styles.strengthRow}>
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.strengthBar,
                  index < passwordStrength && {
                    backgroundColor: getStrengthColor(
                      passwordStrength,
                    ),
                  },
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
              passwordsDoNotMatch && styles.inputWrapError,
            ]}
          >
            <TextInput
              style={styles.inputPassword}
              placeholder="••••••••"
              placeholderTextColor="#A9AFAD"
              secureTextEntry={!showPasswordConfirmation}
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              autoCapitalize="none"
              autoCorrect={false}
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
              <EyeIcon />
            </Pressable>
          </View>

          {passwordsDoNotMatch && (
            <View style={styles.feedbackRow}>
              <CircleIcon color={Colors.erreur} />

              <Text style={styles.errorText}>
                Les mots de passe ne correspondent pas
              </Text>
            </View>
          )}

          {passwordsMatch && (
            <View style={styles.feedbackRow}>
              <CircleIcon color={Colors.succes} check />

              <Text style={styles.successText}>
                Les mots de passe correspondent
              </Text>
            </View>
          )}
        </View>

        <Pressable
          style={styles.consent}
          onPress={() => {
            setCguAccepted((value) => !value);
            setCguError(false);
          }}
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: cguAccepted,
          }}
        >
          <Checkbox checked={cguAccepted} />

          <Text style={styles.consentText}>
            J'accepte les{' '}
            <Text style={styles.consentLink}>
              conditions générales d'utilisation
            </Text>{' '}
            et la{' '}
            <Text style={styles.consentLink}>
              politique de confidentialité
            </Text>
          </Text>
        </Pressable>

        {cguError && (
          <Text style={styles.consentError}>
            Cochez cette case pour continuer
          </Text>
        )}

        <Pressable
          style={styles.consent}
          onPress={() =>
            setMarketingAccepted((value) => !value)
          }
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: marketingAccepted,
          }}
        >
          <Checkbox checked={marketingAccepted} />

          <Text style={styles.consentText}>
            J'accepte de recevoir des conseils d'entretien et
            actualités Karnetik par email{' '}
            <Text style={styles.optional}>
              (facultatif)
            </Text>
          </Text>
        </Pressable>

        {errorMessage !== '' && (
          <Text style={styles.formError}>
            {errorMessage}
          </Text>
        )}

        <Pressable
          style={[
            styles.primaryButton,
            isLoading && styles.primaryButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityState={{
            disabled: isLoading,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.surface} />
          ) : (
            <Text style={styles.primaryButtonText}>
              Créer mon compte
            </Text>
          )}
        </Pressable>

        <Text style={styles.switchLine}>
          Déjà un compte ?{' '}
          <Text
            style={styles.switchLink}
            onPress={() => {}}
          >
            Se connecter
          </Text>
        </Text>
      </View>
    </View>
  );
}

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;

  if (
    /[0-9]/.test(password) &&
    /[A-Z]/.test(password)
  ) {
    score++;
  }

  return score;
}

function getStrengthColor(strength: number) {
  if (strength === 1) return Colors.erreur;
  if (strength === 2) return Colors.avertissement;
  return Colors.succes;
}

function EyeIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
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
  );
}

function CircleIcon({
  color,
  check = false,
}: {
  color: string;
  check?: boolean;
}) {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
      />

      {check ? (
        <Path
          d="M8.5 12.5l2.5 2.5 4.5-5"
          fill="none"
          stroke={color}
          strokeWidth={2.5}
        />
      ) : (
        <Path
          d="M12 8v5M12 16h.01"
          fill="none"
          stroke={color}
          strokeWidth={2.5}
        />
      )}
    </Svg>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View
      style={[
        styles.checkbox,
        checked && styles.checkboxChecked,
      ]}
    >
      {checked && (
        <Svg width={12} height={12} viewBox="0 0 24 24">
          <Path
            d="M4 12l5 5L20 6"
            fill="none"
            stroke={Colors.surface}
            strokeWidth={3}
          />
        </Svg>
      )}
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.fond,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 12,
  },

  inputWrapError: {
    borderColor: Colors.erreur,
  },

  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.texte,
  },

  inputPassword: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.texte,
  },

  eyeButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 13,
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

  feedbackRow: {
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

  successText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    color: Colors.succes,
  },

  consent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 13,
  },

  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.bordure,
    backgroundColor: Colors.fond,
    flexShrink: 0,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },

  consentText: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    lineHeight: 21.7,
    color: Colors.attenue,
  },

  consentLink: {
    color: Colors.accent,
    fontFamily: 'Roboto_500Medium',
  },

  optional: {
    color: Colors.attenue,
  },

  consentError: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    lineHeight: 19,
    color: Colors.erreur,
    marginTop: -3,
    marginBottom: 13,
    marginLeft: 30,
  },

  formError: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13.5,
    lineHeight: 19,
    color: Colors.erreur,
    marginBottom: 10,
  },

  primaryButton: {
    width: '100%',
    minHeight: 44,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
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
    color: Colors.accent,
    fontFamily: 'Roboto_500Medium',
  },
});
