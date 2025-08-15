import SQLite from "expo-sqlite";

export interface Note {
    id: number;
    title: string;
    body: string;
    createdAt: string;
    updatedAt: string | null;
}

export async function initDB(db: SQLite.SQLiteDatabase) {
    try {
        await db.runAsync(
            `CREATE TABLE IF NOT EXISTS Notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                body TEXT DEFAULT '',
                createdAt TEXT NOT NULL,
                updatedAt TEXT
            );`
        );
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

/**
 * Drop the Notes table entirely (DESTROYS ALL DATA).
 */
export async function dropNotesTable(db: SQLite.SQLiteDatabase) {
    try {
        await db.runAsync("DROP TABLE IF EXISTS Notes;");
        // Remove any autoincrement bookkeeping
        await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'Notes';");
    } catch (e) {
        console.error("Failed to drop Notes table:", e);
        throw e;
    }
}

/**
 * Recreate the Notes table with the desired schema.
 */
export async function createNotesTable(db: SQLite.SQLiteDatabase) {
    try {
        await db.runAsync(
            `CREATE TABLE Notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                body TEXT DEFAULT '',
                createdAt TEXT NOT NULL,
                updatedAt TEXT
            );`
        );
    } catch (e) {
        console.error("Failed to create Notes table:", e);
        throw e;
    }
}

/**
 * Convenience: drop + recreate (reset schema).
 */
export async function resetNotesTable(db: SQLite.SQLiteDatabase) {
    await dropNotesTable(db);
    await createNotesTable(db);
}

/**
 * Legacy: just clears rows (kept if you still want it).
 */
export async function clearAllNotes(db: SQLite.SQLiteDatabase) {
    try {
        await db.runAsync("DELETE FROM Notes;");
        await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'Notes';");
    } catch (e) {
        console.error("Failed to clear notes:", e);
        throw e;
    }
}
