import { View } from "react-native";

type Props = {
    count: number;
};

export default function DayCell({ count }: Props) {
    return (
        <View
            style={{
                width: 12,
                height: 12,
                marginBottom: 4,
                borderRadius: 2,
                backgroundColor: "orange",
            }}
        />
    );
}
