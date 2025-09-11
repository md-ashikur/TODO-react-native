import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from './_AuthContext';

export default function GetStart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/todos');
    }
  }, [loading, user, router]);

  if (loading || user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <MotiView 
        from={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800 }}
        style={[styles.header, { paddingTop: insets.top + 24}]}
      >
        <MotiView
          from={{ scale: 0, rotate: '180deg' }}
          animate={{ scale: 1, rotate: '0deg' }}
          transition={{ type: 'spring', delay: 300, damping: 12 }}
        >
          <Ionicons name="checkmark-circle" size={80} color="#fff" />
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 500 }}
        >
          <Text style={styles.title}>Welcome to Todo App</Text>
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 700 }}
        >
          <Text style={styles.subtitle}>Organize your tasks efficiently</Text>
        </MotiView>
      </MotiView>
      
  <View style={styles.content}>
        <View style={styles.featuresContainer}>
          {[
            { icon: "add-circle-outline", text: "Create and manage tasks", delay: 900 },
            { icon: "checkmark-done-outline", text: "Track your progress", delay: 1100 },
            { icon: "cloud-outline", text: "Sync across devices", delay: 1300 }
          ].map((feature, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'spring', delay: feature.delay, damping: 15 }}
              style={styles.feature}
            >
              <Ionicons name={feature.icon as any} size={24} color="#667eea" />
              <Text style={styles.featureText}>{feature.text}</Text>
            </MotiView>
          ))}
        </View>
        
  <MotiView 
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 1500, damping: 12 }}
          style={[styles.buttons, { paddingBottom: insets.bottom + 8 }]}
        >
          <MotiView
            from={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 1600 }}
          >
            <Pressable 
              onPress={() => router.push('register' as any)} 
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </Pressable>
          </MotiView>
          
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 1800 }}
          >
            <Pressable 
              onPress={() => router.push('login' as any)} 
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>I already have an account</Text>
            </Pressable>
          </MotiView>
        </MotiView>
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
