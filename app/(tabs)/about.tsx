import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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

const fetched_dates = [
    // Nov 2025
    "2025-11-01",
    "2025-11-03",
    "2025-11-05",
    "2025-11-06",
    "2025-11-09",
    "2025-11-11",
    "2025-11-14",
    "2025-11-16",
    "2025-11-18",
    "2025-11-20",
    "2025-11-23",
    "2025-11-25",
    "2025-11-27",
    "2025-11-30",

    // Dec 2025
    "2025-12-02",
    "2025-12-03",
    "2025-12-05",
    "2025-12-07",
    "2025-12-09",
    "2025-12-10",
    "2025-12-13",
    "2025-12-15",
    "2025-12-16",
    "2025-12-18",
    "2025-12-20",
    "2025-12-22",
    "2025-12-24",
    "2025-12-27",
    "2025-12-29",

    // Jan 2026
    "2026-01-01",
    "2026-01-02",
    "2026-01-03",
    "2026-01-04",
    "2026-01-06",
    "2026-01-07",
    "2026-01-08",
    "2026-01-09",
    "2026-01-11",
    "2026-01-12",
    "2026-01-13",
    "2026-01-14",
];

fetched_dates.reverse();

type WeeklyData = {
    weekId: string;
};

export default function AboutScreen() {
    const [mondayStr, setMondayStr] = useState("");
    const [sundayStr, setSundayStr] = useState("");

    useEffect(() => {
        getWeeklyData();
    });

    function getWeeklyData() {
        const today = new Date();

        const dayOfWeek = today.getDay();
        const weeks = [];
        // Sunday - Saturday : 0 - 6

        const currMonday = new Date(today);
        currMonday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

        const currSunday = new Date(today);
        currSunday.setDate(currMonday.getDate() + 6);

        setMondayStr(currMonday.toDateString());
        setSundayStr(currSunday.toDateString());

        let currWeek = Array(7).fill("NIL");
        for (let i = 0; i < fetched_dates.length; i++) {
            const date = new Date(fetched_dates[i]);
            if (date >= currMonday && date <= currSunday) {
                let day = date.getDay();
                if (day === 0) {
                    currWeek[6] = date.toDateString();
                } else {
                    currWeek[day - 1] = date.toDateString();
                }
            } else {
                weeks.push(currWeek);
                currWeek = Array(7).fill("NIL");
                currMonday.setDate(currMonday.getDate() - 7);
                currSunday.setDate(currSunday.getDate() - 7);
            }
        }

        console.log(weeks);
    }

    return (
        <View style={styles.container}>
            {/* <FlatList data={dates} horizontal showsHorizontalScrollIndicator={false}  /> */}
            <Text style={styles.text}>{sundayStr}</Text>
            <Text style={styles.text}>{mondayStr}</Text>
            <Text style={styles.text}>About Screen</Text>
        </View>
    );
}
