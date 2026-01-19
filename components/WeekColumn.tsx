import { DayCount } from "@/types/habits";
import { memo } from "react";
import { View } from "react-native";
import { DayCell } from "./DayCell";

type Props = {
    habit_id: string;
    week: DayCount[];
};

const WeekColumn = ({ week, habit_id }: Props) => {
    return (
        <View style={{ marginRight: 3 }}>
            {week.map(day => (
                <DayCell day={day} />
                // <Pressable key={day.date} onPress={() => toggleDay(habit_id, day.date)}>
                // </Pressable>
            ))}
        </View>
    );
};

// optimizes - It prevents re-render unless week or habitId actually changes
export default memo(WeekColumn);
