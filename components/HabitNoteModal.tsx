import { addHabitNote, addHabitNoteImage, getHabitNote } from "@/db/db";
import { Habit, HabitAction, HabitImage, HabitNote } from "@/types/habits";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type Props = {
    onClose: () => void;
    isVisible: boolean;
    habit: Habit;
    applyHabitAction: (action: HabitAction) => void;
};

export default function HabitNoteModal({ onClose, isVisible, habit, applyHabitAction }: Props) {
    const [images, setImages] = useState<HabitImage[]>([]);
    const [noteText, setNoteText] = useState<HabitNote>({
        completion_date: new Date().toDateString(),
        habit_id: habit.id,
        note: "",
        id: -1,
    });
    const [deleteImageModalVisible, setDeleteImageModalVisible] = useState(false);

    useEffect(() => {
        const today = new Date().toDateString();
        getHabitNote(habit.id, today).then(data => {
            setNoteText(data.note);
            setImages(data.images);
        });
    }, []);

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            const newimage: HabitImage = {
                id: -1,
                image_uri: result.assets[0].uri,
                completion_date: new Date().toDateString(),
                habit_id: habit.id,
            };
            setImages([...images, newimage]);
            // addHabitNoteImage(habit.id, result.assets[0].uri, new Date().toDateString());
        } else {
            alert("You did not select any image.");
        }
    };

    return (
        <Modal transparent visible={isVisible} animationType="fade">
            <ConfirmDeleteModal
                onClose={() => setDeleteImageModalVisible(false)}
                isVisible={deleteImageModalVisible}
                title="Delete image"
                description="Are you sure you want to delete this image?"
                onPressConfirm={() => {
                    setDeleteImageModalVisible(false);
                }}
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
                                gap: 10,
                            }}>
                            <Pressable style={{ marginTop: 4 }} onPress={onClose}>
                                <MaterialIcons name="close" size={22} color="#000" />
                            </Pressable>
                            <Text style={styles.title}>Note</Text>
                        </View>
                    </View>
                    <ScrollView
                        style={{
                            minHeight: 100,
                            maxHeight: 450,
                            borderWidth: 0,
                            borderColor: "#ccc",
                            borderRadius: 5,
                            padding: 4,
                            gap: 10,
                        }}>
                        <TextInput
                            multiline
                            autoFocus
                            autoCorrect
                            scrollEnabled
                            value={noteText?.note}
                            onChangeText={text => {
                                const temp: HabitNote = {
                                    completion_date: new Date().toDateString(),
                                    habit_id: habit.id,
                                    note: text,
                                    id: noteText ? noteText.id : -1,
                                };
                                setNoteText(temp);
                            }}
                            style={styles.inputBox}
                            placeholder={`How was ${habit.name.toLocaleLowerCase()} today?`}
                        />
                        <ScrollView
                            horizontal
                            nestedScrollEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={[
                                {
                                    paddingVertical: 8,
                                    paddingRight: 0,
                                    alignItems: "center",
                                    flexDirection: "row",
                                    gap: 4,

                                    borderWidth: 0,
                                    borderColor: "red",
                                },
                                images.length === 0
                                    ? { width: "100%", minWidth: 0 } // full width when no images
                                    : {},
                            ]}
                            style={{
                                flex: 1,
                                maxHeight: 180, // give the horizontal scroller a bounded height
                            }}>
                            {images.map((image, index) => (
                                <View
                                    key={index}
                                    style={{
                                        width: 140,
                                        height: 140,
                                        overflow: "hidden",
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        borderRadius: 6,
                                        borderBottomRightRadius: 0,
                                    }}>
                                    <MaterialIcons
                                        style={styles.deletePhotoIcon}
                                        name="delete-outline"
                                        size={26}
                                        color="#ffffff"
                                    />
                                    <Image
                                        source={{ uri: image.image_uri }}
                                        style={{ width: "100%", height: "100%" }}
                                        contentFit="cover"
                                    />
                                </View>
                            ))}
                            <Pressable
                                onPress={() => {
                                    pickImageAsync();
                                }}
                                style={[
                                    {
                                        height: 140,
                                        flexGrow: 1,
                                        minWidth: 140,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderWidth: 2,
                                        borderColor: "#ccc",
                                        borderRadius: 6,
                                        padding: 10,
                                        borderStyle: "dashed",
                                    },
                                    images.length === 0
                                        ? { width: "100%", minWidth: 0 } // full width when no images
                                        : { width: 140 }, // keep compact when images present
                                ]}>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}>
                                    <MaterialIcons name="add-a-photo" size={22} color="#000" />
                                    <Text>Add Photos</Text>
                                </View>
                            </Pressable>
                        </ScrollView>
                    </ScrollView>
                    <Pressable
                        style={styles.btnContainer}
                        onPress={() => {
                            const today = new Date().toDateString();
                            // Keeping notes and images separate
                            if (noteText.note.length !== 0) {
                                addHabitNote(habit.id, noteText.note, today);
                            }
                            images.forEach(img => {
                                addHabitNoteImage(habit.id, img.image_uri, today);
                            });
                            onClose();
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

const BUTTON_W = 320;
const BUTTON_H = 50;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    popup: {
        width: "90%",
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 10,
        padding: 18,
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
        paddingLeft: 4,
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

    deletePhotoIcon: {
        position: "absolute",
        // width: 10,
        // height: 10,
        backgroundColor: "#dc0000ff",
        borderBottomRightRadius: 0,
        transform: [{ translateY: 112 }, { translateX: 112 }],
        zIndex: 1,
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
