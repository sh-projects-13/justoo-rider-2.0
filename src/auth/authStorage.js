import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "justoo:rider:token";
const RIDER_KEY = "justoo:rider:profile";

export async function getStoredToken() {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setStoredToken(token) {
    if (!token) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, String(token));
}

export async function getStoredRider() {
    const raw = await SecureStore.getItemAsync(RIDER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export async function setStoredRider(rider) {
    if (!rider) {
        await SecureStore.deleteItemAsync(RIDER_KEY);
        return;
    }
    await SecureStore.setItemAsync(RIDER_KEY, JSON.stringify(rider));
}

export async function clearStoredAuth() {
    await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(RIDER_KEY),
    ]);
}
