import React from "react";

import { AuthProvider } from "./auth/AuthContext";
import AuthGate from "./screens/AuthGate";

export default function AppRoot() {
    return (
        <AuthProvider>
            <AuthGate />
        </AuthProvider>
    );
}
