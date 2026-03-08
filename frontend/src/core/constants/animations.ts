/**
 * Animation presets for Sarak Engine
 * Focused on modularity and agnosticism
 */

export const ANIMATION_VARIANTS = {
    standard: {
        page: {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: { duration: 0.3, ease: "easeOut" }
        },
        card: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.3 }
        }
    },
    elastic: {
        page: {
            initial: { opacity: 0, x: -50, scale: 0.9 },
            animate: { opacity: 1, x: 0, scale: 1 },
            exit: { opacity: 0, x: 50, scale: 0.9 },
            transition: { type: "spring", stiffness: 400, damping: 20 }
        },
        card: {
            initial: { opacity: 0, y: 30, scale: 0.8 },
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: { type: "spring", stiffness: 500, damping: 25 }
        }
    },
    technical: {
        page: {
            initial: { opacity: 0, scale: 1.05 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
            transition: { duration: 0.15, ease: "linear" }
        },
        card: {
            initial: { borderRightWidth: 0, opacity: 0 },
            animate: { borderRightWidth: 1, opacity: 1 },
            transition: { duration: 0.2 }
        }
    },
    floating: {
        page: {
            initial: { opacity: 0, y: 40, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: -40, scale: 1.05 },
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        },
        card: {
            animate: {
                y: [0, -8, 0],
                transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }
        }
    }
};

export const EMOJI_SETS = {
    none: {}, // Uses original icons from sarak.config.jsx
    tech: {
        dashboard: "⚡",
        data: "📡",
        analysis: "🧠",
        audit: "🛡️",
        layout: "🎨",
        settings: "⚙️"
    },
    bio: {
        dashboard: "🌿",
        data: "🔬",
        analysis: "🧬",
        audit: "🌳",
        layout: "🌸",
        settings: "🍀"
    },
    luxury: {
        dashboard: "💎",
        data: "🏛️",
        analysis: "👑",
        audit: "🔒",
        layout: "🎩",
        settings: "🥂"
    },
    cosmic: {
        dashboard: "🪐",
        data: "☄️",
        analysis: "🔭",
        audit: "🌌",
        layout: "🚀",
        settings: "👽"
    }
};
