import { initDB } from "@/lib/db";
import { Stack } from "expo-router";
import * as SQLite from "expo-sqlite";
import { Suspense, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";

function Fallback() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function RootLayout() {
  const [dbReady, setDbReady] = useState<boolean>(false);

  return (
    <View style={{ flex: 1 }}>
      <Suspense fallback={<Fallback />}>
        <SQLite.SQLiteProvider
          databaseName={"NotesApp.db"}
          onInit={async (db) => {
            await initDB(db);
            setDbReady(true);
          }}
          useSuspense
        >
          <StatusBar />
          {dbReady ? (
            <Stack>
              <Stack.Screen
                name="index"
                options={{ title: "Notes", headerShown: false }}
              />
              <Stack.Screen
                name="note/[id]"
                options={{ title: "Note", headerShown: false }}
              />
            </Stack>
          ) : null}
        </SQLite.SQLiteProvider>
      </Suspense>
    </View>
  );
}
