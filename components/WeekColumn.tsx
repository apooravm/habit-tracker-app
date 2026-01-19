import { DayCount, ISODate } from "@/types/habits";
import { Pressable, View } from "react-native";
import { DayCell } from "./DayCell";

type Props = {
    week: DayCount[];
    toggleDay: (date: ISODate) => void;
};

const WeekColumn = ({ week, toggleDay }: Props) => {
    return (
        <View style={{ marginRight: 4 }}>
            {week.map(day => (
                <Pressable key={day.date} onPress={() => toggleDay(day.date)}>
                    <DayCell day={day} />
                </Pressable>
            ))}
        </View>
    );
};

export default WeekColumn;
