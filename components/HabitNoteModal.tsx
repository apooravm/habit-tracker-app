import {
    addHabitNote,
    addHabitNoteImage,
    deleteHabitNote,
    getHabitNote,
    removeHabitNoteImage,
    updateHabitNote,
} from "@/db/db";
import { Habit, HabitImage, HabitNote } from "@/types/habits";
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
};

export default function HabitNoteModal({ onClose, isVisible, habit }: Props) {
    // note.id and image.id set to -1 if not saved to db yet
    const [images, setImages] = useState<HabitImage[]>([]);
    const [noteText, setNoteText] = useState<HabitNote>({
        completion_date: new Date().toDateString(),
        habit_id: habit.id,
        note: "",
        id: -1,
    });
    const [deleteImageModalVisible, setDeleteImageModalVisible] = useState(false);
    const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);

    useEffect(() => {
        const today = new Date().toDateString();
        getHabitNote(habit.id, today).then(data => {
            setNoteText(data.note);
            setImages(data.images);
        });
    }, []);

    // id = -1 means not saved to db yet
    // can add it instead of updating it
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            // check if image already exists.
            // Does not work rn since image_uris are uniquely generated every time
            // if (images.some(img => img.image_uri === result.assets[0].uri)) {
            //     return;
            // }
            const today = new Date().toDateString();
            addHabitNoteImage(habit.id, result.assets[0].uri, today).then(id => {
                const newimage: HabitImage = {
                    id: id,
                    image_uri: result.assets[0].uri,
                    completion_date: today,
                    habit_id: habit.id,
                };
                setImages([...images, newimage]);
            });
        }
    };

    // add both note and image, skip if image was fetched from db, update note for same
    const createHabitNoteAndImage = () => {
        const today = new Date().toDateString();
        // keeping notes and images separate
        if (noteText.note.length !== 0) {
            if (noteText.id !== -1) {
                // update existing note
                updateHabitNote(
                    noteText.id,
                    noteText.habit_id,
                    noteText.note,
                    noteText.completion_date,
                );
            } else {
                addHabitNote(habit.id, noteText.note, today);
            }
        }
        // assuming adding an existing image wont create a new entry
        images.forEach(img => {
            if (img.id == -1) {
                addHabitNoteImage(habit.id, img.image_uri, today);
            }
        });
        onClose();
    };

    // save note if not exists, else update
    const updatedOnClose = () => {
        if (noteText.id === -1 && noteText.note.length !== 0) {
            addHabitNote(habit.id, noteText.note, noteText.completion_date);
        } else {
            // if note length == 0 -> delete, else update
            if (noteText.note.length === 0) {
                deleteHabitNote(noteText.id);
            } else {
                updateHabitNote(
                    noteText.id,
                    noteText.habit_id,
                    noteText.note,
                    noteText.completion_date,
                );
            }
        }

        onClose();
    };

    return (
        <Modal transparent visible={isVisible} animationType="fade">
            <ConfirmDeleteModal
                onClose={() => setDeleteImageModalVisible(false)}
                isVisible={deleteImageModalVisible}
                title="Delete image"
                description="Are you sure you want to delete this image?"
                onPressConfirm={() => {
                    setImages(
                        // remove locally and from db
                        images.filter((img, idx) => {
                            if (idx === selectedImageIdx) {
                                removeHabitNoteImage(img.id);
                            }
                            return idx !== selectedImageIdx;
                        }),
                    );
                    setDeleteImageModalVisible(false);
                }}
            />
            <View style={styles.container}>
                <Pressable style={StyleSheet.absoluteFill} onPress={updatedOnClose}>
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
                            <Pressable style={{ marginTop: 4 }} onPress={updatedOnClose}>
                                <MaterialIcons name="close" size={22} color="#000" />
                            </Pressable>
                            <Text style={styles.title}>Note</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            minHeight: 100,
                            maxHeight: 450,
                            borderWidth: 0,
                            borderColor: "#ccc",
                            borderRadius: 5,
                            padding: 0,
                            gap: 10,
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}>
                        {/* Text input anchored to the top */}
                        <TextInput
                            multiline
                            autoFocus
                            autoCorrect
                            scrollEnabled
                            value={noteText?.note}
                            onChangeText={text => {
                                const temp: HabitNote = {
                                    completion_date: new Date().toDateString(),
                                    habit_id: noteText.habit_id,
                                    note: text,
                                    id: noteText.id,
                                };
                                setNoteText(temp);
                            }}
                            style={[styles.inputBox, { minHeight: 100, maxHeight: 200 }]}
                            placeholder={`How was ${habit.name.toLocaleLowerCase()} today?`}
                        />

                        {/* Image scroller anchored to the bottom */}
                        <View style={{ marginTop: 8, height: 160 }}>
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
                                    },
                                    images.length === 0 ? { width: "100%", minWidth: 0 } : {},
                                ]}
                                style={{
                                    flex: 1,
                                }}>
                                {images.map((image, idx) => (
                                    <View
                                        key={idx}
                                        style={{
                                            width: 140,
                                            height: 140,
                                            overflow: "hidden",
                                            borderWidth: 1,
                                            borderColor: "#ccc",
                                            borderRadius: 6,
                                            borderBottomRightRadius: 0,
                                            marginRight: 6,
                                        }}>
                                        <Pressable
                                            onPress={() => {
                                                setSelectedImageIdx(idx);
                                                setDeleteImageModalVisible(true);
                                            }}
                                            style={{
                                                position: "absolute",
                                                backgroundColor: "#dc0000ff",
                                                borderBottomRightRadius: 0,
                                                transform: [
                                                    { translateY: 114 },
                                                    { translateX: 114 },
                                                ],
                                                zIndex: 1,
                                                padding: 2,
                                            }}>
                                            <MaterialIcons
                                                name="delete"
                                                size={20}
                                                color="#ffffff"
                                            />
                                        </Pressable>
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
                        </View>
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
        width: "90%",
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 10,
        borderWidth: 0,
        borderColor: "red",
        padding: 18,

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
        maxHeight: 200,
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
        margin: 2,
    },

    btnContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 35,
    },
});
