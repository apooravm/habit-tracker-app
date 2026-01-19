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
    imageContainer: {
        flex: 1,
    },
    text: {
        color: "hotpink",
        fontWeight: "800",
        fontSize: 20,
    },
});

export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageViewer imgSource={placeholderImage} />
            </View>
            <View style={styles.footContainer}>
                <Button label="Choose a photo" theme="primary" />
                <Button label="Use this photo" />
            </View>
        </View>
    );
}
