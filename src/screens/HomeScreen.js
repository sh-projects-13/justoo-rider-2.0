import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../auth/AuthContext";
import OrdersScreen from "./OrdersScreen";
import { theme } from "../theme";
import ProfileScreen from "./ProfileScreen";

export default function HomeScreen() {
    const { rider, logout } = useAuth();
    const [tab, setTab] = useState("orders");

    const subtitle = useMemo(() => {
        return rider?.name || rider?.username || "rider";
    }, [rider?.name, rider?.username]);

    async function onLogout() {
        try {
            await logout();
        } catch (err) {
            Alert.alert("Logout failed", String(err?.message || "LOGOUT_FAILED"));
        }
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.title}>Justoo Rider</Text>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <PrimaryButton title="Logout" onPress={onLogout} />
                    </View>
                </View>

                <View style={styles.tabs}>
                    <Pressable
                        onPress={() => setTab("orders")}
                        style={({ pressed }) => [
                            styles.tab,
                            tab === "orders" ? styles.tabActive : null,
                            pressed ? styles.tabPressed : null,
                        ]}
                    >
                        <Text style={[styles.tabText, tab === "orders" ? styles.tabTextActive : null]}>Orders</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setTab("profile")}
                        style={({ pressed }) => [
                            styles.tab,
                            tab === "profile" ? styles.tabActive : null,
                            pressed ? styles.tabPressed : null,
                        ]}
                    >
                        <Text style={[styles.tabText, tab === "profile" ? styles.tabTextActive : null]}>Profile</Text>
                    </Pressable>
                </View>

                <View style={styles.ordersWrap}>
                    {tab === "orders" ? <OrdersScreen embedded /> : <ProfileScreen />}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.colors.bg },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        width: 120,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: "#CBD5E1",
    },
    tabs: {
        marginTop: 16,
        flexDirection: "row",
        gap: 10,
        padding: 4,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
    },
    tabActive: {
        backgroundColor: "#FFFFFF",
    },
    tabPressed: {
        opacity: 0.9,
    },
    tabText: {
        fontSize: 13,
        fontWeight: "900",
        color: "#CBD5E1",
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    tabTextActive: {
        color: theme.colors.text,
    },
    ordersWrap: {
        flex: 1,
        marginTop: 16,
    },
});
