import { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useCodelishContext } from '@/context/CodelishContext';
import { CodelishButton } from '@/components/CodelishButton';
import { CourseItem } from '@/components/CourseItem';
import { CircleCheck as CheckCircle2, X } from 'lucide-react-native';

export default function CoursesScreen() {
  const { courses, addCourse, updateCourse, deleteCourse } = useCodelishContext();
  const [courseName, setCourseName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [inputError, setInputError] = useState('');

  const handleAddCourse = () => {
    if (!courseName.trim()) {
      setInputError('Course name cannot be empty');
      return;
    }
    
    if (editMode && currentCourseId) {
      updateCourse(currentCourseId, { name: courseName });
      setEditMode(false);
      setCurrentCourseId(null);
      Alert.alert('Success', 'Course has been updated successfully');
    } else {
      addCourse({ name: courseName, id: Date.now().toString() });
      Alert.alert('Success', 'New course has been added successfully');
    }
    
    setCourseName('');
    setInputError('');
  };

  const handleEdit = (id: string, name: string) => {
    setCourseName(name);
    setCurrentCourseId(id);
    setEditMode(true);
  };

  const handleDelete = (id: string) => {
    deleteCourse(id);
    Alert.alert('Success', 'Course and all associated data have been deleted successfully');
  };

  const cancelEdit = () => {
    setCourseName('');
    setEditMode(false);
    setCurrentCourseId(null);
    setInputError('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Course Name in Codelish</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, inputError ? styles.inputError : null]}
              value={courseName}
              onChangeText={(text) => {
                setCourseName(text);
                if (text.trim()) setInputError('');
              }}
              placeholder="Enter course name"
              placeholderTextColor="#999"
            />
            {editMode && (
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                <X size={20} color="#ff6b6b" />
              </TouchableOpacity>
            )}
          </View>
          {inputError ? <Text style={styles.errorText}>{inputError}</Text> : null}
          
          <CodelishButton 
            title={editMode ? "Update Codelish Course" : "Save to Codelish"} 
            onPress={handleAddCourse}
            icon={<CheckCircle2 size={20} color="#fff" />}
          />
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>All Courses</Text>
          {courses.length === 0 ? (
            <Text style={styles.emptyText}>No courses added yet.</Text>
          ) : (
            courses.map((course) => (
              <CourseItem
                key={course.id}
                course={course}
                onEdit={() => handleEdit(course.id, course.name)}
                onDelete={() => handleDelete(course.id)}
              />
            ))
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
  formLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  cancelButton: {
    marginLeft: 10,
    padding: 10,
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