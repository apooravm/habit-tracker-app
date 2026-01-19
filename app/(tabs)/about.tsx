import WeekColumn from "@/components/WeekColumn";
import { HabitState, ISODate } from "@/types/habits";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "#fff",
    },
});

const fetched_dates_raw = [
    // Nov 2025
    "Sat Nov 01 2025",
    "Mon Nov 03 2025",
    "Wed Nov 05 2025",
    "Thu Nov 06 2025",
    "Sun Nov 09 2025",
    "Tue Nov 11 2025",
    "Fri Nov 14 2025",
    "Sun Nov 16 2025",
    "Tue Nov 18 2025",
    "Thu Nov 20 2025",
    "Sun Nov 23 2025",
    "Tue Nov 25 2025",
    "Thu Nov 27 2025",
    "Sun Nov 30 2025",

    // Dec 2025
    "Tue Dec 02 2025",
    "Wed Dec 03 2025",
    "Fri Dec 05 2025",
    "Sun Dec 07 2025",
    "Tue Dec 09 2025",
    "Wed Dec 10 2025",
    "Sat Dec 13 2025",
    "Mon Dec 15 2025",
    "Tue Dec 16 2025",
    "Thu Dec 18 2025",
    "Sat Dec 20 2025",
    "Mon Dec 22 2025",
    "Wed Dec 24 2025",
    "Sat Dec 27 2025",
    "Mon Dec 29 2025",

    // Jan 2026
    "Thu Jan 01 2026",
    "Fri Jan 02 2026",
    "Sat Jan 03 2026",
    "Sun Jan 04 2026",
    "Tue Jan 06 2026",
    "Wed Jan 07 2026",
    "Thu Jan 08 2026",
    "Fri Jan 09 2026",
    "Sun Jan 11 2026",
    "Mon Jan 12 2026",
    "Tue Jan 13 2026",
    "Wed Jan 14 2026",
];

type DayCount = {
    date: string;
    done: boolean; // habit boolean
};

const getWeeklyData = (habitData: HabitState): DayCount[][] => {
    const TOTAL_WEEKS = 28;
    const today = new Date();

    const dayOfWeek = today.getDay();
    // Sunday - Saturday : 0 - 6

    const currMonday = new Date(today);
    currMonday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const weeks: DayCount[][] = [];
    // create week array, fill with empty
    let currWeek: DayCount[] = Array.from({ length: 7 }, () => ({
        date: "",
        done: false,
    }));
    for (let weekCount = 0; weekCount < TOTAL_WEEKS; weekCount++) {
        // create and update new week array, true if date exists in set
        // feel this is easier than to go over the fetched dates
        // allows me to keep the count of dates
        for (let day = 0; day < 7; day++) {
            const currDate = new Date(currMonday);
            currDate.setDate(currMonday.getDate() + day);
            const dayObj: DayCount = {
                date: currDate.toDateString(),
                done: false,
            };
            if (habitData.completedDates.has(dayObj.date)) {
                dayObj.done = true;
            }
            currWeek[day] = dayObj;
        }
        weeks.push(currWeek);
        // reset week array for previous week
        currWeek = Array.from({ length: 7 }, () => ({
            date: "",
            done: false,
        }));
        currMonday.setDate(currMonday.getDate() - 7);
    }

    return weeks;
};

const getHabitWeeklyData = (habitsData: HabitState[]): DayCount[][][] => {
    const res: DayCount[][][] = [];
    for (const h of habitsData) {
        res.push(getWeeklyData(h));
    }

    return res;
};

// love the approach to use the actual list of dates as a
// state instead of the array of objects.
// I wouldve implemented DayCount[][] state.
// every update would mean finding the right date among the weeks and updating it.
// Also would be more complicated to convert back to []string when saving to db
// ALWAYS - render what you store NOT store what you render
export default function AboutScreen() {
    const [fetchedDates, setFetchedDates] = useState<Set<string>>(new Set());
    const [habits, setHabits] = useState<HabitState[]>([]);

    // const weeksData = useMemo(() => getWeeklyData(habits), [habits]);
    const weeklyHabits = useMemo(() => getHabitWeeklyData(habits), [habits]);

    useEffect(() => {
        // load from db here...
        setFetchedDates(new Set(fetched_dates_raw));
        // all habits fetch here
        const fetched_habits_raw = [
            {
                id: "1",
                name: "habit_a",
                completed_dates: fetched_dates_raw,
                start_date: "Sat Aug 29 2025",
            },
            {
                id: "2",
                name: "habit_b",
                completed_dates: fetched_dates_raw,
                start_date: "Sat Sep 18 2025",
            },
        ];
        const fetched_habits: HabitState[] = [];
        for (const h of fetched_habits_raw) {
            const habit: HabitState = {
                completedDates: new Set(h.completed_dates),
                id: h.id,
                name: h.name,
                startDate: h.start_date,
            };
            fetched_habits.push(habit);
        }
        setHabits(fetched_habits);
    }, []);

    useEffect(() => {
        // save to db here...
        // saveCompleteDates([...fetchedDates])
    }, [fetchedDates]);

    // delete date in state if exists, else add
    const toggleDay = (habit_id: string, date: ISODate) => {
        setHabits(prev => {
            return prev.map(h => {
                if (h.id !== habit_id) return h;

                const newCompletedDates = new Set(h.completedDates);

                if (newCompletedDates.has(date)) {
                    newCompletedDates.delete(date);
                } else {
                    newCompletedDates.add(date);
                }

                return {
                    ...h,
                    completedDates: newCompletedDates,
                };
            });
        });
    };

    return (
        <View style={styles.container}>
            {weeklyHabits.map((h, idx) => (
                <View style={styles.container} key={idx}>
                    <FlatList
                        key={habits[idx].id}
                        data={h}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <WeekColumn
                                habit_id={habits[idx].id}
                                week={item}
                                toggleDay={toggleDay}
                            />
                        )}
                    />
                </View>
            ))}
            <Text style={styles.text}>About Screen</Text>
        </View>
    );
}
