import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CodelishButtonProps {
  title: string;
  onPress: () => void;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function CodelishButton({ 
  title, 
  onPress, 
  icon, 
  style, 
  textStyle,
  disabled = false 
}: CodelishButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.buttonContainer, disabled && styles.buttonDisabled, style]}
    >
      <LinearGradient
        colors={disabled ? ['#a0a0a0', '#808080'] : ['#2e8b57', '#ff8c00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {icon && <>{icon}</>}
        <Text style={[
          styles.buttonText,
          icon && styles.buttonTextWithIcon,
          textStyle
        ]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  buttonTextWithIcon: {
    marginLeft: 8,
  },
});