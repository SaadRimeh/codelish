import { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Text, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCodelishContext } from '@/context/CodelishContext';
import { CodelishButton } from '@/components/CodelishButton';
import { StudentItem } from '@/components/StudentItem';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';

export default function StudentsScreen() {
  const { students, courses, groups, addStudent } = useCodelishContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!selectedCourse) newErrors.course = 'Please select a course';
    if (!selectedGroup) newErrors.group = 'Please select a group';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStudent = () => {
    if (validateForm()) {
      addStudent({
        id: Date.now().toString(),
        name,
        phone,
        grade: grade || 'N/A',
        courseId: selectedCourse,
        groupId: selectedGroup,
        attendance: []
      });
      
      // Reset form
      setName('');
      setPhone('');
      setGrade('');
      setSelectedCourse('');
      setSelectedGroup('');
      setErrors({});
    }
  };

  // Filter groups based on selected course
  const filteredGroups = selectedCourse 
    ? groups.filter(group => group.courseId === selectedCourse)
    : [];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Student</Text>
          
          <Text style={styles.formLabel}>Name</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name && text.trim()) {
                const { name, ...restErrors } = errors;
                setErrors(restErrors);
              }
            }}
            placeholder="Enter student name"
            placeholderTextColor="#999"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          
          <Text style={styles.formLabel}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone ? styles.inputError : null]}
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone && text.trim()) {
                const { phone, ...restErrors } = errors;
                setErrors(restErrors);
              }
            }}
            placeholder="Enter phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          
          <Text style={styles.formLabel}>Grade (Optional)</Text>
          <TextInput
            style={styles.input}
            value={grade}
            onChangeText={setGrade}
            placeholder="Enter grade (optional)"
            placeholderTextColor="#999"
          />
          
          <Text style={styles.formLabel}>Course</Text>
          <View style={[styles.pickerContainer, errors.course ? styles.pickerError : null]}>
            <Picker
              selectedValue={selectedCourse}
              onValueChange={(itemValue) => {
                setSelectedCourse(itemValue);
                setSelectedGroup(''); // Reset group when course changes
                if (errors.course) {
                  const { course, ...restErrors } = errors;
                  setErrors(restErrors);
                }
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select a course" value="" />
              {courses.map(course => (
                <Picker.Item key={course.id} label={course.name} value={course.id} />
              ))}
            </Picker>
          </View>
          {errors.course && <Text style={styles.errorText}>{errors.course}</Text>}
          
          <Text style={styles.formLabel}>Group</Text>
          <View style={[styles.pickerContainer, errors.group ? styles.pickerError : null]}>
            <Picker
              selectedValue={selectedGroup}
              onValueChange={(itemValue) => {
                setSelectedGroup(itemValue);
                if (errors.group) {
                  const { group, ...restErrors } = errors;
                  setErrors(restErrors);
                }
              }}
              style={styles.picker}
              enabled={selectedCourse !== ''}
            >
              <Picker.Item label={selectedCourse ? "Select a group" : "First select a course"} value="" />
              {filteredGroups.map(group => (
                <Picker.Item 
                  key={group.id} 
                  label={`${group.name} (Day: ${group.appointmentDay}, Time: ${group.appointmentTime})`} 
                  value={group.id} 
                />
              ))}
            </Picker>
          </View>
          {errors.group && <Text style={styles.errorText}>{errors.group}</Text>}
          
          <CodelishButton 
            title="Add to Codelish" 
            onPress={handleAddStudent}
            icon={<CheckCircle2 size={20} color="#fff" />}
          />
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>All Students</Text>
          {students.length === 0 ? (
            <Text style={styles.emptyText}>No students added yet.</Text>
          ) : (
            students.map((student) => {
              const course = courses.find(c => c.id === student.courseId);
              const group = groups.find(g => g.id === student.groupId);
              return (
                <StudentItem
                  key={student.id}
                  student={student}
                  courseName={course?.name || 'Unknown Course'}
                  groupName={group ? `${group.name} (${group.appointmentDay} at ${group.appointmentTime})` : 'No Group'}
                />
              );
            })
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    color: '#2e8b57',
  },
  formLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: -8,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerError: {
    borderColor: '#ff6b6b',
  },
  picker: {
    height: 50,
  },
  listContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    color: '#2e8b57',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    padding: 20,
  },
});