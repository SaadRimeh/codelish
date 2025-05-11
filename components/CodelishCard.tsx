import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CodelishCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  description?: string;
  color?: string;
}

export function CodelishCard({ 
  title, 
  value, 
  icon, 
  description
}: CodelishCardProps) {
  return (
    <LinearGradient
      colors={['#2e8b57', '#ff8c00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 12,
    padding: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    borderRadius: 11,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2e8b57',
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ff8c00',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
});