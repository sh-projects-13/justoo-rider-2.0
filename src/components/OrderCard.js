import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function money(v) {
    if (v == null) return "-";
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return `₹${n.toFixed(2)}`;
}

export default function OrderCard({
    order,
    primaryAction,
    secondaryAction,
    disabled,
}) {
    return (
        <View style={styles.card}>
            <View style={styles.rowBetween}>
                <Text style={styles.id} numberOfLines={1}>
                    {String(order?.id || "")}
                </Text>
                <Text style={styles.status}>{String(order?.status || "")}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Total</Text>
                <Text style={styles.value}>{money(order?.totalAmount)}</Text>

                <Text style={styles.label}>Subtotal</Text>
                <Text style={styles.value}>{money(order?.subtotalAmount)}</Text>

                <Text style={styles.label}>Delivery fee</Text>
                <Text style={styles.value}>{money(order?.deliveryFee)}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>
                    {order?.addressLabel ? `${order.addressLabel} — ` : ""}
                    {order?.addressLine1 || ""}
                    {order?.addressLine2 ? `, ${order.addressLine2}` : ""}
                </Text>
            </View>

            {(primaryAction || secondaryAction) ? (
                <View style={styles.actions}>
                    {secondaryAction ? (
                        <Pressable
                            onPress={secondaryAction.onPress}
                            disabled={disabled || secondaryAction.disabled}
                            style={({ pressed }) => [
                                styles.secondaryBtn,
                                (disabled || secondaryAction.disabled) ? styles.btnDisabled : null,
                                pressed && !(disabled || secondaryAction.disabled) ? styles.btnPressed : null,
                            ]}
                        >
                            <Text style={styles.secondaryText}>{secondaryAction.title}</Text>
                        </Pressable>
                    ) : null}

                    {primaryAction ? (
                        <Pressable
                            onPress={primaryAction.onPress}
                            disabled={disabled || primaryAction.disabled}
                            style={({ pressed }) => [
                                styles.primaryBtn,
                                (disabled || primaryAction.disabled) ? styles.btnDisabled : null,
                                pressed && !(disabled || primaryAction.disabled) ? styles.btnPressed : null,
                            ]}
                        >
                            <Text style={styles.primaryText}>{primaryAction.title}</Text>
                        </Pressable>
                    ) : null}
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        backgroundColor: "#FFFFFF",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
    },
    id: {
        flex: 1,
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "700",
    },
    status: {
        fontSize: 12,
        color: "#111827",
        fontWeight: "800",
    },
    section: {
        marginTop: 10,
    },
    label: {
        marginTop: 8,
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "700",
    },
    value: {
        marginTop: 2,
        fontSize: 14,
        color: "#111827",
        fontWeight: "600",
    },
    actions: {
        marginTop: 14,
        flexDirection: "row",
        gap: 10,
    },
    primaryBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#111827",
        alignItems: "center",
    },
    primaryText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },
    secondaryBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    secondaryText: {
        color: "#111827",
        fontSize: 14,
        fontWeight: "700",
    },
    btnPressed: {
        opacity: 0.9,
    },
    btnDisabled: {
        opacity: 0.5,
    },
});
