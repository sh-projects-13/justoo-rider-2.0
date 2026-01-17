import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../auth/AuthContext";
import OrderCard from "../components/OrderCard";
import {
    acceptOrder,
    listAvailableOrders,
    listMyActiveOrders,
    markDelivered,
    markOutForDelivery,
    toApiErrorMessage,
} from "../api/orders";
import { theme } from "../theme";

export default function OrdersScreen({ embedded = false } = {}) {
    const { authedRequest } = useAuth();

    const [available, setAvailable] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [busyOrderId, setBusyOrderId] = useState(null);

    const loadAll = useCallback(async () => {
        const [avail, active] = await Promise.all([
            listAvailableOrders(authedRequest),
            listMyActiveOrders(authedRequest),
        ]);
        setAvailable(Array.isArray(avail) ? avail : []);
        setActiveOrders(Array.isArray(active) ? active : []);
    }, [authedRequest]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                await loadAll();
            } catch (err) {
                if (mounted) Alert.alert("Error", toApiErrorMessage(err));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [loadAll]);

    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await loadAll();
        } catch (err) {
            Alert.alert("Error", toApiErrorMessage(err));
        } finally {
            setRefreshing(false);
        }
    }, [loadAll]);

    async function onAccept(order) {
        const id = order?.id;
        if (!id) return;

        try {
            setBusyOrderId(id);
            await acceptOrder(authedRequest, id);

            await loadAll();
            Alert.alert("Accepted", "Order assigned to you.");
        } catch (err) {
            Alert.alert("Cannot accept", toApiErrorMessage(err));
        } finally {
            setBusyOrderId(null);
        }
    }

    async function onOutForDelivery(order) {
        const id = order?.id;
        if (!id) return;

        try {
            setBusyOrderId(id);
            await markOutForDelivery(authedRequest, id);
            await loadAll();
            Alert.alert("Updated", "Marked out for delivery.");
        } catch (err) {
            Alert.alert("Cannot update", toApiErrorMessage(err));
        } finally {
            setBusyOrderId(null);
        }
    }

    async function onDelivered(order) {
        const id = order?.id;
        if (!id) return;

        try {
            setBusyOrderId(id);
            await markDelivered(authedRequest, id);
            Alert.alert("Done", "Marked delivered.");

            await loadAll();
        } catch (err) {
            Alert.alert("Cannot update", toApiErrorMessage(err));
        } finally {
            setBusyOrderId(null);
        }
    }

    function renderActiveOrderCard(order) {
        const id = order?.id;
        const disabled = busyOrderId && busyOrderId !== id;
        const status = order?.status;
        // console.log(order);

        const canOutForDelivery = status === "ASSIGNED_RIDER";
        const canDelivered = status === "OUT_FOR_DELIVERY";

        return (
            <OrderCard
                key={`active:${String(id)}`}
                order={order}
                showImage
                disabled={!!disabled}
                primaryAction={
                    canDelivered
                        ? {
                            title: busyOrderId === id ? "Working…" : "Delivered",
                            onPress: () => onDelivered(order),
                            disabled: busyOrderId === id,
                        }
                        : undefined
                }
                secondaryAction={
                    canOutForDelivery
                        ? {
                            title: busyOrderId === id ? "Working…" : "Out for delivery",
                            onPress: () => onOutForDelivery(order),
                            disabled: busyOrderId === id,
                        }
                        : undefined
                }
            />
        );
    }

    const renderOrder = ({ item }) => {
        const id = item?.id;
        const disabled = busyOrderId && busyOrderId !== id;

        return (
            <OrderCard
                order={item}
                disabled={!!disabled}
                primaryAction={{
                    title: busyOrderId === id ? "Accepting…" : "Accept",
                    onPress: () => onAccept(item),
                    disabled: busyOrderId === id,
                }}
            />
        );
    };

    const Wrapper = embedded ? View : SafeAreaView;
    const wrapperProps = embedded ? { style: styles.embeddedWrap } : { style: styles.safe };

    return (
        <Wrapper {...wrapperProps}>
            <View style={embedded ? styles.embeddedContainer : styles.container}>
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator />
                        <Text style={styles.helper}>Loading orders…</Text>
                    </View>
                ) : (
                    <FlatList
                        data={available}
                        keyExtractor={(o, idx) => `avail:${String(o?.id || idx)}`}
                        renderItem={renderOrder}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        ListHeaderComponent={
                            <View>
                                {embedded ? null : <Text style={styles.title}>Orders</Text>}

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Active</Text>
                                    {activeOrders.length === 0 ? (
                                        <Text style={styles.helper}>No active orders.</Text>
                                    ) : (
                                        activeOrders.map(renderActiveOrderCard)
                                    )}
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Available</Text>
                                </View>
                            </View>
                        }
                        contentContainerStyle={available.length === 0 ? styles.emptyList : null}
                        ListEmptyComponent={
                            <Text style={styles.helper}>No available orders right now.</Text>
                        }
                    />
                )}
            </View>
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.colors.bg },
    embeddedWrap: { flex: 1, backgroundColor: "transparent" },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    embeddedContainer: {
        flex: 1,
        paddingHorizontal: 0,
        paddingTop: 0,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    section: {
        marginTop: 18,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: "#FFFFFF",
        marginBottom: 10,
    },
    helper: {
        marginTop: 8,
        fontSize: 12,
        color: "#CBD5E1",
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
    },
    emptyList: {
        paddingTop: 6,
    },
});
