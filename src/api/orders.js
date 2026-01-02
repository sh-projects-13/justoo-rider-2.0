import { HttpError } from "./http";

export async function listAvailableOrders(authedRequest) {
    const data = await authedRequest("/rider/orders/available", { method: "GET" });
    return data?.orders || [];
}

export async function listMyActiveOrders(authedRequest) {
    const data = await authedRequest("/rider/orders/active", { method: "GET" });
    return data?.orders || [];
}

export async function acceptOrder(authedRequest, orderId) {
    if (!orderId) throw new Error("ORDER_ID_REQUIRED");
    return authedRequest(`/rider/orders/${encodeURIComponent(orderId)}/accept`, {
        method: "POST",
    });
}

export async function markOutForDelivery(authedRequest, orderId) {
    if (!orderId) throw new Error("ORDER_ID_REQUIRED");
    return authedRequest(
        `/rider/orders/${encodeURIComponent(orderId)}/out-for-delivery`,
        { method: "POST" }
    );
}

export async function markDelivered(authedRequest, orderId) {
    if (!orderId) throw new Error("ORDER_ID_REQUIRED");
    return authedRequest(`/rider/orders/${encodeURIComponent(orderId)}/delivered`, {
        method: "POST",
    });
}

export function toApiErrorMessage(err) {
    if (err instanceof HttpError) {
        const apiError = err?.data?.error;
        return apiError || `HTTP_${err.status}`;
    }
    return String(err?.message || "UNKNOWN_ERROR");
}
