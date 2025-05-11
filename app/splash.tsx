import { useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { router } from 'expo-router';
import { useCodelishContext } from '@/context/CodelishContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const { isDataLoaded } = useCodelishContext();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const translateY = new Animated.Value(50);
  const logoRotate = new Animated.Value(0);

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Scale up with spring effect
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 45,
        useNativeDriver: true,
      }),
      // Slide up
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Rotate slightly
      Animated.sequence([
        Animated.timing(logoRotate, {
          toValue: -0.05,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 0.05,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(logoRotate, {
          toValue: 0,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Exit animations after delay
    const timer = setTimeout(() => {
      if (isDataLoaded) {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -50,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          router.replace('/(tabs)');
        });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isDataLoaded, fadeAnim, scaleAnim, translateY, logoRotate]);

  const spin = logoRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-30deg', '30deg'],
  });

  return (
    <LinearGradient
      colors={['#2e8b57', '#1a4d31', '#ff8c00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY },
              { rotate: spin },
            ],
          },
        ]}
      >
        <Text style={styles.logoText}>Codelish</Text>
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>Institute Management</Text>
          <View style={styles.underline} />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 56,
    fontFamily: 'Inter-Bold',
    color: '#2e8b57',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#555555',
    textAlign: 'center',
    marginBottom: 8,
  },
  underline: {
    width: '80%',
    height: 2,
    backgroundColor: '#ff8c00',
    borderRadius: 1,
  },
});