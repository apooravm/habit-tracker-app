import { StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";

const placeholderImage = require("@/assets/images2/background-image.png");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
        justifyContent: "center",
    },
    footContainer: {
        flex: 1 / 3,
        alignItems: "center",
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
            <ImageViewer imgSource={placeholderImage} />
            <View style={styles.footContainer}>
                <Button label="Choose a photo" />
                <Button label="Use this photo" />
            </View>
        </View>
    );
}
