import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./auth/AuthContext";
import AuthGate from "./screens/AuthGate";

export default function AppRoot() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <AuthGate />
            </AuthProvider>
        </SafeAreaProvider>
    );
}
