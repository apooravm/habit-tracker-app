import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function tabLayout() {
    return (
        <Tabs screenOptions={{ tabBarStyle: { display: "flex" }, tabBarActiveTintColor: "blue" }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name="home-outline" size={24} color={focused ? "blue" : color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name="settings-outline"
                            size={24}
                            color={focused ? "blue" : color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
