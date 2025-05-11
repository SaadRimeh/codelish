import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GraduationCap as Graduation } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CodelishHeaderProps {
  title: string;
}

export function CodelishHeader({ title }: CodelishHeaderProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <LinearGradient
      colors={['#2e8b57', '#ff8c00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 8 }
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.logoContainer}>
          <Graduation size={24} color="#fff" />
          <Text style={styles.logoText}>Codelish</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    marginLeft: 6,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
});