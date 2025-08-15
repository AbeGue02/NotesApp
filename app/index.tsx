import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {

  const [notes, setNotes] = useState<any[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    const fetchNotes = async () => {
      const result = await db?.getAllAsync("SELECT * FROM Notes");

      console.log("Fetched notes:", result);

      setNotes(result);
    };

    fetchNotes();
  }, []);

  const onNewNotePress = async () => {
    try {
      const result = await db.runAsync("INSERT INTO Notes (title, body, createdAt) VALUES (?, ?, ?)", ["New Note", "", new Date().toISOString()])
      router.push(`/note/${result.lastInsertRowId.toString()}`);
    } catch (error) {
      Alert.alert("Error", "Failed to create a new note.");
      console.error("Error inserting note:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={onNewNotePress}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {notes.map((note) => {
        const firstLine = note.body?.split('\n')[0].substring(0, 50) + '...' || '';
        const createdAt = note.createdAt || note.CreatedAt || note.created_at;
        const dateStr = createdAt ? new Date(createdAt).toLocaleDateString() : '';
        return (
          <TouchableOpacity key={note.id} style={styles.noteRow} onPress={() => router.push(`/note/${note.id}`)}>
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteTitle} numberOfLines={1}>{note.title}</Text>
              <Text style={styles.noteBody} numberOfLines={1}>{firstLine}</Text>
            </View>
            <Text style={styles.noteDate}>{dateStr}</Text>
          </TouchableOpacity>
        );
      })}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -2,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  noteTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  noteBody: {
    fontSize: 14,
    color: '#666',
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
    minWidth: 70,
    textAlign: 'right',
  },
});
