import WeekColumn from "@/components/WeekColumn";
import { ISODate } from "@/types/habits";
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

const getWeeklyData = (fetchedDates: Set<string>): DayCount[][] => {
    const today = new Date();

    const dayOfWeek = today.getDay();
    const weeks: DayCount[][] = [];
    // Sunday - Saturday : 0 - 6

    const currMonday = new Date(today);
    currMonday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const currSunday = new Date(today);
    currSunday.setDate(currMonday.getDate() + 6);

    // create week array, fill with empty
    let currWeek: DayCount[] = Array.from({ length: 7 }, () => ({
        date: "",
        done: false,
    }));
    const totalWeeks = 10;
    for (let weekCount = 0; weekCount < totalWeeks; weekCount++) {
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
            if (fetchedDates.has(dayObj.date)) {
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

export default function AboutScreen() {
    const [mondayStr, setMondayStr] = useState("");
    const [fetchedDates, setFetchedDates] = useState<Set<string>>(new Set());

    const weeksData = useMemo(() => getWeeklyData(fetchedDates), [fetchedDates]);

    useEffect(() => {
        // load from db here...
        setFetchedDates(new Set(fetched_dates_raw));
    }, []);

    useEffect(() => {
        // save to db here...
        // saveCompleteDates([...fetchedDates])
    }, [fetchedDates]);

    // delete date in state if exists, else add
    const toggleDay = (date: ISODate) => {
        setFetchedDates(prev => {
            const temp = new Set(prev);
            temp.has(date) ? temp.delete(date) : temp.add(date);
            return temp;
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={weeksData}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <WeekColumn week={item} toggleDay={toggleDay} />}
            />
            <Text style={styles.text}>{mondayStr}</Text>
            <Text style={styles.text}>About Screen</Text>
        </View>
    );
}
