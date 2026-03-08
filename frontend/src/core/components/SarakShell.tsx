import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, ChevronLeft, ChevronUp, Keyboard, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useShortcut } from '../hooks/useShortcut';
import ShortcutsModal from './ShortcutsModal';
import { ThemeToggle, UserMenu } from './Controls';
import LanguageSettingsModal from './LanguageSettingsModal';
import { ANIMATION_VARIANTS, EMOJI_SETS } from '../constants/animations';


interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface SarakConfig {
    branding: {
        name: string;
        version: string;
        logoPath?: string;
    };
    navigation: NavItem[];
}

interface SarakShellProps {
    config: SarakConfig;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    renderContent: (tab: string) => React.ReactNode;
    user: any;
    onLogout: () => void;
    onPasswordModal: () => void;
    moduleSelector?: React.ReactNode;
}

const SarakShell: React.FC<SarakShellProps> = ({
    config,
    activeTab,
    setActiveTab,
    renderContent,
    user,
    onLogout,
    onPasswordModal,
    moduleSelector = null
}) => {
    const {
        navigationStyle,
        sidebarWidth,
        setSidebarWidth,
        isNavHidden,
        toggleNav,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        shortcuts,
        animationStyle,
        emojiSet
    } = useTheme() as any; // Cast as any temporarily if theme context types are incomplete

    const variants = (ANIMATION_VARIANTS as any)[animationStyle] || ANIMATION_VARIANTS.standard;
    const currentEmojiSet = (EMOJI_SETS as any)[emojiSet] || {};

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const navItems = config.navigation;

    // -- CORE SHORTCUTS REGISTRATION --
    useShortcut({ id: 'ui:focusMode', name: "Hide/Show Navigation Bar", category: "View" }, () => toggleNav());
    useShortcut({ id: 'ui:openShortcuts', name: "Open Shortcut Center", category: "View" }, () => setIsShortcutsOpen((prev: boolean) => !prev));

    useShortcut({ id: 'nav:nextTab', name: "Go to Next Tab", category: "Navigation" }, () => {
        const currentIndex = navItems.findIndex(item => item.id === activeTab);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % navItems.length;
        setActiveTab(navItems[nextIndex].id);
    });

    useShortcut({ id: 'nav:prevTab', name: "Go to Previous Tab", category: "Navigation" }, () => {
        const currentIndex = navItems.findIndex(item => item.id === activeTab);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex - 1 + navItems.length) % navItems.length;
        setActiveTab(navItems[nextIndex].id);
    });

    // Alt + Number listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement as HTMLElement)?.tagName)) return;
            if (e.altKey && !e.ctrlKey && !e.shiftKey) {
                const keyNum = parseInt(e.key);
                if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= navItems.length) {
                    e.preventDefault();
                    setActiveTab(navItems[keyNum - 1].id);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navItems, setActiveTab]);

    const startResizing = (e: React.MouseEvent) => { e.preventDefault(); setIsResizing(true); };
    const stopResizing = () => setIsResizing(false);
    const resize = (e: MouseEvent) => {
        if (isResizing) {
            if (e.clientX >= 160 && e.clientX <= 480) setSidebarWidth(e.clientX);
        }
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => { window.removeEventListener('mousemove', resize); window.removeEventListener('mouseup', stopResizing); };
    }, [isResizing]);

    const isSidebar = navigationStyle === 'sidebar';

    return (
        <div className={`flex h-screen ${isSidebar ? 'flex-row' : 'flex-col'} bg-theme-body text-theme-main transition-colors duration-300`}>

            {/* Recovery Nav Button */}
            <AnimatePresence>
                {isNavHidden && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        onClick={toggleNav}
                        className={`fixed ${isSidebar ? 'left-4 top-1/2 -translate-y-1/2' : 'top-4 left-1/2 -translate-x-1/2'} z-50 p-3 bg-theme-card/80 backdrop-blur-xl border border-theme-primary/30 rounded-full text-theme-primary shadow-2xl hover:bg-theme-primary hover:text-white transition-all`}
                    >
                        {isSidebar ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* SIDEBAR */}
            <AnimatePresence mode="popLayout">
                {isSidebar && !isNavHidden && (
                    <motion.aside
                        initial={{ x: -sidebarWidth }} animate={{ x: 0 }} exit={{ x: -sidebarWidth }}
                        style={{ width: `${sidebarWidth}px` }}
                        className="shrink-0 flex flex-col bg-theme-sidebar border-r border-theme-border relative z-20"
                    >
                        <div onMouseDown={startResizing} className="absolute top-0 right-0 w-1 h-full cursor-col-resize z-30 hover:bg-theme-primary/40" />

                        {/* Logo area */}
                        <div className="px-5 py-5 border-b border-theme-border flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-theme-primary rounded-lg flex items-center justify-center shadow-lg">
                                    {config.navigation[0].icon}
                                </div>
                                <div>
                                    <div className="text-[11px] font-black text-theme-title uppercase tracking-widest">{config.branding.name}</div>
                                    <div className="text-[9px] text-theme-primary font-mono uppercase tracking-widest">{config.branding.version}</div>
                                </div>
                            </div>
                            <button onClick={toggleNav} className="p-1.5 rounded-lg text-theme-muted hover:bg-theme-primary/10 hover:text-theme-primary transition-all">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Nav Links */}
                        <nav className="flex-grow py-4 px-3 overflow-y-auto space-y-1 custom-scrollbar">
                            {navItems.map((item, idx) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${activeTab === item.id ? 'bg-theme-primary text-white shadow-lg' : 'text-theme-muted hover:text-theme-title hover:bg-theme-primary/5'}`}
                                >
                                    <div className="shrink-0 text-lg">
                                        {(currentEmojiSet as any)[item.id] || item.icon}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                                    <div className="ml-auto text-[10px] font-mono opacity-20 group-hover:opacity-40 transition-opacity">ALT+{idx + 1}</div>
                                </button>
                            ))}
                        </nav>

                        {/* Footer / User */}
                        <div className="p-4 border-t border-theme-border space-y-4">
                            {moduleSelector}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <ThemeToggle />
                                    <UserMenu
                                        user={user}
                                        onPasswordModal={onPasswordModal}
                                        onLogout={onLogout}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* TOPBAR (Horizontal Layout) */}
            {!isSidebar && (
                <div className="p-4 bg-theme-sidebar border-b border-theme-border flex items-center justify-between sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="font-black text-theme-title tracking-widest uppercase text-xs">{config.branding.name}</div>
                        <div className="hidden md:block">
                            {moduleSelector}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 mr-4">
                            {navItems.map(item => (
                                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center ${activeTab === item.id ? 'text-theme-primary bg-theme-primary/10' : 'text-theme-muted hover:text-theme-title hover:bg-black/5'}`}>
                                    {(currentEmojiSet as any)[item.id] || item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <div className="h-4 w-px bg-theme-border mx-2"></div>

                        <ThemeToggle />
                        <UserMenu
                            user={user}
                            onPasswordModal={onPasswordModal}
                            onLogout={onLogout}
                        />
                    </div>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <main className="flex-grow relative overflow-hidden flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={variants.page.initial}
                        animate={variants.page.animate}
                        exit={variants.page.exit}
                        transition={variants.page.transition}
                        className={`absolute inset-0 overflow-y-auto custom-scrollbar ${activeTab === 'theme' ? '' : 'p-6 lg:p-10'
                            }`}
                    >
                        {renderContent(activeTab)}
                    </motion.div>
                </AnimatePresence>
            </main>

            <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
            <LanguageSettingsModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />
        </div>

    );
};

export default SarakShell;
