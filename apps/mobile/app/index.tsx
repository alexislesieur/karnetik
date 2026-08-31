import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <View style={styles.content}>
        <Svg
          width={80}
          height={80}
          viewBox="0 0 200 200"
          style={styles.badge}
        >
          <Rect
            width={200}
            height={200}
            rx={48}
            fill={Colors.surface}
          />

          <Path
            d="M586 584 430 416V0H130V1456H430V796L562 977L933 1456H1302L785 809L1317 0H960Z"
            transform="translate(68.26,136.00) scale(0.048828,-0.048828)"
            fill={Colors.accent}
          />
        </Svg>

        <Text style={styles.word}>KARNETIK</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  blob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: Colors.surface,
    opacity: 0.15,
  },

  blob1: {
    width: 220,
    height: 220,
    top: -70,
    left: -70,
  },

  blob2: {
    width: 280,
    height: 280,
    bottom: -110,
    right: -90,
  },

  content: {
    alignItems: 'center',
  },

  badge: {
    marginBottom: 18,
  },

  word: {
    color: Colors.surface,
    fontFamily: 'Roboto_700Bold',
    fontSize: 23,
    letterSpacing: 2,
  },
});
