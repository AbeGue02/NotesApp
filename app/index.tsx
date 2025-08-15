import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [notes, setNotes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const db = useSQLiteContext();

  const fetchNotes = useCallback(async () => {
    const result = await db?.getAllAsync("SELECT * FROM Notes ORDER BY updatedAt DESC, createdAt DESC");
    setNotes(result || []);
  }, [db]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  }, [fetchNotes]);

  const onNewNotePress = async () => {
    try {
      const result = await db.runAsync(
        "INSERT INTO Notes (title, body, createdAt) VALUES (?, ?, ?)",
        ["New Note", "", new Date().toISOString()]
      );
      router.push(`/note/${result.lastInsertRowId.toString()}`);
    } catch {
      Alert.alert("Error", "Failed to create a new note.");
    }
  };

  const renderNote = ({ item: note }: { item: any }) => {
    const firstLineRaw = note.body?.split('\n')[0] || '';
    const firstLine = firstLineRaw.length > 50 ? firstLineRaw.slice(0, 50) + '…' : firstLineRaw;
    const createdAt = note.createdAt || note.CreatedAt || note.created_at;
    const dateStr = createdAt ? new Date(createdAt).toLocaleDateString() : '';
    return (
      <TouchableOpacity style={styles.noteRow} onPress={() => router.push(`/note/${note.id}`)}>
        <View style={styles.noteTextContainer}>
          <Text style={styles.noteTitle} numberOfLines={1}>{note.title}</Text>
          <Text style={styles.noteBody} numberOfLines={1}>{firstLine}</Text>
        </View>
        <Text style={styles.noteDate}>{dateStr}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>
        <TouchableOpacity style={styles.addButton} onPress={onNewNotePress}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(n) => n.id.toString()}
        renderItem={renderNote}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={notes.length === 0 && { flex: 1, justifyContent: 'center' }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666' }}>No notes yet. Tap + to add one.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 24, fontWeight: 'bold' },
  addButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: -2 },
  noteRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff',
  },
  noteTextContainer: { flex: 1, marginRight: 12 },
  noteTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 2 },
  noteBody: { fontSize: 14, color: '#666' },
  noteDate: { fontSize: 12, color: '#999', minWidth: 70, textAlign: 'right' },
});
