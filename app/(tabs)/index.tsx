import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../_AuthContext';


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const [cycle, setCycle] = useState(0);

  // Increment cycle whenever the tab/screen gains focus so animations replay
  useEffect(() => {
    if (isFocused) setCycle(c => (c + 1) % 1000);
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
  <AnimatePresence>
        <MotiView
          key={`hdr-${cycle}`}
          from={{ opacity: 0, translateY: -100 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15, delay: 100 }}
          style={[styles.header, { paddingTop: insets.top + 56 }]}
        >
          <MotiView key={`ttl-${cycle}`}
            from={{ opacity: 0, translateX: -25 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'spring', damping: 14, delay: 140 }}
          >
            <Text style={styles.greeting}>Welcome</Text>
            <Text style={styles.username}>{user?.name || user?.email?.split('@')[0] || 'there'}</Text>
          </MotiView>
          <MotiView key={`ico-${cycle}`}
            from={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 14, delay: 240 }}
          >
            <Ionicons name="sparkles-outline" size={30} color="#fff" />
          </MotiView>
        </MotiView>
      </AnimatePresence>

      <View style={styles.content}>
        <View style={styles.cardRow}>
            <MotiView key={`c1-${cycle}`} from={{ opacity: 0, translateY: 24, scale: 0.96 }} animate={{ opacity: 1, translateY: 0, scale: 1 }} transition={{ type: 'spring', damping: 18, delay: 220 }} style={{ flex: 1, marginRight: 12 }}>
            <Pressable style={[styles.card, styles.accent1, { flex: 1 }]} onPress={() => router.push('/(tabs)/todos')}>
              <View style={styles.cardLeft}>
                <Ionicons name="checkmark-done-circle" size={28} color="#fff" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Your Tasks</Text>
                <Text style={styles.cardSubtitle}>Jump back into your todos</Text>
              </View>
            </Pressable>
          </MotiView>
          <MotiView key={`c2-${cycle}`} from={{ opacity: 0, translateY: 24, scale: 0.96 }} animate={{ opacity: 1, translateY: 0, scale: 1 }} transition={{ type: 'spring', damping: 18, delay: 300 }} style={{ flex: 1 }}>
            <Pressable style={[styles.card, styles.accent2, { flex: 1 }]} onPress={() => router.push('/(tabs)/todos')}>
              <View style={styles.cardLeft}>
                <Ionicons name="add-circle" size={28} color="#fff" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Add Task</Text>
                <Text style={styles.cardSubtitle}>Quickly add a new one</Text>
              </View>
            </Pressable>
          </MotiView>
        </View>
        <MotiView key={`tip-${cycle}`} from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} exit={{ opacity: 0, translateY: 10 }} transition={{ type: 'spring', damping: 18, delay: 380 }} style={styles.tipBox}>
          <Ionicons name="bulb-outline" size={22} color="#764ba2" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.tipTitle}>Tip</Text>
            <Text style={styles.tipText}>Swipe tasks to delete and tap to toggle done.</Text>
          </View>
        </MotiView>
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
  cardRow: { flexDirection: 'row' },
  card: {
    backgroundColor: '#764ba2',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#12064a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 14, elevation: 6,
  },
  cardLeft: { width: 44, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardBody: { flex: 1, justifyContent: 'center' },
  accent1: { backgroundColor: '#667eea' },
  accent2: { backgroundColor: '#764ba2' },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 0 },
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
