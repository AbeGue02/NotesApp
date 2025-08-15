import SQLite from "expo-sqlite";

export async function initDB(db: SQLite.SQLiteDatabase) {
    try {
        await db.runAsync(
            `CREATE TABLE IF NOT EXISTS Notes (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Title TEXT NOT NULL,
                Body TEXT,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT
            );`
        )
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}
