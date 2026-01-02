import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../auth/AuthContext";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";

export default function AuthGate() {
    const { isBootstrapping, token } = useAuth();

    if (isBootstrapping) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.center}>
                    <ActivityIndicator />
                    <Text style={styles.text}>Loading…</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!token) return <LoginScreen />;
    return <HomeScreen />;
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#FFFFFF" },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    text: { marginTop: 10, color: "#6B7280" },
});
