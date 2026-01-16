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

const dates = [
    // Jan
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

    // Feb
    "2026-02-01",
    "2026-02-02",
    "2026-02-03",
    "2026-02-04",
    "2026-02-05",

    "2026-02-08",
    "2026-02-10",
    "2026-02-12",

    // Mar
    "2026-03-01",
    "2026-03-02",
    "2026-03-03",
    "2026-03-04",
    "2026-03-05",
];

export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <FlatList data={dates} horizontal showsHorizontalScrollIndicator={false}  />
            <Text style={styles.text}>About Screen</Text>
        </View>
    );
}
