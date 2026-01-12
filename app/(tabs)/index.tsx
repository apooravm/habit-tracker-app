import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "hotpink",
        fontWeight: "800",
        fontSize: 20,
    },
    button: {
        fontSize: 20,
        textDecorationLine: "underline",
        color: "#fff",
    },
});

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>2939329 index.tsx to edit this screen.</Text>
            <Link href="/about" style={styles.button}>
                Go to About Screen
            </Link>
        </View>
    );
}
