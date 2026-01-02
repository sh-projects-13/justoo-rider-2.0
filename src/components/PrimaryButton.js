import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export default function PrimaryButton({ title, onPress, disabled }) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.btn,
                disabled ? styles.btnDisabled : null,
                pressed && !disabled ? styles.btnPressed : null,
            ]}
        >
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btn: {
        width: "100%",
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#111827",
        alignItems: "center",
    },
    btnPressed: {
        opacity: 0.9,
    },
    btnDisabled: {
        opacity: 0.5,
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
