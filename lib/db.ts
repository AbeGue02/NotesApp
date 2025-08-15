import SQLite from "expo-sqlite";

export async function initDB(db: SQLite.SQLiteDatabase) {
    try {
        await db.runAsync(
            `CREATE TABLE IF NOT EXISTS Notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                body TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT
            );`
        )
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}
