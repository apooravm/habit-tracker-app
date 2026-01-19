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
    id: string;
    name: string;
    completedDates: Set<ISODate>;
    startDate: ISODate;
};
