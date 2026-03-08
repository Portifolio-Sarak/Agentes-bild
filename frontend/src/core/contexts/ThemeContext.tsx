import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BASE_PRESETS } from '../theme-library';

export const LAYOUTS = {
    GLASS: { id: 'glass', name: 'Modern Glass', class: 'layout-glass', animation: 'perspective', emoji: 'none' },
    CORPORATE: { id: 'corporate', name: 'Solid Corporate', class: 'layout-corporate', animation: 'fade', emoji: 'none' },
    MINIMAL: { id: 'minimal', name: 'Minimal Clean', class: 'layout-minimal', animation: 'slideUp', emoji: 'minimal' },
    TECHNICAL: { id: 'technical', name: 'Technical Analytics', class: 'layout-main', animation: 'none', emoji: 'cyber' },
    PRESTIGE: { id: 'prestige', name: 'Prestige Editorial', class: 'layout-prestige', animation: 'blur', emoji: 'minimal' },
    ATMOSPHERIC: { id: 'atmospheric', name: 'Deep Atmospheric', class: 'layout-atmospheric', animation: 'perspective', emoji: 'cosmic' },
    // NEW MASTER THEMES (V7.0)
    NEON_CIRCUIT: { id: 'neon_circuit', name: 'Neon Circuit', class: 'layout-main', animation: 'flip', emoji: 'cyber' },
    ZEN_PARCHMENT: { id: 'zen_parchment', name: 'Zen Parchment', class: 'layout-prestige', animation: 'blur', emoji: 'minimal' },
    FINANCE_PRO: { id: 'finance_pro', name: 'Finance Pro', class: 'layout-corporate', animation: 'slideDown', emoji: 'finance' },
    GAMER_ELITE: { id: 'gamer_elite', name: 'Gamer Elite', class: 'layout-atmospheric', animation: 'flip', emoji: 'gamer' },
    AI_NEURAL: { id: 'ai_neural', name: 'AI Neural Flux', class: 'layout-glass', animation: 'reveal', emoji: 'intelligence' },
    EDITORIAL: { id: 'editorial', name: 'Editorial Luxury', class: 'layout-prestige', animation: 'blur', emoji: 'none' },
    TERMINAL: { id: 'terminal', name: 'Terminal Retro', class: 'layout-main', animation: 'slideUp', emoji: 'cyber' },
    // NEW REQUESTED THEMES
    MAIN: { id: 'main', name: 'Main (Classic)', class: 'layout-main', animation: 'none', emoji: 'cyber' },
    CYBERPUNK: { id: 'cyberpunk', name: 'Cyberpunk', class: 'layout-main', animation: 'flip', emoji: 'cyber' },
    FORMAL_1: { id: 'formal_1', name: 'Formal Sólido', class: 'layout-corporate', animation: 'fade', emoji: 'none' },
    FORMAL_2: { id: 'formal_2', name: 'Formal Moderno', class: 'layout-corporate', animation: 'slideUp', emoji: 'none' },
    FORMAL_3: { id: 'formal_3', name: 'Formal Executivo', class: 'layout-corporate', animation: 'fade', emoji: 'none' },
    MAC: { id: 'mac', name: 'Apple macOS', class: 'layout-glass', animation: 'perspective', emoji: 'none' },
};
// Preset configurations moved to '../theme-library/presets.js'

