import { Tabs } from 'expo-router';
import { Chrome as Home, Users, BookOpen, Calendar, User } from 'lucide-react-native';
import { CodelishHeader } from '@/components/CodelishHeader';
import { StyleSheet, Text, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff8c00', // Dark orange
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: true,
        header: ({ route }) => {
          let title = '';
          switch (route.name) {
            case 'index':
              title = 'Codelish Dashboard';
              break;
            case 'courses':
              title = 'Codelish Courses';
              break;
            case 'students':
              title = 'Codelish Students';
              break;
            case 'attendance':
              title = 'Codelish Attendance';
              break;
            case 'profile':
              title = 'About Codelish';
              break;
          }
          return <CodelishHeader title={title} />;
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: 'Students',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Codelish',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          tabBarLabel: ({ color, focused }) => (
            <Text style={[styles.tabBarLabel, { color: focused ? '#ff8c00' : '#888888' }]}>
              Codelish
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 65,
    paddingTop: 5,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
});