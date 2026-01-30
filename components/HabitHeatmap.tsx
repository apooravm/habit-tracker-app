import { DayCount, DayDone, Habit, HabitAction, HabitState, ISODate } from "@/types/habits";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HabitConfigModal from "./HabitConfigModal";
import WeekColumn from "./WeekColumn";

type Month = {
    month: string;
    weeks: DayCount[][];
};

const getMonthlyData = (completedDates: Set<string>, habitStartDate: ISODate): Month[] => {
    const TOTAL_WEEKS = 40;
    const today = new Date();
    const h_StartDate = new Date(habitStartDate);

    const dayOfWeek = today.getDay();
    // Sunday - Saturday : 0 - 6

    const currMonday = new Date(today);
    currMonday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const months: Month[] = [];
    let weeks: DayCount[][] = [];
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
            // offset day from monday
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
        const prevMonday = new Date(currMonday);
        currMonday.setDate(currMonday.getDate() - 7);
        if (currMonday.getMonth() !== prevMonday.getMonth()) {
            months.push({
                month: prevMonday.toLocaleString("default", { month: "long" }),
                weeks: weeks.toReversed(),
            });
            weeks = [];
        }
        // reset week array for previous week
        currWeek = Array.from({ length: 7 }, () => ({
            date: "",
            done: DayDone.OutOfScope,
        }));
    }

    return months;
};

const monthMap: Record<string, string> = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "Jun",
    July: "Jul",
    August: "Aug",
    September: "Sept",
    October: "Oct",
    November: "Nov",
    December: "Dec",
};

const shortenMonth = (month: string): string => monthMap[month] ?? month;

type Props = {
    habit: HabitState;
    applyHabitAction: (action: HabitAction) => void;
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        marginHorizontal: 4,
        paddingVertical: 8,
        paddingLeft: 5,
        paddingRight: 5,
        borderWidth: 1,
        borderColor: "#303030ff",
        borderRadius: 5,
        backgroundColor: "#0b0b0bff",
    },
    habit_title: {
        marginBottom: 8,
        fontWeight: "600",
        color: "#fff",
        paddingVertical: 5,
        fontSize: 20,
        paddingLeft: 5,
    },
    habit_footer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footer_button: {
        borderWidth: 1,
        borderColor: "#303030ff",
        borderRadius: 5,
        padding: 8,
    },
});

const HabitHeatmap = ({ habit, applyHabitAction }: Props) => {
    const months = useMemo(() => {
        return getMonthlyData(habit.completedDates, habit.startDate);
    }, [habit.completedDates]);

    const habitOnly: Habit = {
        id: habit.id,
        name: habit.name,
        start_date: habit.startDate,
        archived: false,
    };
    const today = new Date();

    const [modalVisible, setModalVisible] = useState(false);

    const trackToday = () => {
        applyHabitAction({
            type: "habit/dateAdded",
            habitId: habit.id,
            date: new Date().toDateString(),
        });
    };

    return (
        <View
            style={{
                ...styles.container,
            }}>
            <HabitConfigModal
                habit={habitOnly}
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                applyHabitAction={applyHabitAction}
            />
            <View>
                <FlatList
                    data={months}
                    horizontal
                    inverted
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={month => month.month}
                    renderItem={({ item }) => (
                        <View>
                            <Text
                                style={{
                                    color: "#fff",
                                    marginBottom: 3,
                                    fontSize: 10,
                                    opacity: 0.5,
                                    fontWeight: "600",
                                }}>
                                {shortenMonth(item.month)}
                            </Text>
                            <View style={{ flexDirection: "row" }}>
                                {item.weeks.map((week, index) => (
                                    <WeekColumn key={index} habit_id={habit.id} week={week} />
                                ))}
                            </View>
                        </View>
                    )}
                />
            </View>
            <View style={styles.habit_footer}>
                <Text style={styles.habit_title}>{habit.name}</Text>
                <View style={{ flexDirection: "row", gap: 10, marginRight: 5 }}>
                    <TouchableOpacity
                        onPress={() => {
                            setModalVisible(prev => !prev);
                        }}
                        style={styles.footer_button}>
                        <Ionicons name="settings-outline" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (habit.completedDates.has(today.toDateString())) {
                                applyHabitAction({
                                    type: "habit/dateRemoved",
                                    habitId: habit.id,
                                    date: new Date().toDateString(),
                                });
                            } else {
                                trackToday();
                            }
                        }}
                        style={{
                            ...styles.footer_button,
                            backgroundColor: habit.completedDates.has(today.toDateString())
                                ? "#6fc302ff"
                                : styles.container.backgroundColor,
                        }}>
                        <Ionicons name="checkmark-outline" size={28} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default HabitHeatmap;
