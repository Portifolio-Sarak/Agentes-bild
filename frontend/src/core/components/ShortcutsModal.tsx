import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, ArrowLeftRight, Monitor, Edit3, Check, RotateCcw, Database, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Kbd = ({ children, isEditing = false }: { children: React.ReactNode, isEditing?: boolean }) => (
    <kbd className={`px-2 py-1 bg-theme-body text-[10px] font-black font-mono rounded border shadow-sm uppercase tracking-widest inline-flex items-center justify-center min-w-[24px] ${isEditing ? 'border-theme-primary text-theme-primary animate-pulse' : 'border-theme-border/50 text-theme-title'}`}>
        {children}
    </kbd>
);

const formatKeyName = (key: string) => {
    if (key === ' ') return 'Space';
    if (key === 'Control') return 'Ctrl';
    return key.charAt(0).toUpperCase() + key.slice(1);
};

interface ShortcutType {
    id: string;
    keys: string[];
    description: string;
    category: string;
    isDefault?: boolean;
    isCustom?: boolean;
}

const ShortcutsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { shortcuts, updateShortcut, defaultShortcuts, registeredActions, createShortcut, deleteShortcut } = useTheme();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempKeys, setTempKeys] = useState<string[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedActionId, setSelectedActionId] = useState("");
    const [domActions, setDomActions] = useState<any>({});

    useEffect(() => {
        if (isOpen) {
            const elements = document.querySelectorAll('[data-action-id]');
            const found: any = {};
            elements.forEach(el => {
                const id = el.getAttribute('data-action-id');
                if (id) {
                    found[id] = { id, name: el.getAttribute('data-action-name') || id, category: el.getAttribute('data-action-category') || 'Interface', isDom: true };
                }
            });
            setDomActions(found);
        }
    }, [isOpen]);

    const allAvailableActions: any = { ...registeredActions, ...domActions };
    const groupedShortcuts = Object.values(shortcuts as Record<string, ShortcutType>).reduce((acc: any, s: ShortcutType) => {
        (acc[s.category] = acc[s.category] || []).push(s);
        return acc;
    }, {});
    const availableActions = Object.values(allAvailableActions).filter((a: any) => !shortcuts[a.id]);

    const categoryIcons: any = {
        "Navigation": <ArrowLeftRight className="w-4 h-4" />,
        "View": <Monitor className="w-4 h-4" />,
        "Data": <Database className="w-4 h-4" />
    };

    const startEditing = (id: string) => {
        setEditingId(id);
        setTempKeys([]);
        const activeEl = document.activeElement as HTMLElement;
        if (activeEl && typeof activeEl.blur === 'function') activeEl.blur();
    };
    const cancelEditing = () => { setEditingId(null); setTempKeys([]); setIsCreating(false); setSelectedActionId(""); };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;
        if (!editingId) { if (e.key === 'Escape') onClose(); return; }
        e.preventDefault(); e.stopPropagation();
        if (e.key === 'Escape') { cancelEditing(); return; }
        const newKeys: string[] = [];
        if (e.ctrlKey) newKeys.push('Control'); if (e.shiftKey) newKeys.push('Shift');
        if (e.altKey) newKeys.push('Alt'); if (e.metaKey) newKeys.push('Meta');
        const isModifier = ['Control', 'Shift', 'Alt', 'Meta'].includes(e.key);
        if (!isModifier) newKeys.push(e.key);
        setTempKeys(newKeys);
        if (!isModifier) {
            if (editingId === 'new' && selectedActionId) { createShortcut(selectedActionId, newKeys, allAvailableActions[selectedActionId]); setIsCreating(false); setSelectedActionId(""); }
            else if (editingId !== 'new') updateShortcut(editingId, newKeys);
            setEditingId(null); setTempKeys([]);
        }
    }, [isOpen, editingId, onClose, updateShortcut, createShortcut, selectedActionId, allAvailableActions]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, [handleKeyDown]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md" />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-2xl">
                        <div className="bg-theme-card border border-theme-border/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
                            <div className="p-6 border-b border-theme-border/50 bg-theme-card/80 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-theme-primary/10 flex items-center justify-center text-theme-primary"><Keyboard className="w-5 h-5" /></div>
                                    <div>
                                        <h2 className="text-lg font-black text-theme-title tracking-wide">Shortcuts Center</h2>
                                        <p className="text-[11px] font-bold text-theme-muted uppercase tracking-widest">Actions ({Object.keys(shortcuts).length})</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isCreating && availableActions.length > 0 && (
                                        <button onClick={() => setIsCreating(true)} className="px-3 py-1.5 rounded-lg bg-theme-primary/10 text-theme-primary hover:bg-theme-primary hover:text-white transition-colors flex items-center gap-2 text-[12px] font-bold tracking-widest uppercase"><Plus className="w-3.5 h-3.5" />New</button>
                                    )}
                                    <button onClick={onClose} className="p-2 rounded-lg text-theme-muted hover:text-white hover:bg-theme-primary/80 transition-all"><X className="w-5 h-5" /></button>
                                </div>
                            </div>
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow bg-theme-body/20 space-y-8">
                                {isCreating && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border border-theme-primary/30 bg-theme-primary/5 rounded-xl p-4">
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-theme-primary mb-3">Creation Assistant</h3>
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <select value={selectedActionId} onChange={(e) => { setSelectedActionId(e.target.value); if (e.target.value) startEditing('new'); else cancelEditing(); }} className="w-full sm:w-1/2 p-2.5 rounded-lg border border-theme-border bg-theme-body text-theme-main text-sm focus:border-theme-primary outline-none">
                                                <option value="">1. Select action...</option>
                                                {availableActions.map((a: any) => <option key={a.id} value={a.id}>{a.description || a.name}</option>)}
                                            </select>
                                            {selectedActionId && (
                                                <div className="flex items-center gap-3 bg-theme-body/50 px-3 py-2 rounded-lg border border-theme-primary/20">
                                                    <span className="text-[12px] text-theme-muted">2. Press the key:</span>
                                                    <div className="flex items-center gap-1.5">{tempKeys.length > 0 ? tempKeys.map((k, i) => <React.Fragment key={i}><Kbd isEditing={true}>{formatKeyName(k)}</Kbd>{i < tempKeys.length - 1 && <span>+</span>}</React.Fragment>) : <Kbd isEditing={true}>...</Kbd>}</div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                                {Object.entries(groupedShortcuts as Record<string, ShortcutType[]>).map(([cat, items]) => (
                                    <div key={cat}>
                                        <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-theme-primary mb-4">{categoryIcons[cat] || <Keyboard className="w-4 h-4" />}{cat}</h3>
                                        <div className="space-y-2">
                                            {items.map((s: ShortcutType) => {
                                                const isEd = editingId === s.id;
                                                const keys = isEd ? (tempKeys.length > 0 ? [...tempKeys, '...'] : ['WAITING...']) : s.keys;
                                                const isModified = s.keys.join('+') !== (defaultShortcuts[s.id]?.keys.join('+') || '');
                                                return (
                                                    <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl transition-all border ${isEd ? 'bg-theme-primary/5 border-theme-primary/30 ring-1 ring-theme-primary' : 'hover:bg-theme-card/50 border-transparent hover:border-theme-border/30 group'}`}>
                                                        <span className={`text-[13px] font-medium ${isEd ? 'text-theme-primary' : 'text-theme-main group-hover:text-theme-title'}`}>{s.description}</span>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1.5">{keys.map((k: string, i: number) => <React.Fragment key={i}><Kbd isEditing={isEd}>{formatKeyName(k)}</Kbd>{i < keys.length - 1 && <span className="text-theme-muted/50">+</span>}</React.Fragment>)}</div>
                                                            <div className={`flex items-center gap-1 ${!isEd ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''}`}>
                                                                {isEd ? <button onClick={cancelEditing} className="p-1.5 rounded-md text-rose-500 hover:bg-rose-500/10"><X className="w-4 h-4" /></button> : (
                                                                    <>
                                                                        {s.isCustom ? <button onClick={() => deleteShortcut(s.id)} className="p-1.5 rounded-md text-red-500 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button> : (
                                                                            isModified && <button onClick={() => updateShortcut(s.id, defaultShortcuts[s.id].keys)} className="p-1.5 rounded-md text-amber-500 hover:bg-amber-500/10"><RotateCcw className="w-3.5 h-3.5" /></button>
                                                                        )}
                                                                        <button onClick={() => startEditing(s.id)} className="p-1.5 rounded-md text-theme-muted hover:text-theme-primary hover:bg-theme-primary/10"><Edit3 className="w-3.5 h-3.5" /></button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-theme-border/50 bg-theme-card text-center text-[10px] font-black uppercase text-theme-muted tracking-widest">Press <Kbd>Esc</Kbd> to close</div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShortcutsModal;
