import { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { Colors } from '@/constants/colors';

export default function EmailSuccessScreen() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(app)/home');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.icon}>
          <Svg width={34} height={34} viewBox="0 0 24 24">
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

        <Text style={styles.title}>
          Email vérifié
        </Text>

        <Text style={styles.subtitle}>
          Votre adresse email a bien été vérifiée.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  content: {
    alignItems: 'center',
  },

  icon: {
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
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    lineHeight: 23,
    color: Colors.attenue,
    textAlign: 'center',
  },
});
