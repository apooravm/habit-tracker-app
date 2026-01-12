// matches route any 404 route

import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        justifyContent: "center",
        alignItems: "center",
    },

    button: {
        fontSize: 20,
        textDecorationLine: "underline",
        color: "#fff",
    },
});

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "You Lost Bro? 🤷‍♂️" }} />
            <View style={styles.container}>
                <Link href={"/(tabs)/about"} style={styles.button}>
                    Go Home
                </Link>
            </View>
        </>
    );
}
