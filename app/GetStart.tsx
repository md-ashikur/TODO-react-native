import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GetStart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 24}]}>
        <Ionicons name="checkmark-circle" size={80} color="#fff" />
        <Text style={styles.title}>Welcome to Todo App</Text>
        <Text style={styles.subtitle}>Organize your tasks efficiently</Text>
      </View>
      
  <View style={styles.content}>
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Ionicons name="add-circle-outline" size={24} color="#667eea" />
            <Text style={styles.featureText}>Create and manage tasks</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="checkmark-done-outline" size={24} color="#667eea" />
            <Text style={styles.featureText}>Track your progress</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="cloud-outline" size={24} color="#667eea" />
            <Text style={styles.featureText}>Sync across devices</Text>
          </View>
        </View>
        
  <View style={[styles.buttons, { paddingBottom: insets.bottom + 8 }]}>
          <Pressable 
            onPress={() => router.push('register' as any)} 
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </Pressable>
          
          <Pressable 
            onPress={() => router.push('login' as any)} 
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </Pressable>
        </View>
      </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
  flex: 1,
  backgroundColor: '#eaf5ffff',
  },
  header: {
    backgroundColor: '#667eea',
    paddingBottom: 44,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  marginTop: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#e8eaff',
    textAlign: 'center',
  marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  paddingVertical: 16,
    justifyContent: 'space-between',
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 0,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#313131ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    fontWeight: '500',
  },
  buttons: {
    marginTop: 46,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '500',
  },
});
