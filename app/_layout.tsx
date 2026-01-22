import { appStartup } from "@/funcs/initApp";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#25292e",
                },
                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerShown: true,
            }}
        />
    );
}
