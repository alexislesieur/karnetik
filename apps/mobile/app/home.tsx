import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Karnetik</Text>
      <Text style={styles.subtitle}>
        Ton compte a bien été créé.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: Colors.surface,
  },

  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: Colors.texte,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.attenue,
    textAlign: 'center',
  },
});
