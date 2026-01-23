import { ModalProvider, useModal } from "@/components/ModalContext";
import { appStartup } from "@/funcs/initApp";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

SplashScreen.preventAutoHideAsync();

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function HeaderButton() {
    const { showModal } = useModal();
    return (
        <TouchableOpacity onPress={() => showModal()} style={{ marginRight: 15 }}>
            <Ionicons name="add-circle-outline" size={28} color="white" />
        </TouchableOpacity>
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

    return (
        <ModalProvider>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#25292e",
                    },
                    headerShadowVisible: false,
                    headerTintColor: "#fff",
                    headerShown: true,
                    headerTitle: () => (
                        <Text style={{ color: "#fff", fontSize: 18 }}>Habit Tracker</Text>
                    ),

                    headerRight: () => <HeaderButton />,
                }}
            />
        </ModalProvider>
    );
}
