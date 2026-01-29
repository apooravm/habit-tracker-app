import { DeleteHabit } from "@/db/db";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { BlurView } from "expo-blur";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    configModalOnClose: () => void;
    onClose: () => void;
    isVisible: boolean;
    habit_id: number;
};

export default function DeleteHabitConfirmModal({
    onClose,
    isVisible,
    configModalOnClose,
    habit_id,
}: Props) {
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
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignContent: "center",
                                gap: 8,
                            }}>
                            <Pressable style={{ marginTop: 4 }} onPress={onClose}>
                                <MaterialIcons name="close" size={22} color="#000" />
                            </Pressable>
                            <Text style={styles.title}>Archive</Text>
                        </View>
                    </View>
                    <View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputText}>
                                Do you really want to archive this habit?
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignContent: "center",
                            marginTop: 20,
                            gap: 10,
                        }}>
                        <Pressable
                            style={styles.btnContainer}
                            onPress={() => {
                                onClose();
                            }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                }}>
                                Cancel
                            </Text>
                        </Pressable>
                        <Pressable
                            style={{
                                ...styles.btnContainer,
                                backgroundColor: "#b60000ff",
                                borderColor: "transparent",
                            }}
                            onPress={() => {
                                DeleteHabit(habit_id).then(() => {
                                    onClose();
                                    configModalOnClose();
                                });
                            }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: "500",
                                    color: "white",
                                }}>
                                Confirm
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    popup: {
        width: "80%",
        backgroundColor: "rgba(255,255,255)",
        borderRadius: 10,
        padding: 24,
        // paddingVertical: 32,

        // shadows
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        // shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 10,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 1,
        justifyContent: "space-between",
        alignContent: "center",
        paddingBottom: 5,
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

    btnContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#adadadff",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
});
