import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../_AuthContext';

type Todo = { id: string; text: string; done?: boolean };

export default function Todos() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [text, setText] = useState('');
  const [items, setItems] = useState<Todo[]>([]);

  const add = () => {
    if (!text.trim()) return;
    setItems((s) => [{ id: String(Date.now()), text: text.trim() }, ...s]);
    setText('');
  };

  const toggle = (id: string) => {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  };

  const remove = (id: string) => setItems((s) => s.filter((it) => it.id !== id));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Your Todos</Text>
            <Text style={styles.subtitle}>
              {user ? `Welcome back, ${user.email.split('@')[0]}!` : 'Not signed in'}
            </Text>
          </View>
          <Pressable onPress={async () => { await logout(); router.replace('/(tabs)'); }} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.inputSection}>
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
        </View>

        <View style={styles.todoSection}>
          <Text style={styles.sectionTitle}>
            Tasks ({items.filter(item => !item.done).length} pending)
          </Text>
          
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={[styles.todoCard, item.done && styles.todoCardDone]}>
                <Pressable onPress={() => toggle(item.id)} style={styles.todoContent}>
                  <View style={styles.todoLeft}>
                    <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
                      {item.done && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                    <Text style={[styles.todoText, item.done && styles.todoTextDone]}>
                      {item.text}
                    </Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => remove(item.id)} style={styles.removeButton}>
                  <Ionicons name="trash-outline" size={18} color="#ff3b30" />
                </Pressable>
              </View>
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
  todoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  todoTextDone: {
    textDecorationLine: 'line-through',
    color: '#999',
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
