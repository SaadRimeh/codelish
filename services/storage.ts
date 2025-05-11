import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course, Student, Group, AttendanceRecord } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  COURSES: 'codelish_courses',
  STUDENTS: 'codelish_students',
  GROUPS: 'codelish_groups',
};

// Course operations
export const saveCodelishCourse = async (course: Course): Promise<void> => {
  try {
    const existingData = await getCodelishCourses();
    const updatedData = [...existingData, course];
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
};

export const updateCodelishCourse = async (id: string, data: Partial<Course>): Promise<void> => {
  try {
    const existingData = await getCodelishCourses();
    const updatedData = existingData.map(course => 
      course.id === id ? { ...course, ...data } : course
    );
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCodelishCourse = async (id: string): Promise<void> => {
  try {
    const existingData = await getCodelishCourses();
    const updatedData = existingData.filter(course => course.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

export const getCodelishCourses = async (): Promise<Course[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting courses:', error);
    return [];
  }
};

// Student operations
export const saveCodelishStudent = async (student: Student): Promise<void> => {
  try {
    const existingData = await getCodelishStudents();
    const updatedData = [...existingData, student];
    await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving student:', error);
    throw error;
  }
};

export const updateCodelishStudent = async (id: string, data: Partial<Student>): Promise<void> => {
  try {
    const existingData = await getCodelishStudents();
    const updatedData = existingData.map(student => 
      student.id === id ? { ...student, ...data } : student
    );
    await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteCodelishStudent = async (id: string): Promise<void> => {
  try {
    const existingData = await getCodelishStudents();
    const updatedData = existingData.filter(student => student.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

export const getCodelishStudents = async (): Promise<Student[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting students:', error);
    return [];
  }
};

// Group operations
export const saveCodelishGroup = async (group: Group): Promise<void> => {
  try {
    const existingData = await getCodelishGroups();
    const updatedData = [...existingData, group];
    await AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving group:', error);
    throw error;
  }
};

export const updateCodelishGroup = async (id: string, data: Partial<Group>): Promise<void> => {
  try {
    const existingData = await getCodelishGroups();
    const updatedData = existingData.map(group => 
      group.id === id ? { ...group, ...data } : group
    );
    await AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
};

export const deleteCodelishGroup = async (id: string): Promise<void> => {
  try {
    const existingData = await getCodelishGroups();
    const updatedData = existingData.filter(group => group.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};

export const getCodelishGroups = async (): Promise<Group[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GROUPS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting groups:', error);
    return [];
  }
};

// Attendance operations
export const markCodelishAttendance = async (
  studentId: string, 
  date: string, 
  present: boolean
): Promise<void> => {
  try {
    const students = await getCodelishStudents();
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        const attendance = student.attendance || [];
        const existingIndex = attendance.findIndex(a => a.date === date);
        
        if (existingIndex >= 0) {
          attendance[existingIndex].present = present;
        } else {
          attendance.push({ date, present });
        }
        
        return { ...student, attendance };
      }
      return student;
    });
    
    await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};

// Clear all data
export const clearCodelishData = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.COURSES),
      AsyncStorage.removeItem(STORAGE_KEYS.STUDENTS),
      AsyncStorage.removeItem(STORAGE_KEYS.GROUPS),
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};