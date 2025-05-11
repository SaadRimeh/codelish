import { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity,
  Alert,
  Animated,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCodelishContext } from '@/context/CodelishContext';
import { CodelishButton } from '@/components/CodelishButton';
import { Check, X, Users, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AttendanceScreen() {
  const { 
    courses, 
    groups, 
    students, 
    markAttendance 
  } = useCodelishContext();
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<{[key: string]: boolean}>({});
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  
  // Filter groups based on selected course
  const filteredGroups = useMemo(() => 
    selectedCourse ? groups.filter(group => group.courseId === selectedCourse) : [],
    [selectedCourse, groups]
  );
  
  // Filter students based on selected group
  const filteredStudents = useMemo(() => 
    selectedGroup ? students.filter(student => student.groupId === selectedGroup) : [],
    [selectedGroup, students]
  );
  
  useEffect(() => {
    // Initialize attendance records for all students in the selected group
    const initialRecords: {[key: string]: boolean} = {};
    filteredStudents.forEach(student => {
      initialRecords[student.id] = false;
    });
    setAttendanceRecords(initialRecords);

    // Animate when students are loaded
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedGroup, filteredStudents]);
  
  const toggleAttendance = (studentId: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));

    // Trigger haptic feedback on supported platforms
    if (Platform.OS !== 'web') {
      try {
        navigator.vibrate(50);
      } catch (e) {
        // Vibration not supported
      }
    }
  };
  
  const handleSaveAttendance = () => {
    if (!selectedCourse || !selectedGroup) {
      Alert.alert('Error', 'Please select a course and group');
      return;
    }
    
    if (filteredStudents.length === 0) {
      Alert.alert('No Students', 'There are no students in this group to mark attendance for');
      return;
    }
    
    const records = Object.entries(attendanceRecords).map(([studentId, present]) => ({
      studentId,
      date: attendanceDate.toISOString().split('T')[0],
      present
    }));
    
    markAttendance(records);
    
    Alert.alert(
      'Success',
      'Attendance has been saved successfully',
      [{ text: 'OK' }]
    );
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formContainer}>
        <LinearGradient
          colors={['#2e8b57', '#ff8c00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.dateContainer}
        >
          <Calendar size={24} color="#fff" />
          <Text style={styles.dateText}>{formatDate(attendanceDate)}</Text>
        </LinearGradient>
        
        <Text style={styles.formLabel}>Course</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCourse}
            onValueChange={(itemValue) => {
              setSelectedCourse(itemValue);
              setSelectedGroup('');
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select a course" value="" />
            {courses.map(course => (
              <Picker.Item key={course.id} label={course.name} value={course.id} />
            ))}
          </Picker>
        </View>
        
        <Text style={styles.formLabel}>Group</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedGroup}
            onValueChange={setSelectedGroup}
            style={styles.picker}
            enabled={selectedCourse !== ''}
          >
            <Picker.Item label={selectedCourse ? "Select a group" : "First select a course"} value="" />
            {filteredGroups.map(group => (
              <Picker.Item key={group.id} label={group.name} value={group.id} />
            ))}
          </Picker>
        </View>
      </View>
      
      {!selectedGroup ? (
        <View style={styles.emptyStateContainer}>
          <Users size={48} color="#2e8b57" style={styles.emptyStateIcon} />
          <Text style={styles.emptyStateTitle}>No Group Selected</Text>
          <Text style={styles.emptyStateText}>
            Please select a course and group to mark attendance for students.
          </Text>
        </View>
      ) : selectedGroup && filteredStudents.length > 0 ? (
        <Animated.View 
          style={[
            styles.attendanceContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Text style={styles.attendanceTitle}>Student Attendance</Text>
          
          {filteredStudents.map(student => (
            <TouchableOpacity 
              key={student.id}
              style={[
                styles.studentItem,
                attendanceRecords[student.id] && styles.studentItemPresent
              ]}
              onPress={() => toggleAttendance(student.id)}
              activeOpacity={0.7}
            >
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentPhone}>{student.phone}</Text>
              </View>
              
              <LinearGradient
                colors={attendanceRecords[student.id] 
                  ? ['#2e8b57', '#34a853'] 
                  : ['#ff6b6b', '#ff8c00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.attendanceButton}
              >
                {attendanceRecords[student.id] ? (
                  <Check size={20} color="#fff" />
                ) : (
                  <X size={20} color="#fff" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
          
          <CodelishButton 
            title="Save Attendance" 
            onPress={handleSaveAttendance}
            style={styles.saveButton}
          />
        </Animated.View>
      ) : selectedGroup ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No students in this group.</Text>
        </View>
      ) : null}
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
    paddingBottom: 100,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    marginLeft: 12,
  },
  formLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  attendanceContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  attendanceTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    color: '#2e8b57',
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    transform: [{ scale: 1 }],
  },
  studentItemPresent: {
    borderColor: '#2e8b57',
    backgroundColor: '#f0fff4',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  studentPhone: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  attendanceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 20,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  emptyStateContainer: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2e8b57',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});