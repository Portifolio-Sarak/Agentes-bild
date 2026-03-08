import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, User, ChevronDown, KeyRound, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ALL_LANGUAGES } from '../constants/engine';

export const LanguageSelector = () => {
    const { enabledLanguages } = useTheme();
    const [current, setCurrent] = React.useState(localStorage.getItem('sarak_lang') || 'pt');

    const handleLangChange = (lang: string) => {
        if (lang === current) return;
        localStorage.setItem('sarak_lang', lang);
        setCurrent(lang);

        // Directly swap the Google Translate cookie
        const value = lang === 'pt' ? '' : `/pt/${lang}`;
        document.cookie = `googtrans=${value}; path=/`;
        document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;

        // Small exit animation and reload
        document.body.style.opacity = '0.5';
        document.body.style.transition = 'opacity 0.3s ease';
        setTimeout(() => window.location.reload(), 300);
    };

    // Filter enabled languages
    const activeLangs = (enabledLanguages || ['pt', 'en', 'es'])
        .map((id: string) => ALL_LANGUAGES.find((l: any) => l.id === id))
        .filter(Boolean) as any[];

    return (
        <div className="flex items-center gap-1 bg-theme-card border border-theme-border rounded-xl px-2 py-1">
            {activeLangs.map(l => (
                <button
                    key={l.id}
                    onClick={() => handleLangChange(l.id)}
                    className={`px-1.5 py-1 text-[10px] font-bold transition-all hover:text-theme-primary ${current === l.id ? 'text-theme-primary' : 'text-theme-muted'
                        }`}
                >
                    {l.label}
                </button>
            ))}
        </div>
    );
};

export const ThemeToggle = () => {
    const { mode, toggleMode } = useTheme();
    return (
        <div className="flex items-center gap-2">
            <LanguageSelector />
            <button
                onClick={toggleMode}
                data-action-id="ui:theme_toggle_btn"
                data-action-name="Toggle Brightness (Bar)"
                data-action-category="Interface"
                className="p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-muted hover:text-theme-primary transition-all group overflow-hidden relative"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={mode}
                        initial={{ y: 20, opacity: 0, rotate: -45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.2, ease: "backOut" }}
                    >
                        {mode === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </motion.div>
                </AnimatePresence>
            </button>
        </div>
    );
};

export const UserMenu = ({ user, onPasswordModal, onLogout }: { user: any, onPasswordModal: () => void, onLogout: () => void }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-theme-primary/5 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-theme-body border border-theme-border flex items-center justify-center text-theme-muted group-hover:text-theme-primary transition-all">
                    <User className="w-4 h-4" />
                </div>
                <ChevronDown className={`w-3 h-3 text-theme-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute right-0 bottom-full mb-2 w-48 bg-theme-card border border-theme-border rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-1">
                                <button onClick={() => { setIsOpen(false); onPasswordModal(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-theme-main hover:bg-theme-primary/10 rounded-lg transition-colors text-left">
                                    <KeyRound className="w-4 h-4 opacity-50" />
                                    <span>Change Password</span>
                                </button>
                                <div className="h-px bg-theme-border my-1"></div>
                                <button onClick={() => { setIsOpen(false); onLogout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors text-left font-bold">
                                    <LogOut className="w-4 h-4" />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export const ModuleSelector = ({ currentModule, setCurrentModule, modules = [] }: { currentModule: string, setCurrentModule: (id: string) => void, modules: any[] }) => (
    <div className="flex items-center bg-theme-body/50 p-1 rounded-xl border border-theme-border">
        {modules.map((mod: any) => (
            <button
                key={mod.id}
                onClick={() => setCurrentModule(mod.id)}
                className={`flex-grow px-3 py-1.5 rounded-lg text-[9px] font-black transition-all duration-300 uppercase tracking-widest ${currentModule === mod.id
                    ? "bg-theme-primary text-white shadow-lg"
                    : "text-theme-muted hover:text-theme-title hover:bg-theme-primary/5"
                    }`}
            >
                {mod.label}
            </button>
        ))}
    </div>
);


