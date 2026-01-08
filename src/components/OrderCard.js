import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { statusStyle, theme } from "../theme";

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
    showImage,
}) {
    const st = statusStyle(order?.status);

    const itemImageUrl = (() => {
        const items = order?.items;
        if (!Array.isArray(items) || items.length === 0) return null;
        const withImg = items.find((it) => it?.productImgUrl);
        return withImg?.productImgUrl ? String(withImg.productImgUrl) : null;
    })();

    return (
        <View style={styles.card}>
            <View style={styles.rowBetween}>
                <Text style={styles.title} numberOfLines={1}>
                    Order
                </Text>
                <View style={[styles.statusPill, { backgroundColor: st.bg }]}
                >
                    <Text style={[styles.statusText, { color: st.fg }]}>{String(order?.status || "")}</Text>
                </View>
            </View>

            {showImage && itemImageUrl ? (
                <Image
                    source={{ uri: itemImageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            ) : null}

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
        borderColor: theme.colors.border,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        backgroundColor: theme.colors.card,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
    },
    title: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.text,
        fontWeight: "800",
    },
    statusPill: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "900",
    },
    image: {
        marginTop: 12,
        width: "100%",
        height: 140,
        borderRadius: 12,
        backgroundColor: theme.colors.primarySoft,
    },
    section: {
        marginTop: 10,
    },
    label: {
        marginTop: 8,
        fontSize: 12,
        color: theme.colors.muted,
        fontWeight: "700",
    },
    value: {
        marginTop: 2,
        fontSize: 14,
        color: theme.colors.text,
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
        backgroundColor: theme.colors.primary,
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
        backgroundColor: theme.colors.primarySoft,
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.border,
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
