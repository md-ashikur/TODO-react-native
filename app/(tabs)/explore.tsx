import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (isFocused) setCycle(c => (c + 1) % 1000);
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <AnimatePresence>
        <MotiView
          key={`hero-${cycle}`}
         from={{ opacity: 0, translateY: -100 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15, delay: 100 }}
          style={styles.hero}
        >
          <MotiView
            key={`htext-${cycle}`}
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'spring', damping: 16, delay: 140 }}
          >
            <Text style={styles.heroTitle}>Explore</Text>
            <Text style={styles.heroSubtitle}>Discover tips and jump into your tasks faster.</Text>
          </MotiView>
          <MotiView
            key={`himg-${cycle}`}
            from={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 16, delay: 240 }}
          >
            <Image source={require('../../assets/images/partial-react-logo.png')} style={styles.heroImage} contentFit="cover" />
          </MotiView>
        </MotiView>
      </AnimatePresence>

  <View style={styles.quickActions}>
        {[
          { bg: '#eef2ff', icon: 'add-circle', color: '#667eea', label: 'New Task' },
          { bg: '#e8fff3', icon: 'list', color: '#34C759', label: 'My Lists' },
          { bg: '#fff7ec', icon: 'alarm', color: '#ff9500', label: 'Set Reminder' },
        ].map((a, idx) => (
          <MotiView
            key={`${a.label}-${cycle}`}
            from={{ opacity: 0, translateY: 30, scale: 0.9 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            exit={{ opacity: 0, translateY: 10 }}
            transition={{ type: 'spring', damping: 18, delay: 240 + idx * 90 }}
      style={{ flex: 1 }}
          >
    <Pressable style={[styles.qAction, { backgroundColor: a.bg }, idx < 2 ? { marginRight: 14 } : undefined, { flex: 1 }]} onPress={() => router.push('/(tabs)/todos')}>
              <Ionicons name={a.icon as any} size={24} color={a.color} />
              <Text style={styles.qActionText}>{a.label}</Text>
            </Pressable>
          </MotiView>
        ))}
      </View>

      <View style={styles.cards}>
        {[
          { id: 'lists', icon: 'sparkles-outline', bg: '#eef2ff', tint: '#667eea', title: 'Organize with Lists', text: 'Group tasks into lists like Work, Personal, or Ideas.', cta: 'Open' },
          { id: 'rem', icon: 'notifications-outline', bg: '#fff7ec', tint: '#ff9500', title: 'Stay on track', text: 'Use priorities & filters to focus on what matters.', cta: 'Use' },
          { id: 'stats', icon: 'stats-chart-outline', bg: '#e8fff3', tint: '#34C759', title: 'Track progress', text: 'See pending vs done counts instantly.', cta: 'View' },
        ].map((c, idx) => (
          <MotiView
            key={`${c.id}-${cycle}`}
            from={{ opacity: 0, translateY: 40, scale: 0.94 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 20, delay: 420 + idx * 120 }}
            style={[styles.card, { flex: 1, marginBottom: 12 }]}
          >
              <View style={[styles.cardLeft, { backgroundColor: c.bg }]}> 
                <Ionicons name={c.icon as any} size={22} color={c.tint} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardText}>{c.text}</Text>
              </View>
            <Pressable onPress={() => router.push('/(tabs)/todos')} style={styles.cardCta}>
              <Text style={styles.cardCtaText}>{c.cta}</Text>
            </Pressable>
          </MotiView>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  hero: { backgroundColor: '#667eea', padding: 22, paddingBottom: 30, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#12064a', shadowOpacity: 0.2, shadowRadius: 14, elevation: 6 },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  heroSubtitle: { color: '#e8eaff', marginTop: 6 },
  heroImage: { width: 80, height: 80, borderRadius: 16, opacity: 0.9 },
  quickActions: { flexDirection: 'row', paddingHorizontal: 20, marginTop: -18 },
  qAction: { flex: 1, borderRadius: 18, paddingVertical: 16, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#12064a', shadowOpacity: 0.16, shadowRadius: 10, elevation: 5, marginRight: 14 },
  qActionText: { marginTop: 8, color: '#222', fontWeight: '700' },
  cards: { padding: 20, gap: 14 },
  card: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 18, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#12064a', shadowOpacity: 0.12, shadowRadius: 14, elevation: 6 },
  cardIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardLeft: { width: 44, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderRadius: 12 },
  cardBody: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  cardText: { color: '#666', marginTop: 2 },
  cardCta: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#eef2ff', borderRadius: 10 },
  cardCtaText: { color: '#667eea', fontWeight: '700' },
});
