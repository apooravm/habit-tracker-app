export enum DayDone {
    Yes,
    No,
    OutOfScope,
}

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
