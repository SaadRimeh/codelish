import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Student } from '@/types';
import { CircleCheck as CheckCircle, Circle as XCircle, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { useCodelishContext } from '@/context/CodelishContext';

interface StudentItemProps {
  student: Student;
  courseName: string;
  groupName: string;
}

export function StudentItem({ student, courseName, groupName }: StudentItemProps) {
  const { updateStudent, deleteStudent } = useCodelishContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(student.name);
  const [editedPhone, setEditedPhone] = useState(student.phone);
  const [editedGrade, setEditedGrade] = useState(student.grade || '');

  const latestAttendance = student.attendance
    ? student.attendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  const handleSave = () => {
    updateStudent(student.id, {
      name: editedName,
      phone: editedPhone,
      grade: editedGrade,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteStudent(student.id);
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={editedName}
          onChangeText={setEditedName}
          placeholder="Student name"
        />
        <TextInput
          style={styles.input}
          value={editedPhone}
          onChangeText={setEditedPhone}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          value={editedGrade}
          onChangeText={setEditedGrade}
          placeholder="Grade (optional)"
        />
        <View style={styles.editActions}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <CheckCircle size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
            <XCircle size={20} color="#fff" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{student.name}</Text>
        {latestAttendance && (
          <View style={styles.attendanceIndicator}>
            {latestAttendance.present ? (
              <CheckCircle size={18} color="#4caf50" />
            ) : (
              <XCircle size={18} color="#f44336" />
            )}
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.phone}>Phone: {student.phone}</Text>
        <Text style={styles.grade}>
          Grade: {student.grade || 'Not assigned'}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Codelish • {courseName} • {groupName}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Edit2 size={18} color="#2e8b57" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={18} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2e8b57',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  attendanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    marginBottom: 8,
  },
  phone: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  grade: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  footer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#e6f7ee',
    borderRadius: 4,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#ffe6e6',
    borderRadius: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e8b57',
    padding: 8,
    borderRadius: 4,
    gap: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b6b',
    padding: 8,
    borderRadius: 4,
    gap: 4,
  },
  cancelButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});