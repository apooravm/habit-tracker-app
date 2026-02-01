export enum DayDone {
    Yes,
    No,
    OutOfScope,
}

export type HabitAction =
    | { type: "habit/dateAdded"; habitId: number; date: string }
    | { type: "habit/dateRemoved"; habitId: number; date: string }
    | { type: "habit/renamed"; habitId: number; name: string }
    | { type: "habit/archived"; habitId: number }
    | { type: "habit/created"; name: string; date: string };

export type ISODate = string;

export type DayCount = {
    date: ISODate;
    done: DayDone;
};

export type HabitState = {
    id: number;
    name: string;
    completedDates: Set<ISODate>;
    startDate: ISODate;
    archived: boolean;
};

export type Habit = {
    id: number;
    name: string;
    start_date: string;
    archived: boolean;
};

export type HabitDate = {
    id: number;
    habit_id: number;
    complete_date: string;
};

export type HabitNote = {
    id: number;
    habit_id: number;
    completion_date: string;
    note: string;
};
