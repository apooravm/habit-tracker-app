import { DayCount } from "@/types/habits";
import { View } from "react-native";

export const DayCell = ({ day }: { day: DayCount }) => {
    return (
        <View
            style={{
                width: 18,
                height: 18,
                marginBottom: 4,
                borderRadius: 2,
                backgroundColor: day.done ? "#39d353" : "#161b22",
            }}
        />
    );
};
