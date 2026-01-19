import { DayCount } from "@/types/habits";
import { View } from "react-native";

export const DayCell = ({ day }: { day: DayCount }) => {
    return (
        <View
            style={{
                width: 10,
                height: 10,
                marginBottom: 2,
                borderRadius: 2,
                backgroundColor: day.done ? "#39d353" : "#161b22",
            }}
        />
    );
};
