import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../_AuthContext';

type Priority = 'low' | 'medium' | 'high';
type Todo = {
  id: string;
  text: string;
  done?: boolean;
  priority: Priority;
  createdAt: number;
  listId: string;
};
type ListType = { id: string; name: string; color: string };

export default function Todos() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [text, setText] = useState('');
  const [items, setItems] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  // Lists
  const [lists, setLists] = useState<ListType[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('inbox');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  // Enable LayoutAnimation on Android
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const storageKey = useMemo(() => (user ? `todos:${user.id}` : null), [user]);
  const listsKey = useMemo(() => (user ? `lists:${user.id}` : null), [user]);

  useEffect(() => {
    if (!storageKey) return;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          const migrated = (Array.isArray(parsed) ? parsed : []).map((t: any) => ({
            id: String(t.id),
            text: String(t.text ?? ''),
            done: !!t.done,
            priority: (t.priority as Priority) ?? 'medium',
            createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now(),
            listId: t.listId ?? 'inbox',
          })) as Todo[];
          setItems(migrated);
        }
      } catch {}
    })();
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    AsyncStorage.setItem(storageKey, JSON.stringify(items)).catch(() => {});
  }, [items, storageKey]);

  // Load/Save lists
  useEffect(() => {
    if (!listsKey) return;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(listsKey);
        if (raw) {
          const parsed: ListType[] = JSON.parse(raw);
          setLists(parsed);
          if (parsed.length > 0 && !parsed.some(l => l.id === selectedListId)) {
            setSelectedListId(parsed[0].id);
          }
        } else {
          const defaultLists: ListType[] = [
            { id: 'inbox', name: 'Inbox', color: '#667eea' },
          ];
          setLists(defaultLists);
          setSelectedListId('inbox');
          await AsyncStorage.setItem(listsKey, JSON.stringify(defaultLists));
        }
      } catch {}
    })();
  }, [listsKey, selectedListId]);

  useEffect(() => {
    if (!listsKey) return;
    AsyncStorage.setItem(listsKey, JSON.stringify(lists)).catch(() => {});
  }, [lists, listsKey]);

  const showPlaceholder = loading || !user;

  const add = () => {
    if (!text.trim()) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItems((s) => [
  { id: String(Date.now()), text: text.trim(), done: false, priority, createdAt: Date.now(), listId: selectedListId },
      ...s,
    ]);
    setText('');
  };

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItems((s) => s.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  };

  const remove = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItems((s) => s.filter((it) => it.id !== id));
  };

  const clearCompleted = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItems((s) => s.filter((it) => !it.done));
  };

  const startEdit = (id: string, current: string) => {
    setEditingId(id);
    setEditingText(current);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const val = editingText.trim();
    if (!val) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItems((s) => s.map((it) => (it.id === editingId ? { ...it, text: val } : it)));
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const filtered = useMemo(() => {
    let data = items.filter(t => t.listId === selectedListId);
    if (filter === 'active') data = data.filter((t) => !t.done);
    if (filter === 'completed') data = data.filter((t) => t.done);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      data = data.filter((t) => t.text.toLowerCase().includes(q));
    }
    // Sort: not done first, then by createdAt desc
    return [...data].sort((a, b) => Number(a.done) - Number(b.done) || b.createdAt - a.createdAt);
  }, [items, filter, query, selectedListId]);

  const pendingCount = items.filter((i) => !i.done).length;
  const completedCount = items.length - pendingCount;

  return (
    <SafeAreaView style={styles.container}>
      {showPlaceholder ? null : (
        <>
          <MotiView 
            from={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 0 }}
            style={styles.header}
          >
            <View style={styles.headerTop}>
              <MotiView
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'spring', damping: 15, delay: 200 }}
              >
                <Text style={styles.title}>Your Todos</Text>
                <Text style={styles.subtitle}>
                  {user?.email ? `Welcome back, ${user.email.split('@')[0]}!` : 'Not signed in'}
                </Text>
              </MotiView>
              <MotiView
                from={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 400 }}
              >
                <Pressable onPress={async () => { await logout(); router.replace('/(tabs)'); }} style={styles.logoutButton}>
                  <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
                </Pressable>
              </MotiView>
            </View>
          </MotiView>

          <View style={styles.content}>
            {/* Lists selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listsRow}>
              {lists.map((l) => (
                <Pressable key={l.id} onPress={() => setSelectedListId(l.id)} style={[styles.listChip, selectedListId === l.id && { backgroundColor: l.color, borderColor: l.color }]}>
                  <View style={[styles.listDot, { backgroundColor: l.color }]} />
                  <Text style={[styles.listChipText, selectedListId === l.id && { color: '#fff' }]}>{l.name}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.summaryRow}>
              <View style={styles.badge}>
                <Ionicons name="time-outline" size={14} color="#fff" />
                <Text style={styles.badgeText}>{pendingCount} pending</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#34C759' }]}>
                <Ionicons name="checkmark-done" size={14} color="#fff" />
                <Text style={styles.badgeText}>{completedCount} done</Text>
              </View>
              {completedCount > 0 && (
                <Pressable style={styles.clearButton} onPress={clearCompleted}>
                  <Ionicons name="trash-outline" size={16} color="#ff3b30" />
                  <Text style={styles.clearText}>Clear done</Text>
                </Pressable>
              )}
            </View>

            <MotiView 
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 600 }}
              style={styles.searchRow}
            >
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color="#999" />
                <TextInput
                  placeholder="Search"
                  value={query}
                  onChangeText={setQuery}
                  style={styles.searchInput}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.filters}>
                {(['all', 'active', 'completed'] as const).map((f, index) => (
                  <MotiView
                    key={f}
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: 800 + index * 100 }}
                  >
                    <Pressable onPress={() => setFilter(f)} style={[styles.chip, filter === f && styles.chipActive]}>
                      <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </Text>
                    </Pressable>
                  </MotiView>
                ))}
              </View>
            </MotiView>
            <MotiView 
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 1100 }}
              style={styles.inputSection}
            >
              <View style={styles.inputContainer}>
                <Ionicons name="add-circle-outline" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  placeholder="What needs doing?"
                  value={text}
                  onChangeText={setText}
                  style={styles.input}
                  placeholderTextColor="#999"
                />
              </View>
              <Pressable onPress={add} style={styles.addButton}>
                <Ionicons name="add" size={20} color="#fff" />
              </Pressable>
            </MotiView>
            <MotiView 
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 1300 }}
              style={styles.priorityRow}
            >
              {(['low', 'medium', 'high'] as const).map((p, index) => (
                <MotiView
                  key={p}
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 15, delay: 1500 + index * 100 }}
                >
                  <Pressable onPress={() => setPriority(p)} style={[styles.priorityChip, priority === p && styles.priorityChipActive(p)]}>
                    <View style={[styles.priorityDot, p === 'low' ? { backgroundColor: '#34C759' } : p === 'medium' ? { backgroundColor: '#FFCC00' } : { backgroundColor: '#ff3b30' }]} />
                    <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </Pressable>
                </MotiView>
              ))}
            </MotiView>

            <View style={styles.todoSection}>
              <Text style={styles.sectionTitle}>
                Tasks ({items.filter(item => !item.done).length} pending)
              </Text>
              
              <FlatList
                data={filtered}
                keyExtractor={(i) => i.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item, index }) => (
                  <MotiView
                    from={{ opacity: 0, translateY: 50, scale: 0.9 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    exit={{ opacity: 0, translateY: -50, scale: 0.9 }}
                    transition={{ 
                      type: 'spring', 
                      damping: 15, 
                      delay: index * 100 
                    }}
                  >
                    <View style={[styles.todoCard, item.done && styles.todoCardDone]}>
                      <Pressable onPress={() => toggle(item.id)} style={styles.todoContent}>
                        <View style={styles.todoLeft}>
                          <MotiView
                            animate={{ scale: item.done ? 1.1 : 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                          >
                            <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
                              {item.done && <Ionicons name="checkmark" size={16} color="#fff" />}
                            </View>
                          </MotiView>
                          <View style={[styles.priorityPill, item.priority === 'low' ? styles.pillLow : item.priority === 'medium' ? styles.pillMed : styles.pillHigh]} />
                          {editingId === item.id ? (
                            <TextInput
                              value={editingText}
                              onChangeText={setEditingText}
                              onSubmitEditing={saveEdit}
                              onBlur={cancelEdit}
                              autoFocus
                              style={[styles.todoText, styles.editInput]}
                              placeholder="Edit task"
                              placeholderTextColor="#aaa"
                            />
                          ) : (
                            <Text style={[styles.todoText, item.done && styles.todoTextDone]}>
                              {item.text}
                            </Text>
                          )}
                        </View>
                      </Pressable>
                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                        {editingId === item.id ? (
                          <MotiView
                            from={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                          >
                            <Pressable onPress={saveEdit} style={styles.iconButton}>
                              <Ionicons name="save-outline" size={18} color="#667eea" />
                            </Pressable>
                          </MotiView>
                        ) : (
                          <MotiView
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                          >
                            <Pressable onPress={() => startEdit(item.id, item.text)} style={styles.iconButton}>
                              <Ionicons name="pencil-outline" size={18} color="#667eea" />
                            </Pressable>
                          </MotiView>
                        )}
                        <MotiView
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 15 }}
                        >
                          <Pressable onPress={() => remove(item.id)} style={styles.removeButton}>
                            <Ionicons name="trash-outline" size={18} color="#ff3b30" />
                          </Pressable>
                        </MotiView>
                      </View>
                    </View>
                  </MotiView>
                )}
                ListEmptyComponent={() => (
                  <View style={styles.emptyState}>
                    <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No tasks yet!</Text>
                    <Text style={styles.emptySubtext}>Add your first task above</Text>
                  </View>
                )}
              />
            </View>
          </View>
          
         
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#e8eaff',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  listsRow: { flexDirection: 'row', gap: 10, paddingBottom: 8, marginBottom: 8 },
  listChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  listDot: { width: 8, height: 8, borderRadius: 4 },
  listChipText: { color: '#333', fontWeight: '700', fontSize: 12 },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#667eea',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  clearButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ffe0e0',
  },
  clearText: { color: '#ff3b30', fontWeight: '700', fontSize: 12 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  filters: { flexDirection: 'row', gap: 8 },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#eee',
  },
  chipActive: { backgroundColor: '#667eea', borderColor: '#667eea' },
  chipText: { color: '#333', fontWeight: '700', fontSize: 12 },
  chipTextActive: { color: '#fff' },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  priorityRow: { flexDirection: 'row', gap: 8, marginTop: -18, marginBottom: 18 },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  priorityChipActive: ((): any => (p: Priority) => ({ backgroundColor: p === 'low' ? '#EAF8EE' : p === 'medium' ? '#FFF7E0' : '#FFE9E7', borderColor: 'transparent' }))(),
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityText: { color: '#444', fontWeight: '700', fontSize: 12 },
  priorityTextActive: { color: '#222' },
  addButton: {
    backgroundColor: '#667eea',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  todoSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  todoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  todoCardDone: {
    backgroundColor: '#f8f9fa',
    opacity: 0.7,
  },
  todoContent: {
    flex: 1,
  },
  todoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  priorityPill: {
    width: 6,
    height: 24,
    borderRadius: 4,
    marginRight: 10,
  },
  pillLow: { backgroundColor: '#34C759' },
  pillMed: { backgroundColor: '#FFCC00' },
  pillHigh: { backgroundColor: '#ff3b30' },
  todoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  todoTextDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  editInput: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#fff0f0',
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 8,
  },
});
