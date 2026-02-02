import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

const colours = {
    active: "#6fc302ff",
    inactive: "#fff",
    border: "#eee",
    background: "#202020ff",
};

export default function tabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: {
                    display: "flex",
                    backgroundColor: colours.background,
                    borderColor: colours.border,
                },
                tabBarItemStyle: { borderRadius: 30 },
                tabBarActiveTintColor: colours.active,
                tabBarLabelStyle: { color: colours.inactive, fontWeight: "bold" },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                    // tabBarItemStyle: styles.tabIcon,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "home-sharp" : "home-outline"}
                            size={24}
                            color={focused ? colours.active : color}
                            style={{
                                borderColor: focused ? colours.active : "transparent",
                            }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "settings-sharp" : "settings-outline"}
                            size={24}
                            color={focused ? colours.active : color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabIcon: {
        borderWidth: 1,
        borderColor: "#fff",
        padding: 8,
    },
});
