/**
habits
id          INTEGER  PRIMARY KEY
name        TEXT
start_date  TEXT   (ISO: YYYY-MM-DD)

habit_dates
id              INTEGER PRIMARY KEY
habit_id        INTEGER  → habits.id
completed_date  TEXT     (YYYY-MM-DD)

 */

import { Habit, HabitImage, HabitNote } from "@/types/habits";
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("habits.db");

// (async () => {
//     try {
//         const rows = await db.getAllAsync<any>("SELECT * FROM habits;");
//         console.log(rows);
//         db.runAsync("UPDATE habits SET archived = 0 WHERE id = 4;");
//         db.runAsync("UPDATE habits SET archived = 0 WHERE id = 5;");
//     } catch (e) {
//         console.warn("Query failed", e);
//     }
// })();

// Sqlite does not enable foreign keys by default
// ON DELETE CASCADE -> delete habit -> auto delete its dates
// (habit_id, completed_date) unique -> no double completions same day
export async function initDB() {
    await db.execAsync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            start_date TEXT NOT NULL,
            archived BOOLEAN NOT NULL DEFAULT FALSE
        );

        CREATE TABLE IF NOT EXISTS habit_dates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER NOT NULL,
            completed_date TEXT NOT NULL,
            FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS habit_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER NOT NULL,
            completion_date TEXT NOT NULL,
            note TEXT NOT NULL,
            FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
            UNIQUE (habit_id, completion_date)
        );

        CREATE TABLE IF NOT EXISTS habit_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER NOT NULL,
            completion_date TEXT NOT NULL,
            image_uri TEXT NOT NULL,
            FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_habit_dates_habit_id
            ON habit_dates(habit_id);

        CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_completion
            ON habit_dates(habit_id, completed_date);
        `);
}

export async function nukeDB(): Promise<void> {
    // Drop the tables if they exist
    await db.execAsync(`
        DROP TABLE IF EXISTS habit_dates;
        DROP TABLE IF EXISTS habits;
    `);

    await initDB();
}

export async function CreateHabit(name: string, startDate: string): Promise<number> {
    const res = await db.runAsync(
        `INSERT INTO habits (name, start_date, archived) VALUES (?, ?, ?)`,
        name,
        startDate,
        false,
    );

    return res.lastInsertRowId;
}

export async function getHabits(): Promise<Habit[]> {
    return db.getAllAsync<Habit>(`SELECT * FROM habits WHERE archived = 0 ORDER BY id;`);
}

export async function UpdateHabit(
    id: number,
    name: string,
    startDate: string,
    archived: boolean,
): Promise<void> {
    await db.runAsync(
        `
        UPDATE habits
        SET name = ?, start_date = ?
        WHERE id = ?
        `,
        name,
        startDate,
        id,
    );
}

// just so i dont have to pass everything everytime
export async function renameHabit(id: number, name: string): Promise<void> {
    await db.runAsync(
        `
        UPDATE habits
        SET name = ?
        WHERE id = ?
        `,
        name,
        id,
    );
}

export async function ArchiveHabit(id: number): Promise<void> {
    await db.runAsync(
        `UPDATE habits
        SET archived = 1
        WHERE id = ?
        `,
        id,
    );
}

export async function DeleteHabit(id: number): Promise<void> {
    await db.runAsync(`DELETE FROM habits WHERE id = ?`, id);
}

// ignore if unique combo (habit_id, completed_date) already exists
export async function trackHabitDate(habitId: number, completedDate: string) {
    await db.runAsync(
        `
        INSERT OR IGNORE INTO habit_dates
        (habit_id, completed_date)
        VALUES (?, ?)
        `,
        habitId,
        completedDate,
    );
}

export async function untrackHabitDate(habitId: number, completedDate: string) {
    await db.runAsync(
        `
        DELETE FROM habit_dates
        WHERE habit_id = ? AND completed_date = ?
        `,
        habitId,
        completedDate,
    );
}

export async function getHabitDates(habitId: number): Promise<string[]> {
    const rows = db.getAllAsync<{ completed_date: string }>(
        `
        SELECT completed_date
        FROM habit_dates
        WHERE habit_id = ?
        `,
        habitId,
    );

    return (await rows).map(r => r.completed_date);
}

export async function addHabitNote(
    habitId: number,
    note: string,
    completionDate: string,
): Promise<void> {
    await db.runAsync(
        `
        INSERT INTO habit_notes (habit_id, note, completion_date)
        VALUES (?, ?, ?)
        `,
        habitId,
        note,
        completionDate,
    );
}

// since every completion date can have only 1 note...
export async function getHabitNote(
    habitId: number,
    completionDate: string,
): Promise<{ note: HabitNote; images: HabitImage[] }> {
    const habitNotes = await db.getAllAsync<{ id: number; note: string }>(
        `
        SELECT id, note FROM habit_notes
        WHERE habit_id = ? AND completion_date = ?
        `,
        habitId,
        completionDate,
    );

    const raw_images = await db.getAllAsync<{ id: number; image_uri: string }>(
        `
            SELECT id, image_uri
            FROM habit_images
            WHERE habit_id = ? AND completion_date = ?
            `,
        habitId,
        completionDate,
    );

    const habit_note: HabitNote = {
        id: 0,
        note: "",
        completion_date: completionDate,
        habit_id: habitId,
    };

    if (habitNotes.length > 0) {
        habit_note.id = habitNotes[0].id;
        habit_note.note = habitNotes[0].note;
    }

    const habit_images: HabitImage[] = raw_images.map(img => {
        return {
            id: img.id,
            image_uri: img.image_uri,
            completion_date: completionDate,
            habit_id: habitId,
        };
    });

    return {
        note: habit_note,
        images: habit_images,
    };
}

export async function addHabitNoteImage(
    habitId: number,
    imageUri: string,
    completionDate: string,
): Promise<void> {
    await db.runAsync(
        `
        INSERT INTO habit_images (habit_id, image_uri, completion_date)
        VALUES (?, ?, ?)
        `,
        habitId,
        imageUri,
        completionDate,
    );
}

export async function removeHabitNoteImage(habitId: number, imageUri: string): Promise<void> {
    await db.runAsync(
        `
        DELETE FROM habit_images
        WHERE habit_id = ? AND image_uri = ?
        `,
        habitId,
        imageUri,
    );
}

export async function updateHabitNote(
    id: number,
    habitId: number,
    note: string,
    completionDate: string,
): Promise<void> {
    await db.runAsync(
        `
        UPDATE habit_notes
        SET habit_id = ?, note = ?, completion_date = ?
        WHERE id = ?
        `,
        habitId,
        note,
        completionDate,
        id,
    );
}
export async function deleteHabitNote(id: number): Promise<void> {
    await db.runAsync(
        `
        DELETE FROM habit_notes
        WHERE id = ?
        `,
        id,
    );
}
