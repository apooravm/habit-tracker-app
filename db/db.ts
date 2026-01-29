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

import { Habit } from "@/types/habits";
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("habits.db");

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

export async function createHabit(name: string, startDate: string): Promise<number> {
    const res = await db.runAsync(
        `INSERT INTO habits (name, start_date) VALUES (?, ?)`,
        name,
        startDate,
        false,
    );

    return res.lastInsertRowId;
}

export async function getHabits(): Promise<Habit[]> {
    return db.getAllAsync<Habit>(`SELECT * FROM habits ORDER BY id;`);
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
export async function completeHabit(habitId: number, completedDate: string) {
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
