import { StyleSheet, Text, View, Pressable } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Colors } from '@/constants/colors';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <View style={styles.top}>
        <Svg width={68} height={68} viewBox="0 0 200 200" style={styles.badge}>
          <Rect width={200} height={200} rx={48} fill={Colors.surface} />
          <Path
            d="M586 584 430 416V0H130V1456H430V796L562 977L933 1456H1302L785 809L1317 0H960Z"
            transform="translate(68.26,136.00) scale(0.048828,-0.048828)"
            fill={Colors.accent}
          />
        </Svg>

        <Text style={styles.word}>KARNETIK</Text>

        <Text style={styles.tag}>
          Votre carnet d'entretien digital
        </Text>
      </View>

      <View style={styles.bottom}>
        <Pressable style={styles.btnSolid} onPress={() => {}}>
          <Text style={styles.btnSolidText}>Créer un compte</Text>
        </Pressable>

        <Pressable style={styles.btnOutline} onPress={() => {}}>
          <Text style={styles.btnOutlineText}>Se connecter</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: 32,
    paddingHorizontal: 30,
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

  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  badge: {
    marginBottom: 18,
  },

  word: {
    color: Colors.surface,
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  tag: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22.4,
    maxWidth: 240,
  },

  bottom: {
    width: '100%',
    zIndex: 2,
    gap: 10,
    paddingBottom: 24,
  },

  btnSolid: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },

  btnSolidText: {
    color: Colors.accent,
    fontFamily: 'Roboto_500Medium',
    fontSize: 14.5,
  },

  btnOutline: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    paddingVertical: 13.5,
    alignItems: 'center',
  },

  btnOutlineText: {
    color: Colors.surface,
    fontFamily: 'Roboto_500Medium',
    fontSize: 14.5,
  },
});
