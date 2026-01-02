import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { http, HttpError } from "../api/http";
import {
    clearStoredAuth,
    getStoredRider,
    getStoredToken,
    setStoredRider,
    setStoredToken,
} from "./authStorage";

const AuthContext = createContext(null);

const initialState = {
    isBootstrapping: true,
    token: null,
    rider: null,
    lastError: null,
};

export function AuthProvider({ children }) {
    const [state, setState] = useState(initialState);

    const bootstrap = useCallback(async () => {
        try {
            const [storedToken, storedRider] = await Promise.all([
                getStoredToken(),
                getStoredRider(),
            ]);

            const token = storedToken || null;
            const rider = storedRider || null;

            if (!token) {
                setState((s) => ({
                    ...s,
                    isBootstrapping: false,
                    token: null,
                    rider: null,
                    lastError: null,
                }));
                return;
            }

            // Validate token and refresh rider profile.
            try {
                const me = await http("/rider/auth/me", { method: "GET", token });
                const freshRider = me?.rider || rider;
                if (me?.rider) {
                    await setStoredRider(me.rider);
                }

                setState((s) => ({
                    ...s,
                    isBootstrapping: false,
                    token,
                    rider: freshRider,
                    lastError: null,
                }));
            } catch (err) {
                // If backend says token is invalid/revoked, force local logout.
                if (err instanceof HttpError) {
                    const apiError = err?.data?.error;
                    if (
                        err.status === 401 &&
                        (apiError === "TOKEN_INVALID" ||
                            apiError === "TOKEN_REVOKED" ||
                            apiError === "TOKEN_REQUIRED")
                    ) {
                        await clearStoredAuth();
                        setState((s) => ({
                            ...s,
                            isBootstrapping: false,
                            token: null,
                            rider: null,
                            lastError: apiError,
                        }));
                        return;
                    }
                }

                // Network/server issues: keep stored session and let the user proceed.
                setState((s) => ({
                    ...s,
                    isBootstrapping: false,
                    token,
                    rider,
                    lastError: "ME_CHECK_FAILED",
                }));
            }
        } catch (err) {
            setState((s) => ({ ...s, isBootstrapping: false, lastError: "BOOTSTRAP_FAILED" }));
        }
    }, []);

    useEffect(() => {
        bootstrap();
    }, [bootstrap]);

    const login = useCallback(async ({ username, password }) => {
        setState((s) => ({ ...s, lastError: null }));

        const data = await http("/rider/auth/login", {
            method: "POST",
            body: { username, password },
        });

        const token = data?.token;
        const rider = data?.rider;

        if (!token || !rider) {
            setState((s) => ({ ...s, lastError: "LOGIN_RESPONSE_INVALID" }));
            throw new Error("LOGIN_RESPONSE_INVALID");
        }

        await Promise.all([setStoredToken(token), setStoredRider(rider)]);

        setState((s) => ({
            ...s,
            token,
            rider,
            lastError: null,
        }));

        return { token, rider };
    }, []);

    const logout = useCallback(async ({ bestEffortServerLogout = true } = {}) => {
        const token = state.token;

        // Best-effort server logout (only if the endpoint exists). Ignore failures.
        if (bestEffortServerLogout && token) {
            try {
                await http("/rider/auth/logout", { method: "POST", token });
            } catch {
                // ignore
            }
        }

        await clearStoredAuth();
        setState((s) => ({ ...s, token: null, rider: null, lastError: null }));
    }, [state.token]);

    const authedRequest = useCallback(
        async (path, options = {}) => {
            const token = state.token;
            if (!token) {
                throw new Error("NOT_AUTHENTICATED");
            }

            try {
                return await http(path, { ...options, token });
            } catch (err) {
                // If backend says token is invalid/revoked, force local logout.
                if (err instanceof HttpError) {
                    const apiError = err?.data?.error;
                    if (
                        err.status === 401 &&
                        (apiError === "TOKEN_INVALID" || apiError === "TOKEN_REVOKED" || apiError === "TOKEN_REQUIRED")
                    ) {
                        await clearStoredAuth();
                        setState((s) => ({ ...s, token: null, rider: null, lastError: apiError }));
                    }
                }
                throw err;
            }
        },
        [state.token]
    );

    const value = useMemo(
        () => ({
            ...state,
            login,
            logout,
            authedRequest,
            refreshFromStorage: bootstrap,
        }),
        [state, login, logout, authedRequest, bootstrap]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = React.useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
