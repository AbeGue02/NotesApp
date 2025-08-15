import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, SafeAreaView, Text, TextInput, View } from "react-native";

export default function NoteBody() {

    const [note, setNote] = useState<any>(null);
    const db = useSQLiteContext();
    const { id } = useLocalSearchParams();

    useEffect(() => {
        fetchNote();
    }, []);
    
    const fetchNote = async () => {
        const result = await db?.getFirstAsync("SELECT * FROM Notes WHERE id = ?", [id.toString()]);
        setNote(result);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Button title="< Back" onPress={() => {router.back()}} />
                <Text style={{ fontSize: 24, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Note Editor</Text>
            </View>

            {note ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
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
            )}
        </ SafeAreaView>
    );
}