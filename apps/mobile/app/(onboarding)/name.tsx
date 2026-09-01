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
import Svg, { Circle, Path } from 'react-native-svg';
import { completeOnboarding } from '@/api/client';
import { Colors } from '@/constants/colors';

export default function OnboardingNameScreen() {
  const insets = useSafeAreaInsets();

  const [prenom, setPrenom] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const normalizedPrenom = prenom.trim();

  function handleNameChange(value: string) {
    setPrenom(value);

    if (error && value.trim().length > 0) {
      setError(false);
    }
  }

  async function handleContinue() {
    Keyboard.dismiss();

    const name = prenom.trim();

    if (name.length < 2) {
      setError(true);
      return;
    }

    try {
      setIsLoading(true);
      setError(false);

      await completeOnboarding(name);

      router.replace('/(onboarding)/vehicle');
    } catch {
      setError(true);
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
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepDot} />

          <Text style={styles.stepLabel}>
            Étape 1 sur 2
          </Text>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />

        <View
          style={[
            styles.avatarRing,
            normalizedPrenom.length > 0 &&
              styles.avatarRingFilled,
          ]}
        >
          {normalizedPrenom.length > 0 ? (
            <Text style={styles.avatarLetter}>
              {normalizedPrenom.charAt(0).toUpperCase()}
            </Text>
          ) : (
            <Svg
              width={50}
              height={50}
              viewBox="0 0 24 24"
              fill="none"
            >
              <Circle
                cx="12"
                cy="8"
                r="4"
                stroke={Colors.accent}
                strokeWidth={1.6}
              />

              <Path
                d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
                stroke={Colors.accent}
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            </Svg>
          )}
        </View>

        <View style={styles.titleContainer}>
          {normalizedPrenom.length > 0 ? (
            <>
              <Text style={styles.title}>
                Bonjour
              </Text>

              <Text style={styles.title}>
                {normalizedPrenom}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>
                Comment vous
              </Text>

              <Text style={styles.title}>
                appelez-vous ?
              </Text>
            </>
          )}
        </View>

        <Text style={styles.subtitle}>
          On l'utilisera pour personnaliser votre carnet.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            Prénom
          </Text>

          <View
            style={[
              styles.inputWrap,
              error && styles.inputWrapInvalid,
            ]}
          >
            <TextInput
              style={styles.input}
              value={prenom}
              onChangeText={handleNameChange}
              placeholder="Alex"
              placeholderTextColor="#A9AFAD"
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="given-name"
              textContentType="givenName"
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Svg
                width={12}
                height={12}
                viewBox="0 0 24 24"
                fill="none"
              >
                <Circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke={Colors.erreur}
                  strokeWidth={2.5}
                />

                <Path
                  d="M12 8v5M12 16h.01"
                  stroke={Colors.erreur}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </Svg>

              <Text style={styles.errorText}>
                Merci de renseigner votre prénom
              </Text>
            </View>
          )}
        </View>

        <Pressable
          style={[
            styles.primaryButton,
            isLoading && styles.primaryButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator
              color={Colors.surface}
            />
          ) : (
            <Text style={styles.primaryButtonText}>
              Continuer
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },

  hero: {
    height: 56,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepDot: {
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.bordure,
    marginRight: 6,
  },

  stepDotActive: {
    backgroundColor: Colors.accent,
  },

  stepLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: Colors.attenue,
    marginLeft: 2,
  },

  sheet: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 30,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  blob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: Colors.accentClair,
  },

  blob1: {
    width: 180,
    height: 180,
    top: -60,
    right: -60,
    opacity: 0.6,
  },

  blob2: {
    width: 140,
    height: 140,
    bottom: 60,
    left: -60,
    opacity: 0.4,
  },

  avatarRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    backgroundColor: Colors.accentClair,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.accent,
  },

  avatarRingFilled: {
    backgroundColor: Colors.accent,
    borderWidth: 0,
  },

  avatarLetter: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 56,
    color: Colors.surface,
  },

  titleContainer: {
    minHeight: 61,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    lineHeight: 30,
    color: Colors.texte,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    lineHeight: 23,
    color: Colors.attenue,
    textAlign: 'center',
    maxWidth: 260,
    marginBottom: 30,
  },

  field: {
    width: '100%',
    marginBottom: 8,
  },

  label: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: Colors.texte,
    marginBottom: 7,
  },

  inputWrap: {
    width: '100%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.fond,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 12,
  },

  inputWrapInvalid: {
    borderColor: Colors.erreur,
  },

  input: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 13,
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
    marginTop: 'auto',
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
