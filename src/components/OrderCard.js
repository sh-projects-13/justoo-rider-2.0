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

    const items = Array.isArray(order?.items) ? order.items : [];

    const detailed = !!showImage; // used only for accepted/active cards

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

            {detailed && items.length > 0 ? (
                <View style={styles.itemsWrap}>
                    {items.map((it, idx) => {
                        const img = it?.productImgUrl ? String(it.productImgUrl) : null;
                        const name = String(it?.productName || "Item");
                        const qty = it?.quantity ?? 0;
                        const unitPrice = it?.unitPrice;

                        return (
                            <View key={`${name}:${idx}`} style={styles.itemRow}>
                                {img ? (
                                    <Image
                                        source={{ uri: img }}
                                        style={styles.itemImg}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.itemImgPlaceholder} />
                                )}

                                <View style={styles.itemMeta}>
                                    <Text style={styles.itemName} numberOfLines={2}>
                                        {name}
                                    </Text>
                                    <Text style={styles.itemSub}>
                                        Qty: {String(qty)}  •  Unit: {money(unitPrice)}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            ) : null}

            <View style={styles.section}>
                {order?.customerName ? (
                    <>
                        <Text style={styles.label}>Customer</Text>
                        <Text style={styles.value}>{String(order.customerName)}</Text>
                    </>
                ) : null}

                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>
                    {order?.addressLabel ? `${order.addressLabel} — ` : ""}
                    {order?.addressLine1 || ""}
                    {order?.addressLine2 ? `, ${order.addressLine2}` : ""}
                </Text>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{money(order?.totalAmount)}</Text>
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
    itemsWrap: {
        marginTop: 12,
        gap: 10,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 10,
        borderRadius: 12,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    itemImg: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: theme.colors.primarySoft,
    },
    itemImgPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: theme.colors.primarySoft,
    },
    itemMeta: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: "800",
        color: theme.colors.text,
    },
    itemSub: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "700",
        color: theme.colors.muted,
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
    totalRow: {
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },
    totalLabel: {
        fontSize: 13,
        fontWeight: "900",
        color: theme.colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: "900",
        color: theme.colors.text,
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
        color: theme.colors.text,
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
