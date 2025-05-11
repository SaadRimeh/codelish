import { View, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { useCodelishContext } from '@/context/CodelishContext';
import { CodelishButton } from '@/components/CodelishButton';
import { Trash2 } from 'lucide-react-native';

export default function ProfileScreen() {
  const { clearAllData } = useCodelishContext();
  
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all Codelish data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All Data', 
          onPress: () => {
            clearAllData();
            Alert.alert('Success', 'All Codelish data has been cleared.');
          },
          style: 'destructive'
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Codelish</Text>
        <Text style={styles.tagline}>Institute Management</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>About Codelish</Text>
        <Text style={styles.description}>
          Codelish Institute is a premier educational institution focused on providing high-quality training 
          in programming, design, and digital skills. Our mission is to empower students with cutting-edge 
          knowledge and practical skills to succeed in the technology industry.
        </Text>
        
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureItem}>
          <View style={styles.featureDot} />
          <Text style={styles.featureText}>Complete course management</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureDot} />
          <Text style={styles.featureText}>Student enrollment and tracking</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureDot} />
          <Text style={styles.featureText}>Attendance marking and reporting</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureDot} />
          <Text style={styles.featureText}>Group management</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureDot} />
          <Text style={styles.featureText}>Performance grading</Text>
        </View>
      </View>
      
      <View style={styles.licenseContainer}>
        <Text style={styles.licenseTitle}>License</Text>
        <Text style={styles.licenseText}>
          Licensed to: CodeLish{'\n'}
          All rights reserved.
        </Text>
      </View>
      
      <View style={styles.appInfo}>
        <Text style={styles.versionText}>Version 1.0.0.6</Text>
        <Text style={styles.copyrightText}>© 2025 Codelish Institute. All rights reserved.</Text>
      </View>
      
      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <CodelishButton 
          title="Clear All Data" 
          onPress={handleClearData}
          style={styles.clearButton}
          textStyle={styles.clearButtonText}
          icon={<Trash2 size={20} color="#fff" />}
        />
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
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logoText: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: '#2e8b57',
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#555555',
    marginTop: 8,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2e8b57',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#444',
    lineHeight: 24,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2e8b57',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#444',
  },
  licenseContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  licenseTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2e8b57',
    marginBottom: 12,
  },
  licenseText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#444',
    lineHeight: 24,
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
  },
  dangerZone: {
    backgroundColor: '#fff3f3',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffe0e0',
    marginBottom: 24,
  },
  dangerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#d32f2f',
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: '#d32f2f',
  },
  clearButtonText: {
    color: '#fff',
  },
});