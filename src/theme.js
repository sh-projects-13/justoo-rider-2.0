export const theme = {
    colors: {
        bg: "#0B1220",
        surface: "#0F1A2E",
        card: "#FFFFFF",

        text: "#0B1220",
        muted: "#64748B",

        primary: "#2563EB",
        primarySoft: "#DBEAFE",

        success: "#16A34A",
        successSoft: "#DCFCE7",

        warning: "#D97706",
        warningSoft: "#FFEDD5",

        info: "#7C3AED",
        infoSoft: "#EDE9FE",

        border: "#E2E8F0",
        inputBg: "#FFFFFF",
    },
};

export function statusStyle(status) {
    switch (String(status || "")) {
        case "CREATED":
            return { bg: theme.colors.warningSoft, fg: theme.colors.warning };
        case "CONFIRMED":
            return { bg: theme.colors.warningSoft, fg: theme.colors.warning };
        case "ASSIGNED_RIDER":
            return { bg: theme.colors.primarySoft, fg: theme.colors.primary };
        case "OUT_FOR_DELIVERY":
            return { bg: theme.colors.infoSoft, fg: theme.colors.info };
        case "DELIVERED":
            return { bg: theme.colors.successSoft, fg: theme.colors.success };
        default:
            return { bg: "#F1F5F9", fg: theme.colors.muted };
    }
}
