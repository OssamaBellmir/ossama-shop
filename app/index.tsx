import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../constants/Colors'; // Assurez-vous d'avoir créé ce fichier à l'étape 1
import { globalStyles } from '../constants/Styles'; // Assurez-vous d'avoir créé ce fichier à l'étape 1

const { width, height } = Dimensions.get('window');

// Données des slides (basées sur vos images 5 et 6)
const SLIDES = [
  {
    id: '1',
    image: require('../assets/images/splash-icon.png'), // Image temporaire, mettez vos propres images plus tard
    title: 'Your Shopping Destination for Everything',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  },
  {
    id: '2',
    image: require('../assets/images/icon.png'),
    title: 'Swift and Reliable Delivery',
    subtitle: 'Get your products delivered fast and secure right to your doorstep.',
  },
  {
    id: '3',
    image: require('../assets/images/favicon.png'),
    title: 'Wishlist to Dream Product',
    subtitle: 'Save your favorite items and track their prices easily.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Fonction pour gérer le défilement et mettre à jour les points (dots)
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentIndex(roundIndex);
  };

  // Fonction pour aller au slide suivant ou terminer
  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/login' as any);
    }
  };

  const handleSkip = () => {
    router.push('/login' as any);
  };

  return (
    <View style={styles.container}>
      {/* Bouton Skip en haut à droite */}
      <View style={styles.header}>
         <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
         </TouchableOpacity>
      </View>

      {/* Carrousel d'images */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image 
                source={item.image} 
                style={styles.image} 
                resizeMode="contain" 
            />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      {/* Indicateurs (Points) */}
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Boutons du bas */}
      <View style={styles.footer}>
        {/* Bouton Principal Rouge */}
        <TouchableOpacity style={globalStyles.primaryButton} onPress={handleNext}>
          <Text style={globalStyles.primaryButtonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

        {/* Lien "Already have an account?" */}
        <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 40, // Pour éviter la barre de statut
  },
  skipText: {
    color: Colors.textGray,
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    width: width,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
    marginTop: 20,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 20, // Le point actif est plus large
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    marginTop: 20,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: Colors.textGray,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary, // Texte rouge
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});