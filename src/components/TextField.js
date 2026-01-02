import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function TextField({ label, value, onChangeText, placeholder, secureTextEntry, autoCapitalize, keyboardType }) {
    return (
        <View style={styles.wrap}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                style={styles.input}
                placeholderTextColor="#6B7280"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        width: "100%",
        marginBottom: 12,
    },
    label: {
        marginBottom: 6,
        color: "#111827",
        fontSize: 14,
        fontWeight: "600",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: "#111827",
        backgroundColor: "#FFFFFF",
    },
});
