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
            start_date TEXT NOT NULL
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

export async function createHabit(name: string, startDate: string): Promise<number> {
    const res = await db.runAsync(
        `INSERT INTO habits (name, start_date) VALUES (?, ?)`,
        name,
        startDate,
    );

    return res.lastInsertRowId;
}

export async function getHabits(): Promise<Habit[]> {
    return db.getAllAsync<Habit>(`SELECT * FROM habits ORDER BY id;`);
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
