import { DayCount, ISODate } from "@/types/habits";
import { Pressable, View } from "react-native";
import { DayCell } from "./DayCell";

type Props = {
    habit_id: string;
    week: DayCount[];
    toggleDay: (habit_id: string, date: ISODate) => void;
};

const WeekColumn = ({ week, toggleDay, habit_id }: Props) => {
    return (
        <View style={{ marginRight: 4 }}>
            {week.map(day => (
                <Pressable key={day.date} onPress={() => toggleDay(habit_id, day.date)}>
                    <DayCell day={day} />
                </Pressable>
            ))}
        </View>
    );
};

export default WeekColumn;
