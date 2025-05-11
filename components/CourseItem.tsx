import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { Course } from '@/types';

interface CourseItemProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}

export function CourseItem({ course, onEdit, onDelete }: CourseItemProps) {
  const handleDelete = () => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course? This action cannot be undone and will remove all associated groups and students.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: onDelete,
          style: 'destructive'
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.courseName}>{course.name}</Text>
        <Text style={styles.instituteLabel}>Codelish – {course.name}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Edit2 size={18} color="#2e8b57" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Trash2 size={18} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contentContainer: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginBottom: 4,
  },
  instituteLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
});