interface ThemeContextType {
    layout: string;
    setLayout: (layout: string) => void;
    mode: string;
    setMode: (mode: string) => void;
    toggleMode: () => void;
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    navigationStyle: string;
    setNavigationStyle: (style: string) => void;
    customThemes: any;
    saveCustomTheme: (id: string, name: string, config: any, extra?: any) => void;
    deleteCustomTheme: (id: string) => void;
    layouts: typeof LAYOUTS;
    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
    fontScale: string;
    setFontScale: (scale: string) => void;
    isNavHidden: boolean;
    setIsNavHidden: (hidden: boolean) => void;
    toggleNav: () => void;
    isShortcutsOpen: boolean;
    setIsShortcutsOpen: (open: boolean) => void;
    isLanguageModalOpen: boolean;
    setIsLanguageModalOpen: (open: boolean) => void;
    enabledLanguages: string[];
    setEnabledLanguages: (langs: string[]) => void;
    shortcuts: any;
    defaultShortcuts: any;
    registeredActions: any;
    registerAction: (info: any) => void;
    unregisterAction: (id: string) => void;
    updateShortcut: (id: string, keys: string[]) => void;
    createShortcut: (id: string, keys: string[], info: any) => void;
    deleteShortcut: (id: string) => void;
    animationStyle: string;
    setAnimationStyle: (style: string) => void;
    emojiSet: string;
    setEmojiSet: (set: string) => void;
    layoutDensity: string;
    setLayoutDensity: (density: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [layout, setLayout] = useState<string>(() => localStorage.getItem('sarak_layout') || 'glass');
    const [mode, setMode] = useState<string>(() => localStorage.getItem('sarak_mode') || 'dark');
    const [primaryColor, setPrimaryColor] = useState<string>(() => localStorage.getItem('sarak_primary_color') || '#3b82f6');
    const [customThemes, setCustomThemes] = useState<any>(() => {
        const saved = localStorage.getItem('sarak_custom_themes');
        return saved ? JSON.parse(saved) : {};
    });
    const [navigationStyle, setNavigationStyle] = useState<string>(() => localStorage.getItem('sarak_nav_style') || 'sidebar');
    const [sidebarWidth, setSidebarWidth] = useState<number>(() => parseInt(localStorage.getItem('sarak_sidebar_width') || '260'));
    const [fontScale, setFontScale] = useState<string>(() => localStorage.getItem('sarak_font_scale') || 'm');
    const [isNavHidden, setIsNavHidden] = useState<boolean>(() => localStorage.getItem('sarak_nav_hidden') === 'true');
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [enabledLanguages, setEnabledLanguages] = useState<string[]>(() => {
        const saved = localStorage.getItem('sarak_enabled_langs');
        return saved ? JSON.parse(saved) : ['pt', 'en', 'es'];
    });

    const [animationStyle, setAnimationStyle] = useState<string>(() => localStorage.getItem('sarak_animation_style') || 'standard');
    const [emojiSet, setEmojiSet] = useState<string>(() => localStorage.getItem('sarak_emoji_set') || 'none');
    const [layoutDensity, setLayoutDensity] = useState<string>(() => localStorage.getItem('sarak_layout_density') || 'standard');

    // Event Bus state
    const [registeredActions, setRegisteredActions] = useState<any>({});
    const defaultShortcuts: any = {
        'nav:prevTab': { id: 'nav:prevTab', keys: ['Shift', 'ArrowLeft'], description: "Previous Tab", category: "Navigation", isDefault: true },
        'nav:nextTab': { id: 'nav:nextTab', keys: ['Shift', 'ArrowRight'], description: "Next Tab", category: "Navigation", isDefault: true },
        'ui:focusMode': { id: 'ui:focusMode', keys: ['Control', 'b'], description: "Focus Mode (Hide Sidebar)", category: "Interface", isDefault: true },
        'ui:toggleTheme': { id: 'ui:toggleTheme', keys: ['Control', 'Shift', 'L'], description: "Toggle Light/Dark Theme", category: "Interface", isDefault: true },
        'ui:openShortcuts': { id: 'ui:openShortcuts', keys: ['Control', '/'], description: "Open Shortcut Center", category: "Interface", isDefault: true }
    };

    const [shortcuts, setShortcuts] = useState<any>(() => {
        const saved = localStorage.getItem('sarak_shortcuts_v3');
        return saved ? JSON.parse(saved) : defaultShortcuts;
    });

    const registerAction = useCallback((info: any) => setRegisteredActions((p: any) => ({ ...p, [info.id]: info })), []);
    const unregisterAction = useCallback((id: string) => setRegisteredActions((p: any) => { const n = { ...p }; delete n[id]; return n; }), []);
    const createShortcut = (id: string, keys: string[], info: any) => {
        setShortcuts((p: any) => {
            const up = { ...p, [id]: { id, keys, description: info.description, category: info.category, isCustom: true } };
            localStorage.setItem('sarak_shortcuts_v3', JSON.stringify(up));
            return up;
        });
    };
    const updateShortcut = (id: string, keys: string[]) => {
        setShortcuts((p: any) => {
            const up = { ...p, [id]: { ...p[id], keys } };
            localStorage.setItem('sarak_shortcuts_v3', JSON.stringify(up));
            return up;
        });
    };
    const deleteShortcut = (id: string) => {
        setShortcuts((p: any) => {
            if (p[id]?.isDefault) return p;
            const up = { ...p }; delete up[id];
            localStorage.setItem('sarak_shortcuts_v3', JSON.stringify(up));
            return up;
        });
    };

    // Sync animation and emoji patterns when layout changes
    useEffect(() => {
        if (layout.startsWith('custom-') && customThemes[layout]) {
            if (customThemes[layout].animationStyle) setAnimationStyle(customThemes[layout].animationStyle);
            if (customThemes[layout].emojiSet) setEmojiSet(customThemes[layout].emojiSet);
        } else {
            const native = Object.values(LAYOUTS).find(l => l.id === layout);
            if (native) {
                setAnimationStyle(native.animation);
                setEmojiSet(native.emoji);
            }
        }
    }, [layout, customThemes]);

    // Apply visual configurations and persist state
    useEffect(() => {
        document.body.className = '';
        document.body.classList.add(`layout-${layout}`, mode, `nav-${navigationStyle}`);

        const textureClasses = Array.from(document.body.classList).filter(c => c.startsWith('texture-'));
        document.body.classList.remove(...textureClasses);

        // Determine texture: Priority Custom -> Preset -> Native Default
        let texture = 'none';
        if (layout.startsWith('custom-')) {
            texture = customThemes[layout]?.config?.['--bg-texture'];
        } else if ((BASE_PRESETS as any)[layout.toLowerCase()]) {
            texture = (BASE_PRESETS as any)[layout.toLowerCase()]['--bg-texture'];
        }

        if (texture && texture !== 'none') document.body.classList.add(`texture-${texture}`);

        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
        const scaleMap: any = { p1: '0.8', p: '0.9', m: '1.0', g: '1.2', g1: '1.4' };
        document.documentElement.style.setProperty('--font-size-factor', scaleMap[fontScale] || '1.0');

        // Apply CSS variables (Priority Custom -> Preset)
        if (layout.startsWith('custom-') && customThemes[layout]) {
            Object.entries(customThemes[layout].config).forEach(([k, v]) => document.documentElement.style.setProperty(k, v as string));
        } else if ((BASE_PRESETS as any)[layout.toLowerCase()]) {
            Object.entries((BASE_PRESETS as any)[layout.toLowerCase()]).forEach(([k, v]) => document.documentElement.style.setProperty(k, v as string));
        }

        // Apply Density Overrides
        const densitySettings: any = {
            compact: { gap: '0.75rem', pad: '0.75rem', radius: '8px' },
            standard: { gap: '1.5rem', pad: '1.5rem', radius: '12px' },
            comfortable: { gap: '2rem', pad: '2rem', radius: '20px' }
        };
        const activeDensity = densitySettings[layoutDensity] || densitySettings.standard;
        document.documentElement.style.setProperty('--theme-gap', activeDensity.gap);
        document.documentElement.style.setProperty('--theme-padding', activeDensity.pad);
        document.documentElement.style.setProperty('--radius-theme', activeDensity.radius);

        localStorage.setItem('sarak_layout', layout);
        localStorage.setItem('sarak_mode', mode);
        localStorage.setItem('sarak_primary_color', primaryColor);
        localStorage.setItem('sarak_nav_style', navigationStyle);
        localStorage.setItem('sarak_sidebar_width', sidebarWidth.toString());
        localStorage.setItem('sarak_font_scale', fontScale);
        localStorage.setItem('sarak_nav_hidden', isNavHidden.toString());
        localStorage.setItem('sarak_enabled_langs', JSON.stringify(enabledLanguages));
        localStorage.setItem('sarak_animation_style', animationStyle);
        localStorage.setItem('sarak_emoji_set', emojiSet);
        localStorage.setItem('sarak_layout_density', layoutDensity);
    }, [layout, mode, primaryColor, navigationStyle, customThemes, sidebarWidth, fontScale, isNavHidden, enabledLanguages, animationStyle, emojiSet, layoutDensity]);

    const saveCustomTheme = (id: string, name: string, config: any, extra: any = {}) => {
        const nt = {
            ...customThemes,
            [`custom-${id}`]: {
                name,
                config,
                animationStyle: extra.animationStyle || animationStyle,
                emojiSet: extra.emojiSet || emojiSet
            }
        };
        setCustomThemes(nt); localStorage.setItem('sarak_custom_themes', JSON.stringify(nt));
        setLayout(`custom-${id}`);
    };

    const deleteCustomTheme = (id: string) => {
        const nt = { ...customThemes }; delete nt[id];
        setCustomThemes(nt); localStorage.setItem('sarak_custom_themes', JSON.stringify(nt));
        if (layout === id) setLayout('glass');
    };

    const toggleMode = () => setMode(p => p === 'light' ? 'dark' : 'light');
    const toggleNav = () => setIsNavHidden(p => !p);

    return (
        <ThemeContext.Provider value={{
            layout, setLayout, mode, setMode, toggleMode, primaryColor, setPrimaryColor,
            navigationStyle, setNavigationStyle, customThemes, saveCustomTheme, deleteCustomTheme,
            layouts: LAYOUTS, sidebarWidth, setSidebarWidth, fontScale, setFontScale,
            isNavHidden, setIsNavHidden, toggleNav, isShortcutsOpen, setIsShortcutsOpen,
            isLanguageModalOpen, setIsLanguageModalOpen, enabledLanguages, setEnabledLanguages,
            shortcuts, defaultShortcuts, registeredActions, registerAction, unregisterAction,
            updateShortcut, createShortcut, deleteShortcut,
            animationStyle, setAnimationStyle, emojiSet, setEmojiSet,
            layoutDensity, setLayoutDensity
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
