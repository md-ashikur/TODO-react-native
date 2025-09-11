import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../_AuthContext';


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}> 
        <View>
          <Text style={styles.greeting}>Welcome</Text>
          <Text style={styles.username}>{user?.name || user?.email?.split('@')[0] || 'there'}</Text>
        </View>
        <Ionicons name="sparkles-outline" size={28} color="#fff" />
      </View>

      <View style={styles.content}>
        <View style={styles.cardRow}>
          <Pressable style={[styles.card, styles.accent1]} onPress={() => router.push('/(tabs)/todos')}>
            <Ionicons name="checkmark-done-circle" size={28} color="#fff" />
            <Text style={styles.cardTitle}>Your Tasks</Text>
            <Text style={styles.cardSubtitle}>Jump back into your todos</Text>
          </Pressable>
          <Pressable style={[styles.card, styles.accent2]} onPress={() => router.push('/(tabs)/todos')}>
            <Ionicons name="add-circle" size={28} color="#fff" />
            <Text style={styles.cardTitle}>Add Task</Text>
            <Text style={styles.cardSubtitle}>Quickly add a new one</Text>
          </Pressable>
        </View>

        <View style={styles.tipBox}>
          <Ionicons name="bulb-outline" size={22} color="#764ba2" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.tipTitle}>Tip</Text>
            <Text style={styles.tipText}>Swipe tasks to delete and tap to toggle done.</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: { color: '#e8eaff', fontSize: 16 },
  username: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 4 },
  content: { flex: 1, padding: 20 },
  cardRow: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    backgroundColor: '#764ba2',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 5,
  },
  accent1: { backgroundColor: '#667eea' },
  accent2: { backgroundColor: '#764ba2' },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 10 },
  cardSubtitle: { color: '#e8eaff', fontSize: 14, marginTop: 4 },
  tipBox: {
    marginTop: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  tipTitle: { color: '#764ba2', fontWeight: '700', fontSize: 14 },
  tipText: { color: '#555', marginTop: 2 },
});
