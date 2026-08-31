import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function SplashScreen() {
  const badgeScale = useRef(new Animated.Value(0.4)).current;
  const badgeRotate = useRef(new Animated.Value(-8)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordTranslateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.spring(badgeScale, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();

    Animated.timing(badgeRotate, {
      toValue: 0,
      duration: 650,
      useNativeDriver: true,
    }).start();

    Animated.timing(wordOpacity, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(wordTranslateY, {
      toValue: 0,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const badgeRotateInterpolated = badgeRotate.interpolate({
    inputRange: [-8, 0],
    outputRange: ['-8deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <Animated.View
        style={[
          styles.badge,
          {
            transform: [{ scale: badgeScale }, { rotate: badgeRotateInterpolated }],
          },
        ]}
      >
        <Svg width={76} height={76} viewBox="0 0 200 200">
          <Rect width={200} height={200} rx={48} fill={Colors.surface} />
          <Path
            d="M586 584 430 416V0H130V1456H430V796L562 977L933 1456H1302L785 809L1317 0H960Z"
            transform="translate(68.26,136.00) scale(0.048828,-0.048828)"
            fill={Colors.accent}
          />
        </Svg>
      </Animated.View>

      <Animated.Text
        style={[
          styles.word,
          { opacity: wordOpacity, transform: [{ translateY: wordTranslateY }] },
        ]}
      >
        KARNETIK
      </Animated.Text>
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
    width: 200,
    height: 200,
    top: -60,
    left: -60,
  },
  blob2: {
    width: 260,
    height: 260,
    bottom: -100,
    right: -80,
  },
  badge: {
    width: 76,
    height: 76,
    marginBottom: 18,
  },
  word: {
    color: Colors.surface,
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    letterSpacing: 2,
  },
});
