import React, { useMemo, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "../components/PrimaryButton";
import TextField from "../components/TextField";
import { useAuth } from "../auth/AuthContext";

export default function LoginScreen() {
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const canSubmit = useMemo(() => {
        return username.trim().length > 0 && password.length > 0 && !submitting;
    }, [username, password, submitting]);

    async function onSubmit() {
        try {
            setSubmitting(true);
            await login({ username: username.trim(), password });
        } catch (err) {
            const msg = String(err?.message || "LOGIN_FAILED");
            Alert.alert("Login failed", msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.safe}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Rider Login</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>

                    <View style={styles.form}>
                        <TextField
                            label="Username"
                            value={username}
                            onChangeText={setUsername}
                            placeholder="e.g. rider_01"
                            autoCapitalize="none"
                        />
                        <TextField
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Your password"
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <PrimaryButton title={submitting ? "Signing in…" : "Sign in"} onPress={onSubmit} disabled={!canSubmit} />

                        {submitting ? (
                            <View style={styles.loading}>
                                <ActivityIndicator />
                            </View>
                        ) : null}

                        <Text style={styles.hint}>
                            Tip: set `EXPO_PUBLIC_API_BASE_URL` to your backend URL.
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#FFFFFF" },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111827",
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: "#6B7280",
    },
    form: {
        marginTop: 24,
    },
    loading: {
        marginTop: 12,
        alignItems: "center",
    },
    hint: {
        marginTop: 14,
        fontSize: 12,
        color: "#6B7280",
    },
});
