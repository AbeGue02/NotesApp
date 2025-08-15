import { Note } from "@/lib/db";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, SafeAreaView, Text, TextInput, View } from "react-native";

export default function NoteBody() {
    const [note, setNote] = useState<Note | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const db = useSQLiteContext();
    const { id } = useLocalSearchParams();

    useEffect(() => {
        fetchNote();
    }, [id]);

    const handleGoBack = async () => {
        try {
            if (note) {
                await db.runAsync(
                    "UPDATE Notes SET title = ?, body = ?, updatedAt = ? WHERE id = ?",
                    [note.title ?? "", note.body ?? "", new Date().toISOString(), id.toString()]
                );
            }
        } catch (error) {
            console.error("Failed to update note:", error);
        } finally {
            router.back();
        }
    };
    
    const fetchNote = async () => {
        const result = await db?.getFirstAsync("SELECT * FROM Notes WHERE id = ?", [id?.toString()]);
        // getFirstAsync returns unknown, so cast to the expected Note | null type
        setNote(result as Note | null);
        setIsLoading(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Button title="< Back" onPress={handleGoBack} />
                <Text style={{ fontSize: 24, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Note Editor</Text>
            </View>

            {!isLoading ? (
                <View style={{ padding: 20 }}>
                    <TextInput
                        value={note?.title}
                        onChangeText={title => setNote((prev: any) => ({ ...prev, title }))}
                        placeholder="Title"
                        placeholderTextColor="#aaa"
                        style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 6 }}
                    />
                    <TextInput
                        value={note?.body}
                        onChangeText={body => setNote((prev: any) => ({ ...prev, body }))}
                        placeholder="Note body"
                        placeholderTextColor="#aaa"
                        multiline
                        style={{ fontSize: 16, minHeight: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 6 }}
                    />
                </View>
            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
        </ SafeAreaView>
    );
}