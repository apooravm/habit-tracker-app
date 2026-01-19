export type ISODate = string;

export type DayCount = {
    date: ISODate;
    done: boolean;
};

export type HabitState = {
    id: string;
    name: string;
    completedDates: Set<ISODate>;
    startDate: ISODate;
};
