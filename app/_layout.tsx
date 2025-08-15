import { initDB } from "@/lib/db";
import { Stack } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [dbReady, setDbReady] = useState<boolean>(false);

  return (
    <SQLite.SQLiteProvider
      databaseName={"NotesApp.db"}
      onInit={async (db) => {
        await initDB(db);
        setDbReady(true);
      }}
    >
      {dbReady ? (
        <Stack>
          <Stack.Screen 
            name="index"
            options={{ title: "Notes" }}
          />
        </Stack>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </SQLite.SQLiteProvider>
  );
}
