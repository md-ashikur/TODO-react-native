import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View>
          <Text style={styles.heroTitle}>Explore</Text>
          <Text style={styles.heroSubtitle}>Discover tips and jump into your tasks faster.</Text>
        </View>
        <Image source={require('../../assets/images/partial-react-logo.png')} style={styles.heroImage} contentFit="cover" />
      </View>

      <View style={styles.quickActions}>
        <Pressable style={[styles.qAction, { backgroundColor: '#eef2ff' }]} onPress={() => router.push('/(tabs)/todos')}>
          <Ionicons name="add-circle" size={24} color="#667eea" />
          <Text style={styles.qActionText}>New Task</Text>
        </Pressable>
        <Pressable style={[styles.qAction, { backgroundColor: '#e8fff3' }]} onPress={() => router.push('/(tabs)/todos')}>
          <Ionicons name="list" size={24} color="#34C759" />
          <Text style={styles.qActionText}>My Lists</Text>
        </Pressable>
        <Pressable style={[styles.qAction, { backgroundColor: '#fff7ec' }]} onPress={() => router.push('/(tabs)/todos')}>
          <Ionicons name="alarm" size={24} color="#ff9500" />
          <Text style={styles.qActionText}>Set Reminder</Text>
        </Pressable>
      </View>

      <View style={styles.cards}>
        <View style={styles.card}>
          <View style={[styles.cardIcon, { backgroundColor: '#eef2ff' }]}>
            <Ionicons name="sparkles-outline" size={22} color="#667eea" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Organize with Lists</Text>
            <Text style={styles.cardText}>Group tasks into lists like Work, Personal, or Ideas.</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/todos')} style={styles.cardCta}>
            <Text style={styles.cardCtaText}>Open</Text>
          </Pressable>
        </View>
        <View style={styles.card}>
          <View style={[styles.cardIcon, { backgroundColor: '#fff7ec' }]}>
            <Ionicons name="notifications-outline" size={22} color="#ff9500" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Never miss a deadline</Text>
            <Text style={styles.cardText}>Add reminders with date & time; get notified right on time.</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/todos')} style={styles.cardCta}>
            <Text style={styles.cardCtaText}>Try</Text>
          </Pressable>
        </View>
        <View style={styles.card}>
          <View style={[styles.cardIcon, { backgroundColor: '#e8fff3' }]}>
            <Ionicons name="stats-chart-outline" size={22} color="#34C759" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Track progress</Text>
            <Text style={styles.cardText}>See pending and done counts, search and filter quickly.</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/todos')} style={styles.cardCta}>
            <Text style={styles.cardCtaText}>View</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  hero: { backgroundColor: '#667eea', padding: 20, paddingBottom: 26, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  heroSubtitle: { color: '#e8eaff', marginTop: 6 },
  heroImage: { width: 80, height: 80, borderRadius: 16, opacity: 0.9 },
  quickActions: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: -22 },
  qAction: { flex: 1, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  qActionText: { marginTop: 8, color: '#222', fontWeight: '700' },
  cards: { padding: 20, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  cardIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  cardText: { color: '#666', marginTop: 2 },
  cardCta: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#eef2ff', borderRadius: 10 },
  cardCtaText: { color: '#667eea', fontWeight: '700' },
});
