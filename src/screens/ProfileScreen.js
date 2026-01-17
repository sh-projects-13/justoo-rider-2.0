import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAuth } from "../auth/AuthContext";
import { theme } from "../theme";

function initials(name) {
    const s = String(name || "").trim();
    if (!s) return "R";
    const parts = s.split(/\s+/).slice(0, 2);
    return parts
        .map((p) => p.slice(0, 1).toUpperCase())
        .join("")
        .slice(0, 2);
}

export default function ProfileScreen() {
    const { rider } = useAuth();

    const badge = useMemo(() => initials(rider?.name || rider?.username), [rider?.name, rider?.username]);

    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{badge}</Text>
                </View>
                <Text style={styles.name}>{rider?.name || "Rider"}</Text>
                <Text style={styles.username}>@{rider?.username || "-"}</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.value}>{rider?.phone || "-"}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.value}>{rider?.isActive ? "Active" : "Inactive"}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
    hero: {
        alignItems: "center",
        paddingVertical: 18,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "900",
    },
    name: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: "900",
        color: "#FFFFFF",
    },
    username: {
        marginTop: 4,
        fontSize: 13,
        fontWeight: "700",
        color: "#CBD5E1",
    },
    card: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
        borderRadius: 14,
        padding: 14,
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    label: {
        fontSize: 12,
        color: "#CBD5E1",
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },
    value: {
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: "800",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.12)",
        marginVertical: 12,
    },
});
