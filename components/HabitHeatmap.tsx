import { DayCount, DayDone, HabitState, ISODate } from "@/types/habits";
import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import WeekColumn from "./WeekColumn";

const getWeeklyData = (completedDates: Set<string>, habitStartDate: ISODate): DayCount[][] => {
    const TOTAL_WEEKS = 28;
    const today = new Date();
    const h_StartDate = new Date(habitStartDate);

    const dayOfWeek = today.getDay();
    // Sunday - Saturday : 0 - 6

    const currMonday = new Date(today);
    currMonday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const weeks: DayCount[][] = [];
    // create week array, fill with empty
    let currWeek: DayCount[] = Array.from({ length: 7 }, () => ({
        date: "",
        done: DayDone.OutOfScope,
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
                done: DayDone.OutOfScope,
            };
            if (currDate >= h_StartDate && currDate <= today) {
                if (completedDates.has(dayObj.date)) {
                    dayObj.done = DayDone.Yes;
                } else {
                    dayObj.done = DayDone.No;
                }
            }
            currWeek[day] = dayObj;
        }
        weeks.push(currWeek);
        // reset week array for previous week
        currWeek = Array.from({ length: 7 }, () => ({
            date: "",
            done: DayDone.OutOfScope,
        }));
        currMonday.setDate(currMonday.getDate() - 7);
    }

    return weeks;
};

type Props = {
    habit: HabitState;
    toggleDay: (habitId: number) => void;
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        marginHorizontal: 10,
        padding: 6,
        paddingLeft: 7,
        borderWidth: 2,
        borderLeftWidth: 4,
        borderColor: "#fff",
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: "#0b0b0bff",
    },
    habit_title: {
        marginBottom: 8,
        fontWeight: "600",
        color: "#fff",
        paddingVertical: 5,
        fontSize: 20,
    },
});

const HabitHeatmap = ({ habit, toggleDay }: Props) => {
    const weeks = useMemo(() => {
        return getWeeklyData(habit.completedDates, habit.startDate);
    }, [habit.completedDates]);

    const today = new Date();

    return (
        <View
            style={{
                ...styles.container,
                borderLeftColor: habit.completedDates.has(today.toDateString()) ? "green" : "red",
            }}>
            <Pressable onPress={() => toggleDay(habit.id)}>
                <Text style={styles.habit_title}>{habit.name}</Text>

                <FlatList
                    data={weeks}
                    horizontal
                    inverted
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={week => week[0].date}
                    renderItem={({ item }) => <WeekColumn habit_id={habit.id} week={item} />}
                />
            </Pressable>
        </View>
    );
};

export default HabitHeatmap;
