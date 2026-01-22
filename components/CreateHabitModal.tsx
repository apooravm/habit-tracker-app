import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
    isVisible: boolean;
    onClose: () => void;
};

export default function CreateHabit({ isVisible, onClose }: Props) {
    return (
        <View>
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View>
                    <Text>choose smn bruh</Text>
                    <Pressable onPress={onClose}>
                        <MaterialIcons name="close" color="#fff" size={22} />
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
}
