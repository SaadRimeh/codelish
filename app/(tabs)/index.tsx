import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCodelishContext } from '@/context/CodelishContext';
import { CodelishCard } from '@/components/CodelishCard';
import { ChartBar, GraduationCap, UsersRound } from 'lucide-react-native';

export default function HomeScreen() {
  const { courses, students, groups } = useCodelishContext();
  const router = useRouter();

  const handleCardPress = (route: string) => {
    router.push(route);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.cardsContainer}>
        <TouchableOpacity 
          style={styles.cardWrapper}
          onPress={() => handleCardPress('/courses')}
          activeOpacity={0.8}
        >
          <CodelishCard
            title="Total Courses"
            value={courses.length}
            icon={<ChartBar size={28} color="#2e8b57" />}
            description="Active courses at Codelish Institute"
            color="#e6f7ee"
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cardWrapper}
          onPress={() => handleCardPress('/groups')}
          activeOpacity={0.8}
        >
          <CodelishCard
            title="Total Groups"
            value={groups.length}
            icon={<GraduationCap size={28} color="#2e8b57" />}
            description="Study groups at Codelish Institute"
            color="#f0f7e6"
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cardWrapper}
          onPress={() => handleCardPress('/students')}
          activeOpacity={0.8}
        >
          <CodelishCard
            title="Total Students"
            value={students.length}
            icon={<UsersRound size={28} color="#2e8b57" />}
            description="Students enrolled at Codelish Institute"
            color="#e6eff7"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 16,
  },
  cardsContainer: {
    gap: 16,
  },
  cardWrapper: {
    width: '100%',
  },
});