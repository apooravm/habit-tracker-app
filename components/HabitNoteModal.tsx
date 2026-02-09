import { Habit, HabitAction } from "@/types/habits";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
    onClose: () => void;
    isVisible: boolean;
    habit: Habit;
    applyHabitAction: (action: HabitAction) => void;
};

export default function HabitNoteModal({ onClose, isVisible, habit, applyHabitAction }: Props) {
    const [imageURIs, setImageURIs] = useState<string[]>([]);

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImageURIs([...imageURIs, ...result.assets.map(asset => asset.uri)]);
        } else {
            alert("You did not select any image.");
        }
    };

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
                                gap: 6,
                            }}>
                            <Pressable style={{ marginTop: 4 }} onPress={onClose}>
                                <MaterialIcons name="close" size={22} color="#000" />
                            </Pressable>
                            <Text style={styles.title}>Note</Text>
                        </View>
                    </View>
                    <View>
                        <TextInput
                            multiline
                            autoFocus
                            autoCorrect
                            scrollEnabled
                            style={styles.inputBox}
                            placeholder={`How was ${habit.name.toLocaleLowerCase()} today?`}
                        />
                    </View>
                    <View>
                        {imageURIs.map((uri, index) => (
                            <View
                                key={index}
                                style={{
                                    width: "100%", // fill the modal's content width
                                    height: "auto", // fixed height for the image container
                                    overflow: "hidden",
                                    marginBottom: 8,
                                    borderWidth: 1,
                                    borderColor: "#ccc",
                                }}>
                                <Image
                                    source={{ uri }}
                                    // let the image fill the container width and keep its aspect ratio
                                    style={{ width: "100%", aspectRatio: 1 }}
                                    contentFit="contain"
                                />
                            </View>
                        ))}
                    </View>
                    <Pressable
                        onPress={() => {
                            pickImageAsync();
                        }}
                        style={{
                            alignItems: "center",
                            gap: 8,
                            marginTop: 15,
                            borderWidth: 2,
                            borderColor: "#ccc",
                            borderRadius: 5,
                            padding: 10,
                            borderStyle: "dashed",
                        }}>
                        <View style={{ flexDirection: "column", alignItems: "center", gap: 8 }}>
                            <MaterialIcons name="add-a-photo" size={22} color="#000" />
                            <Text>Add Photos</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        style={styles.btnContainer}
                        onPress={() => {
                            pickImageAsync();
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
        borderWidth: 0,
        borderColor: "#252525ff",
        borderRadius: 5,
        minHeight: 100,
        maxHeight: 300,
        textAlignVertical: "top",
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
