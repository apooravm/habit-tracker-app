import { UpdateHabit } from "@/db/db";
import { Habit, HabitState } from "@/types/habits";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import DeleteHabitConfirmModal from "./DeleteHabitConfirmModal";

type Props = {
    onClose: () => void;
    isVisible: boolean;
    habit: Habit;
    updateHabit: (id: number, changes: Partial<HabitState>) => void;
};

export default function HabitConfigModal({ onClose, isVisible, habit, updateHabit }: Props) {
    const [habitData, setHabitData] = useState<Habit>(habit);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <Modal transparent visible={isVisible} animationType="fade">
            <DeleteHabitConfirmModal
                onClose={() => setModalVisible(false)}
                configModalOnClose={onClose}
                isVisible={modalVisible}
                habit_id={habitData.id}
            />
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
                                gap: 6,
                            }}>
                            <Pressable style={{ marginTop: 4 }} onPress={onClose}>
                                <MaterialIcons name="close" size={22} color="#000" />
                            </Pressable>
                            <Text style={styles.title}>Edit</Text>
                        </View>
                        <View style={{}}>
                            <Pressable
                                style={{}}
                                onPress={() => {
                                    setModalVisible(true);
                                }}>
                                <MaterialIcons
                                    style={{ borderWidth: 0, borderColor: "red" }}
                                    name="delete"
                                    size={22}
                                    color="#b50000ff"
                                />
                            </Pressable>
                        </View>
                    </View>
                    <View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputText}>Habit name</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="name"
                                value={habitData.name}
                                onChangeText={val => setHabitData(prev => ({ ...prev, name: val }))}
                            />
                        </View>
                    </View>
                    <Pressable
                        style={styles.btnContainer}
                        onPress={() => {
                            UpdateHabit(
                                habitData.id,
                                habitData.name,
                                habitData.start_date,
                                habit.archived,
                            ).then(() => {
                                updateHabit(habitData.id, { name: habitData.name });
                                onClose();
                            });
                        }}>
                        <View style={styles.shadow} />
                        <View style={styles.button}>
                            <Text
                                style={{
                                    fontSize: 16,
                                }}>
                                Update
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

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
        // paddingVertical: 32,
        paddingBottom: 50,

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
