import { StyleSheet, Text, View } from "react-native";

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
            <Text style={styles.text}>Hi 😪</Text>
        </View>
    );
}
