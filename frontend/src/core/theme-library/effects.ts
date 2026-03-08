export const THEME_EFFECTS = {
    page: {
        none: {
            name: 'None',
            description: 'No animations. Instant transitions.',
            page: { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } },
            card: { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
        },
        fade: {
            name: 'Smooth Fade',
            description: 'Classic opacity transition.',
            page: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.4 } },
            card: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: 0.1 } }
        },
        slideUp: {
            name: 'Slide Up',
            description: 'Elegant vertical movement from bottom to top.',
            page: { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.5 } },
            card: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 } }
        },
        slideLeft: {
            name: 'Slide Left',
            description: 'Dynamic lateral entry for linear flows.',
            page: { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 }, transition: { duration: 0.5 } },
            card: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5, delay: 0.15 } }
        },
        scale: {
            name: 'Zoom Bounce',
            description: 'Subtle zoom with premium elastic effect.',
            page: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.05 }, transition: { duration: 0.4 } },
            card: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.4, delay: 0.1 } }
        },
        blur: {
            name: 'Atmospheric',
            description: 'Gradual focus with depth of field blur.',
            page: { initial: { opacity: 0, filter: 'blur(10px)' }, animate: { opacity: 1, filter: 'blur(0px)' }, exit: { opacity: 0, filter: 'blur(10px)' }, transition: { duration: 0.6 } },
            card: { initial: { opacity: 0, filter: 'blur(4px)' }, animate: { opacity: 1, filter: 'blur(0px)' }, transition: { duration: 0.6, delay: 0.1 } }
        },
        perspective: {
            name: '3D Perspective',
            description: 'Total immersion with rotation and depth on the Z-axis.',
            page: { initial: { opacity: 0, rotateX: 20, scale: 0.9, y: 20 }, animate: { opacity: 1, rotateX: 0, scale: 1, y: 0 }, exit: { opacity: 0, rotateX: -20, scale: 1.1, y: -20 }, transition: { duration: 0.7 } },
            card: { initial: { opacity: 0, rotateX: 10, y: 10 }, animate: { opacity: 1, rotateX: 0, y: 0 }, transition: { duration: 0.7, delay: 0.2 } }
        },
        flip: {
            name: '3D Flip',
            description: 'Dynamic horizontal 90-degree rotation.',
            page: { initial: { opacity: 0, rotateY: 90 }, animate: { opacity: 1, rotateY: 0 }, exit: { opacity: 0, rotateY: -90 }, transition: { duration: 0.6 } },
            card: { initial: { opacity: 0, rotateY: 45 }, animate: { opacity: 1, rotateY: 0 }, transition: { duration: 0.6, delay: 0.1 } }
        },
        slideDown: {
            name: 'Slide Down',
            description: 'Smooth entry from the top.',
            page: { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 }, transition: { duration: 0.5 } },
            card: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.15 } }
        },
        elastic: {
            name: 'Elastic Tech',
            description: 'High-fidelity bounce movement.',
            page: { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.5 }, transition: { type: 'spring', damping: 12, stiffness: 100 } },
            card: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { type: 'spring', damping: 10, stiffness: 120, delay: 0.1 } }
        }
    },
    hover: {
        none: {},
        lift: { whileHover: { y: -5, scale: 1.02 }, whileTap: { scale: 0.98 } },
        glow: { whileHover: { boxShadow: "0 0 25px var(--primary-color)", scale: 1.05 } },
        glass: { whileHover: { backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" } },
        outline: { whileHover: { outline: "2px solid var(--primary-color)", outlineOffset: "4px" } }
    }
};

export const ANIMATION_VARIANTS = THEME_EFFECTS.page;
