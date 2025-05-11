import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course, Student, Group, AttendanceRecord } from '@/types';

interface CodelishContextType {
  courses: Course[];
  students: Student[];
  groups: Group[];
  isDataLoaded: boolean;
  
  addCourse: (course: Course) => void;
  updateCourse: (id: string, data: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  addStudent: (student: Student) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  addGroup: (group: Group) => void;
  updateGroup: (id: string, data: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  
  markAttendance: (records: { studentId: string, date: string, present: boolean }[]) => void;
  
  clearAllData: () => void;
}

const CodelishContext = createContext<CodelishContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COURSES: 'codelish_courses',
  STUDENTS: 'codelish_students',
  GROUPS: 'codelish_groups',
};

interface CodelishContextProviderProps {
  children: ReactNode;
}

export const CodelishContextProvider = ({ children }: CodelishContextProviderProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Load all data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, studentsData, groupsData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.COURSES),
          AsyncStorage.getItem(STORAGE_KEYS.STUDENTS),
          AsyncStorage.getItem(STORAGE_KEYS.GROUPS),
        ]);
        
        if (coursesData) setCourses(JSON.parse(coursesData));
        if (studentsData) setStudents(JSON.parse(studentsData));
        if (groupsData) setGroups(JSON.parse(groupsData));
        
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
        setIsDataLoaded(true); // Set to true even on error to continue app flow
      }
    };
    
    loadData();
  }, []);
  
  // Courses CRUD operations
  const addCourse = async (course: Course) => {
    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses));
    } catch (error) {
      console.error('Error saving course to AsyncStorage:', error);
    }
  };
  
  const updateCourse = async (id: string, data: Partial<Course>) => {
    const updatedCourses = courses.map(course => 
      course.id === id ? { ...course, ...data } : course
    );
    setCourses(updatedCourses);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses));
    } catch (error) {
      console.error('Error updating course in AsyncStorage:', error);
    }
  };
  
  const deleteCourse = async (id: string) => {
    // Delete the course
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    
    // Delete associated groups
    const updatedGroups = groups.filter(group => group.courseId !== id);
    setGroups(updatedGroups);
    
    // Filter out students in deleted groups
    const deletedGroupIds = groups
      .filter(group => group.courseId === id)
      .map(group => group.id);
    
    const updatedStudents = students.filter(
      student => !deletedGroupIds.includes(student.groupId)
    );
    setStudents(updatedStudents);
    
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses)),
        AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(updatedGroups)),
        AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents)),
      ]);
    } catch (error) {
      console.error('Error deleting course from AsyncStorage:', error);
    }
  };
  
  // Students CRUD operations
  const addStudent = async (student: Student) => {
    const updatedStudents = [...students, student];
    setStudents(updatedStudents);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
    } catch (error) {
      console.error('Error saving student to AsyncStorage:', error);
    }
  };
  
  const updateStudent = async (id: string, data: Partial<Student>) => {
    const updatedStudents = students.map(student => 
      student.id === id ? { ...student, ...data } : student
    );
    setStudents(updatedStudents);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
    } catch (error) {
      console.error('Error updating student in AsyncStorage:', error);
    }
  };
  
  const deleteStudent = async (id: string) => {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
    } catch (error) {
      console.error('Error deleting student from AsyncStorage:', error);
    }
  };
  
  // Groups CRUD operations
  const addGroup = async (group: Group) => {
    const updatedGroups = [...groups, group];
    setGroups(updatedGroups);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(updatedGroups));
    } catch (error) {
      console.error('Error saving group to AsyncStorage:', error);
    }
  };
  
  const updateGroup = async (id: string, data: Partial<Group>) => {
    const updatedGroups = groups.map(group => 
      group.id === id ? { ...group, ...data } : group
    );
    setGroups(updatedGroups);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(updatedGroups));
    } catch (error) {
      console.error('Error updating group in AsyncStorage:', error);
    }
  };
  
  const deleteGroup = async (id: string) => {
    // Delete the group
    const updatedGroups = groups.filter(group => group.id !== id);
    setGroups(updatedGroups);
    
    // Update any students in this group
    const updatedStudents = students.map(student => 
      student.groupId === id ? { ...student, groupId: '' } : student
    );
    setStudents(updatedStudents);
    
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(updatedGroups)),
        AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents)),
      ]);
    } catch (error) {
      console.error('Error deleting group from AsyncStorage:', error);
    }
  };
  
  // Attendance operations
  const markAttendance = async (records: { studentId: string, date: string, present: boolean }[]) => {
    const updatedStudents = students.map(student => {
      const record = records.find(r => r.studentId === student.id);
      if (!record) return student;
      
      const newAttendance = student.attendance || [];
      const existingRecordIndex = newAttendance.findIndex(
        a => a.date === record.date
      );
      
      if (existingRecordIndex >= 0) {
        // Update existing record
        newAttendance[existingRecordIndex].present = record.present;
      } else {
        // Add new record
        newAttendance.push({
          date: record.date,
          present: record.present
        });
      }
      
      return {
        ...student,
        attendance: newAttendance
      };
    });
    
    setStudents(updatedStudents);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
    } catch (error) {
      console.error('Error updating attendance in AsyncStorage:', error);
    }
  };
  
  // Clear all data
  const clearAllData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.COURSES),
        AsyncStorage.removeItem(STORAGE_KEYS.STUDENTS),
        AsyncStorage.removeItem(STORAGE_KEYS.GROUPS),
      ]);
      setCourses([]);
      setStudents([]);
      setGroups([]);
    } catch (error) {
      console.error('Error clearing all data from AsyncStorage:', error);
    }
  };
  
  const contextValue: CodelishContextType = {
    courses,
    students,
    groups,
    isDataLoaded,
    addCourse,
    updateCourse,
    deleteCourse,
    addStudent,
    updateStudent,
    deleteStudent,
    addGroup,
    updateGroup,
    deleteGroup,
    markAttendance,
    clearAllData,
  };
  
  return (
    <CodelishContext.Provider value={contextValue}>
      {children}
    </CodelishContext.Provider>
  );
};

export const useCodelishContext = () => {
  const context = useContext(CodelishContext);
  if (context === undefined) {
    throw new Error('useCodelishContext must be used within a CodelishContextProvider');
  }
  return context;
};