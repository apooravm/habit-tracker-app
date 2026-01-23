import CreateHabit from "@/components/CreateHabitModal";
import HabitHeatmap from "@/components/HabitHeatmap";
import { useModal } from "@/components/ModalContext";
import { getHabitDates, getHabits } from "@/db/db";
import { HabitState } from "@/types/habits";
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

// love the approach to use the actual list of dates as a
// state instead of the array of objects.
// I wouldve implemented DayCount[][] state.
// every update would mean finding the right date among the weeks and updating it.
// Also would be more complicated to convert back to []string when saving to db
// ALWAYS - render what you store NOT store what you render
export default function Index() {
    const [fetchedDates, setFetchedDates] = useState<Set<string>>(new Set());
    const [habits, setHabits] = useState<HabitState[]>([]);

    const { modalVisible, hideModal } = useModal();

    useEffect(() => {
        // load from db here...
        // setFetchedDates(new Set(fetched_dates_raw));
        // all habits fetch here
        getHabits().then(habits => {
            for (const h of habits) {
                getHabitDates(h.id).then(dates => {
                    const habitState: HabitState = {
                        id: h.id,
                        name: h.name,
                        startDate: h.start_date,
                        completedDates: new Set(dates),
                    };

                    setHabits(prev => [...prev, habitState]);
                });
            }
        });
    }, []);

    useEffect(() => {
        // save to db here...
        // saveCompleteDates([...fetchedDates])
    }, [fetchedDates]);

    // delete date in state if exists, else add
    const toggleDay = (habit_id: number) => {
        setHabits(prev => {
            return prev.map(h => {
                if (h.id !== habit_id) return h;

                const today = new Date().toDateString();
                const newCompletedDates = new Set(h.completedDates);

                if (newCompletedDates.has(today)) {
                    newCompletedDates.delete(today);
                } else {
                    newCompletedDates.add(today);
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
            <CreateHabit isVisible={modalVisible} onClose={hideModal} />
            <ScrollView style={styles.habitContainer}>
                {habits.map(h => (
                    <HabitHeatmap key={h.id} toggleDay={toggleDay} habit={h} />
                ))}
            </ScrollView>
        </View>
    );
}
