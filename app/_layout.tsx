import { ModalProvider, useModal } from "@/components/CreateHabitModalContext";
import { appStartup } from "@/funcs/initApp";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function HeaderButton() {
    const { showModal } = useModal();
    return (
        <View style={{ flexDirection: "row", marginRight: 10 }}>
            <TouchableOpacity onPress={() => showModal()} style={{ marginRight: 15 }}>
                <Ionicons name="options-outline" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showModal()} style={{}}>
                <Ionicons name="add-outline" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
}

export default function RootLayout() {
    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        (async () => {
            await Promise.all([
                appStartup(),
                sleep(1500), // minimum splash time
            ]);

            setAppReady(true);

            SplashScreen.hideAsync();
        })();
    }, []);

    if (!appReady) {
        return null; // native splash stays visible
    }

    const getDateString = () => {
        const date = new Date();
        // date string without the year
        return date.toDateString().split(" ").slice(0, 3).join(" ");
    };

    return (
        <ModalProvider>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#202020ff",
                    },
                    headerShadowVisible: false,
                    headerTintColor: "#fff",
                    headerShown: true,
                    headerTitle: () => (
                        <Text style={{ color: "#fff", fontSize: 18 }}>{getDateString()}</Text>
                    ),

                    headerRight: () => <HeaderButton />,
                }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
            </Stack>
        </ModalProvider>
    );
}
