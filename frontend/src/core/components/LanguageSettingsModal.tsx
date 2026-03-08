import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

import { ALL_LANGUAGES } from '../constants/engine';

const LanguageSettingsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { enabledLanguages, setEnabledLanguages } = useTheme();
    const [localLangs, setLocalLangs] = useState(enabledLanguages);
    const [expandedSlot, setExpandedSlot] = useState<number | null>(null);

    const handleAddSlot = () => {
        if (localLangs.length >= 8) return; // Reasonable limit
        setLocalLangs([...localLangs, 'en']);
    };

    const handleRemoveSlot = (index: number) => {
        if (localLangs.length <= 1) return; // At least one
        const next = [...localLangs];
        next.splice(index, 1);
        setLocalLangs(next);
        setExpandedSlot(null);
    };

    const handleSelectLang = (index: number, langId: string) => {
        const next = [...localLangs];
        next[index] = langId;
        setLocalLangs(next);
        setExpandedSlot(null);
    };

    const handleSave = () => {
        setEnabledLanguages(localLangs);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-theme-card border border-theme-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-theme-border flex items-center justify-between bg-theme-primary/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-theme-primary rounded-xl text-white shadow-lg">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-theme-title">Language Selection</h2>
                                    <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">Configure your shortcut slots</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-theme-primary/10 rounded-full text-theme-muted hover:text-theme-primary transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                            {localLangs.map((langId: string, index: number) => {
                                const current = ALL_LANGUAGES.find((l: any) => l.id === langId);
                                const isExpanded = expandedSlot === index;

                                return (
                                    <div key={`${index}-${langId}`} className="relative">
                                        <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${isExpanded ? 'border-theme-primary bg-theme-primary/5' : 'border-theme-border bg-theme-card/50'}`}>
                                            <button
                                                onClick={() => setExpandedSlot(isExpanded ? null : index)}
                                                className="flex-grow flex items-center gap-3 text-left"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-theme-body flex items-center justify-center text-[10px] font-black text-theme-primary border border-theme-border">
                                                    {current?.sigla}
                                                </div>
                                                <span className="text-xs font-bold text-theme-main">{current?.name}</span>
                                                <ChevronDown className={`w-4 h-4 ml-auto text-theme-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>

                                            <button
                                                onClick={() => handleRemoveSlot(index)}
                                                className="ml-4 p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                                title="Remove Slot"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden mt-2 grid grid-cols-2 gap-2 p-2 bg-theme-body/50 rounded-2xl border border-theme-border"
                                                >
                                                    {ALL_LANGUAGES.map((lang: any) => (
                                                        <button
                                                            key={lang.id}
                                                            onClick={() => handleSelectLang(index, lang.id)}
                                                            className={`flex items-center justify-between p-2.5 rounded-xl text-[10px] font-bold transition-all ${lang.id === langId ? 'bg-theme-primary text-white' : 'hover:bg-theme-primary/10 text-theme-muted'}`}
                                                        >
                                                            <span>{lang.name}</span>
                                                            {lang.id === langId && <Check className="w-3 h-3" />}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}

                            <button
                                onClick={handleAddSlot}
                                className="w-full p-4 rounded-2xl border-2 border-dashed border-theme-border text-theme-muted hover:border-theme-primary hover:text-theme-primary transition-all flex items-center justify-center gap-2 group"
                            >
                                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-black uppercase tracking-widest">Add Language</span>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-theme-border bg-theme-card">
                            <button
                                onClick={handleSave}
                                className="w-full py-4 rounded-2xl bg-theme-primary text-white font-black text-sm shadow-xl shadow-theme-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Save Configuration
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LanguageSettingsModal;
