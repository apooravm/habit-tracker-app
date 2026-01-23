import { createHabit } from "@/db/db";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
    isVisible: boolean;
    onClose: () => void;
};

const BUTTON_W = 280;
const BUTTON_H = 50;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    popup: {
        width: "80%",
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 10,
        padding: 24,
        paddingVertical: 32,
        paddingBottom: 48,

        // shadows
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 12,
        gap: 10,
    },

    title: {
        fontSize: 20,
        fontWeight: "500",
    },

    closeButton: {
        paddingTop: 2,
    },

    inputContainer: {
        flexDirection: "column",
        gap: 5,
    },

    inputText: {
        paddingLeft: 2,
    },

    inputBox: {
        borderWidth: 2,
        borderColor: "#252525ff",
        borderRadius: 5,
    },

    shadow: {
        position: "absolute",
        width: BUTTON_W,
        height: BUTTON_H,
        borderRadius: 0,
        backgroundColor: "#000000ff",
        transform: [{ translateY: 4 }, { translateX: 4 }],
        zIndex: 0,
    },

    button: {
        width: BUTTON_W,
        height: BUTTON_H,
        borderRadius: 0,
        backgroundColor: "#4CAF50",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },

    btnContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 35,
    },
});

export default function CreateHabit({ isVisible, onClose }: Props) {
    const [habitName, setHabitName] = useState<string>("");
    return (
        <Modal transparent visible={isVisible} animationType="fade">
            <View style={styles.container}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                    <BlurView
                        intensity={100}
                        tint="dark"
                        blurReductionFactor={10}
                        style={StyleSheet.absoluteFill}
                    />
                </Pressable>

                <View style={styles.popup}>
                    <View style={styles.header}>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <MaterialIcons name="close" size={22} color="#000" />
                        </Pressable>
                        <Text style={styles.title}>Create new habit 🔥</Text>
                    </View>
                    <View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputText}>Habit name</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder=""
                                value={habitName}
                                onChangeText={name => setHabitName(name)}
                            />
                        </View>
                    </View>
                    <Pressable
                        style={styles.btnContainer}
                        onPress={() => {
                            const today = new Date();
                            createHabit(habitName, today.toDateString()).then(() => {
                                onClose();
                            });
                        }}>
                        <View style={styles.shadow} />
                        <View style={styles.button}>
                            <Text
                                style={{
                                    fontSize: 16,
                                }}>
                                Create
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
