import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Platform 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCodelishContext } from '@/context/CodelishContext';
import { CodelishButton } from '@/components/CodelishButton';
import { CircleCheck as CheckCircle2, X, CreditCard as Edit2, Trash2, Clock } from 'lucide-react-native';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday', 'Sunday'
];

interface DayTime {
  day: string;
  time: string;
}

export default function GroupsScreen() {
  const { courses, groups, addGroup, updateGroup, deleteGroup } = useCodelishContext();
  const [groupName, setGroupName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayTime[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!groupName.trim()) newErrors.name = 'Group name is required';
    if (!selectedCourse) newErrors.course = 'Please select a course';
    if (selectedDays.length === 0) newErrors.days = 'Please select at least one day';
    if (selectedDays.some(day => !day.time)) newErrors.time = 'Please set time for all selected days';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdateGroup = () => {
    if (validateForm()) {
      const formattedSchedule = selectedDays
        .map(dt => `${dt.day} at ${dt.time}`)
        .join(', ');

      const groupData = {
        name: groupName,
        courseId: selectedCourse,
        appointmentDay: selectedDays.map(dt => dt.day).join(', '),
        appointmentTime: selectedDays.map(dt => dt.time).join(', ')
      };

      if (editingGroupId) {
        updateGroup(editingGroupId, groupData);
        Alert.alert('Success', 'Group has been updated successfully');
      } else {
        addGroup({
          id: Date.now().toString(),
          ...groupData
        });
        Alert.alert('Success', 'Group has been added successfully');
      }
      
      resetForm();
      animateForm();
    }
  };

  const handleEdit = (group: any) => {
    animateForm();
    setEditingGroupId(group.id);
    setGroupName(group.name);
    setSelectedCourse(group.courseId);
    
    const days = group.appointmentDay.split(', ');
    const times = group.appointmentTime.split(', ');
    const dayTimes: DayTime[] = days.map((day: string, index: number) => ({
      day,
      time: times[index] || ''
    }));
    setSelectedDays(dayTimes);
  };

  const handleDelete = (groupId: string) => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            deleteGroup(groupId);
            Alert.alert('Success', 'Group has been deleted successfully');
          },
          style: 'destructive'
        },
      ]
    );
  };

  const resetForm = () => {
    animateForm();
    setGroupName('');
    setSelectedCourse('');
    setSelectedDays([]);
    setEditingGroupId(null);
    setErrors({});
  };

  const animateForm = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleDay = (day: string) => {
    setSelectedDays(current => {
      const exists = current.find(d => d.day === day);
      if (exists) {
        return current.filter(d => d.day !== day);
      } else {
        return [...current, { day, time: '' }];
      }
    });
    
    if (errors.days) {
      const { days, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };

  const updateDayTime = (day: string, time: string) => {
    setSelectedDays(current =>
      current.map(d => d.day === day ? { ...d, time } : d)
    );
    
    if (errors.time) {
      const { time, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };

  const isDaySelected = (day: string) => selectedDays.some(d => d.day === day);
  const getDayTime = (day: string) => selectedDays.find(d => d.day === day)?.time || '';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
        <Text style={styles.formTitle}>
          {editingGroupId ? 'Edit Group' : 'Add New Group'}
        </Text>
        
        <Text style={styles.formLabel}>Group Name</Text>
        <TextInput
          style={[
            styles.input,
            errors.name ? styles.inputError : null,
            Platform.select({
              web: styles.inputWeb,
              default: {}
            })
          ]}
          value={groupName}
          onChangeText={(text) => {
            setGroupName(text);
            if (errors.name && text.trim()) {
              const { name, ...restErrors } = errors;
              setErrors(restErrors);
            }
          }}
          placeholder="Enter group name"
          placeholderTextColor="#999"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        
        <Text style={styles.formLabel}>Course</Text>
        <View style={[styles.pickerContainer, errors.course ? styles.pickerError : null]}>
          <Picker
            selectedValue={selectedCourse}
            onValueChange={(itemValue) => {
              setSelectedCourse(itemValue);
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
        
        <Text style={styles.formLabel}>Schedule</Text>
        <View style={styles.scheduleContainer}>
          {DAYS_OF_WEEK.map(day => (
            <View key={day} style={styles.dayScheduleRow}>
              <TouchableOpacity
                style={[
                  styles.dayButton,
                  isDaySelected(day) && styles.dayButtonSelected,
                  Platform.select({
                    web: styles.dayButtonWeb,
                    default: {}
                  })
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[
                  styles.dayButtonText,
                  isDaySelected(day) && styles.dayButtonTextSelected
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
              
              {isDaySelected(day) && (
                <View style={styles.timeInputContainer}>
                  <Clock size={20} color="#666" style={styles.timeIcon} />
                  <TextInput
                    style={[
                      styles.timeInput,
                      Platform.select({
                        web: styles.inputWeb,
                        default: {}
                      })
                    ]}
                    value={getDayTime(day)}
                    onChangeText={(time) => updateDayTime(day, time)}
                    placeholder="Enter time (e.g., 14:00)"
                    placeholderTextColor="#999"
                  />
                </View>
              )}
            </View>
          ))}
        </View>
        {errors.days && <Text style={styles.errorText}>{errors.days}</Text>}
        {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
        
        <View style={styles.buttonContainer}>
          <CodelishButton 
            title={editingGroupId ? "Update Group" : "Add Group"} 
            onPress={handleAddOrUpdateGroup}
            icon={<CheckCircle2 size={20} color="#fff" />}
          />
          {editingGroupId && (
            <CodelishButton 
              title="Cancel" 
              onPress={resetForm}
              style={styles.cancelButton}
              icon={<X size={20} color="#fff" />}
            />
          )}
        </View>
      </Animated.View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>All Groups</Text>
        {groups.length === 0 ? (
          <Text style={styles.emptyText}>No groups added yet.</Text>
        ) : (
          groups.map((group) => {
            const course = courses.find(c => c.id === group.courseId);
            const days = group.appointmentDay.split(', ');
            const times = group.appointmentTime.split(', ');
            const schedule = days.map((day, i) => `${day} at ${times[i]}`).join('\n');
            
            return (
              <Animated.View 
                key={group.id} 
                style={[styles.groupItem, { opacity: fadeAnim }]}
              >
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.courseText}>
                    Course: {course?.name || 'Unknown Course'}
                  </Text>
                  <Text style={styles.scheduleText}>Schedule:</Text>
                  <Text style={styles.scheduleDetails}>{schedule}</Text>
                </View>
                <View style={styles.groupActions}>
                  <TouchableOpacity 
                    style={[
                      styles.editButton,
                      Platform.select({
                        web: styles.actionButtonWeb,
                        default: {}
                      })
                    ]}
                    onPress={() => handleEdit(group)}
                  >
                    <Edit2 size={18} color="#2e8b57" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.deleteButton,
                      Platform.select({
                        web: styles.actionButtonWeb,
                        default: {}
                      })
                    ]}
                    onPress={() => handleDelete(group.id)}
                  >
                    <Trash2 size={18} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            );
          })
        )}
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
  formTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
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
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  inputWeb: {
    outlineStyle: 'none',
    transition: 'all 0.2s ease-in-out',
    ':focus': {
      borderColor: '#2e8b57',
      backgroundColor: '#fff',
    },
  },
  inputError: {
    borderColor: '#ff6b6b',
    backgroundColor: '#fff3f3',
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
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  pickerError: {
    borderColor: '#ff6b6b',
    backgroundColor: '#fff3f3',
  },
  picker: {
    height: 50,
  },
  scheduleContainer: {
    gap: 12,
    marginBottom: 16,
  },
  dayScheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2e8b57',
    backgroundColor: '#fff',
    minWidth: 100,
  },
  dayButtonWeb: {
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    ':hover': {
      backgroundColor: '#f0f7f0',
    },
  },
  dayButtonSelected: {
    backgroundColor: '#2e8b57',
    transform: [{ scale: 1.05 }],
  },
  dayButtonText: {
    color: '#2e8b57',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  timeInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  timeIcon: {
    marginRight: 8,
  },
  timeInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
  },
  listContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  listTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
    color: '#2e8b57',
  },
  groupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2e8b57',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  courseText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 4,
  },
  scheduleDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
  },
  groupActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 12,
    backgroundColor: '#e6f7ee',
    borderRadius: 12,
  },
  deleteButton: {
    padding: 12,
    backgroundColor: '#ffe6e6',
    borderRadius: 12,
  },
  actionButtonWeb: {
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    ':hover': {
      transform: [{ scale: 1.1 }],
    },
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    padding: 20,
  },
});