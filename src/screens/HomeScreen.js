import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../auth/AuthContext";
import OrdersScreen from "./OrdersScreen";
import { theme } from "../theme";

export default function HomeScreen() {
    const { rider, logout } = useAuth();

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
                        <Text style={styles.title}>Welcome</Text>
                        <Text style={styles.subtitle}>Signed in as {rider?.name || rider?.username || "rider"}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <PrimaryButton title="Logout" onPress={onLogout} />
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{rider?.name || "-"}</Text>

                    <Text style={styles.label}>Username</Text>
                    <Text style={styles.value}>{rider?.username || "-"}</Text>

                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.value}>{rider?.phone || "-"}</Text>
                </View>

                <View style={styles.ordersWrap}>
                    <OrdersScreen embedded />
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
    card: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
        borderRadius: 12,
        padding: 14,
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    ordersWrap: {
        flex: 1,
        marginTop: 16,
    },
    label: {
        marginTop: 10,
        fontSize: 12,
        color: "#CBD5E1",
        fontWeight: "700",
    },
    value: {
        marginTop: 2,
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "600",
    },
});
