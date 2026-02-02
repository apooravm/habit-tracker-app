import { StyleSheet, Text, View } from "react-native";

export default function Settings() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Settings Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        color: "white",
    },
    container: {
        flex: 1,
        backgroundColor: "#202020ff",
        justifyContent: "center",
        alignItems: "center",
    },
});
