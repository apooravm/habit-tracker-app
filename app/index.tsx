import CreateHabit from "@/components/CreateHabitModal";
import HabitHeatmap from "@/components/HabitHeatmap";
import { useModal } from "@/components/ModalContext";
import {
    ArchiveHabit,
    getHabitDates,
    getHabits,
    renameHabit,
    trackHabitDate
} from "@/db/db";
import { HabitAction, HabitState } from "@/types/habits";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#202020ff",
        justifyContent: "center",
        alignItems: "center",
    },
    habitContainer: {},
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
    "Sun Dec 28 2025",
    "Mon Dec 29 2025",
    "Tue Dec 30 2025",
    "Wed Dec 31 2025",

    // Jan 2026
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
    "Wed Jan 28 2026",
];

// love the approach to use the actual list of dates as a
// state instead of the array of objects.
// I wouldve implemented DayCount[][] state.
// every update would mean finding the right date among the weeks and updating it.
// Also would be more complicated to convert back to []string when saving to db
// ALWAYS - render what you store NOT store what you render
export default function Index() {
    const [fetchedDates, setFetchedDates] = useState<Set<string>>(new Set());
    const [habits, setHabits] = useState<HabitState[]>([]);
    const [refetchHabitData, setRefetchHabitData] = useState(false);

    const { modalVisible, hideModal } = useModal();

    /*
    Updating with new data (name, completed date, etc.)

Instead of passing just id, pass what changed.

const updateHabit = (id: number, changes: Partial<HabitState>) => {
  setHabits(prev =>
    prev.map(h =>
      h.id === id ? { ...h, ...changes } : h
    )
  );
};


Usage:

updateHabit(habit.id, { name: "Drink Water" });


For Set:

updateHabit(habit.id, {
  completedDates: new Set([...habit.completedDates, today]),
});

// 1. optimistic UI
setHabits(prev => updateLocally(prev, id));

// 2. save to DB
await updateHabitInDb(id);

// 3. optional: revalidate
const freshHabit = await fetchHabit(id);
setHabits(prev => merge(prev, freshHabit));

    // setHabits(prev =>
    //     prev.map(habit =>
    //         habit.id === updatedHabit.id
    //         ? { ...habit, name: "New name" }
    //         : habit
    //     )
    // );
*/
    useEffect(() => {
        // load from db here...
        // setFetchedDates(new Set(fetched_dates_raw));
        // all habits fetch here
        const habit_ids = habits.map(h => h.id);
        getHabits().then(habits => {
            for (const h of habits) {
                // skip habit with h.id already exists in state
                if (!habit_ids.includes(h.id)) {
                    getHabitDates(h.id).then(dates => {
                        const habitState: HabitState = {
                            id: h.id,
                            name: h.name,
                            startDate: h.start_date,
                            completedDates: new Set(dates),
                            archived: h.archived,
                        };

                        setHabits(prev => [...prev, habitState]);
                    });
                }
            }
        });
    }, [refetchHabitData]);

    const applyHabitAction = (action: HabitAction) => {
        setHabits(prevHabits => reduceHabits(prevHabits, action));

        // save changes to db
        syncHabitWithDb(action).then(() => {
            // alert("DB UPDATED!!!!");
        });
    };

    const reduceHabits = (habits: HabitState[], action: HabitAction): HabitState[] => {
        switch (action.type) {
            case "habit/dateAdded":
                return habits.map(habit =>
                    habit.id === action.habitId
                        ? {
                              ...habit,
                              completedDates: new Set([...habit.completedDates, action.date]),
                          }
                        : habit,
                );

            case "habit/dateRemoved":
                const newDates = habits.find(h => h.id === action.habitId)!.completedDates;
                newDates.delete(action.date);
                return habits.map(habit =>
                    habit.id === action.habitId
                        ? { ...habit, completedDates: new Set(newDates) }
                        : habit,
                );

            case "habit/renamed":
                return habits.map(habit =>
                    habit.id === action.habitId ? { ...habit, name: action.name } : habit,
                );

            case "habit/deleted":
                return habits.filter(habit => habit.id !== action.habitId);
        }
    };

    const syncHabitWithDb = async (action: HabitAction) => {
        switch (action.type) {
            case "habit/dateAdded":
                await trackHabitDate(action.habitId, action.date);
                break;

            case "habit/dateRemoved":
                await ArchiveHabit(action.habitId);
                break;

            case "habit/renamed":
                await renameHabit(action.habitId, action.name);
                break;

            case "habit/deleted":
                await ArchiveHabit(action.habitId);
                break;

            default:
                break;
        }

        // optional: revalidate
        // const freshHabit = await fetchHabit(habit.id);
        // setHabits(prev => merge(prev, freshHabit));
    };

    // DEPRECATED
    const updateHabit = (id: number, changes: Partial<HabitState>) => {
        setHabits(prev => prev.map(h => (h.id === id ? { ...h, ...changes } : h)));
    };

    useEffect(() => {
        // save to db here...
        // saveCompleteDates([...fetchedDates])
    }, [fetchedDates]);

    return (
        <View style={styles.container}>
            <CreateHabit
                isVisible={modalVisible}
                onClose={hideModal}
                refetchHabitData={() => setRefetchHabitData(prev => !prev)}
            />
            <ScrollView style={styles.habitContainer}>
                {habits.map(h => (
                    <HabitHeatmap key={h.id} habit={h} applyHabitAction={applyHabitAction} />
                ))}
            </ScrollView>
        </View>
    );
}
