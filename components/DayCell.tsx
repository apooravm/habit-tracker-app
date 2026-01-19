import { DayCount, DayDone } from "@/types/habits";
import { View } from "react-native";

const colourlime = {
    outofscope: "#161b22",
    active: "#a0ff5dff",
    inactive: "#1d310dff",
};

const colourOrange = {
    outofscope: "#161b22",
    active: "#ff9130ff",
    inactive: "#30230dff",
};

const colourPink = {
    outofscope: "#161b22",
    active: "#ff4ff9ff",
    inactive: "#290a47ff",
};

const c = colourlime;

export const DayCell = ({ day }: { day: DayCount }) => {
    return (
        <View
            style={{
                width: 14,
                height: 14,
                marginBottom: 4,
                borderRadius: 4,
                backgroundColor:
                    day.done === DayDone.OutOfScope
                        ? c.outofscope
                        : day.done === DayDone.Yes
                          ? c.active
                          : c.inactive,
            }}
        />
    );
};
