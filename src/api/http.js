import { buildUrl } from "../config";

class HttpError extends Error {
    constructor(message, { status, data } = {}) {
        super(message);
        this.name = "HttpError";
        this.status = status;
        this.data = data;
    }
}

async function readJsonSafe(res) {
    const text = await res.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return { raw: text };
    }
}

/**
 * Minimal fetch wrapper.
 * - Sends JSON bodies
 * - Parses JSON responses
 * - Throws HttpError for non-2xx
 */
export async function http(path, { method = "GET", token, body, headers } = {}) {
    const url = buildUrl(path);
    const finalHeaders = {
        Accept: "application/json",
        ...(body != null ? { "Content-Type": "application/json" } : null),
        ...(token ? { Authorization: `Bearer ${token}` } : null),
        ...(headers || null),
    };

    const res = await fetch(url, {
        method,
        headers: finalHeaders,
        body: body != null ? JSON.stringify(body) : undefined,
    });

    const data = await readJsonSafe(res);

    if (!res.ok) {
        const msg =
            (data && (data.error || data.message)) ||
            `Request failed with status ${res.status}`;
        throw new HttpError(String(msg), { status: res.status, data });
    }

    return data;
}

export { HttpError };
