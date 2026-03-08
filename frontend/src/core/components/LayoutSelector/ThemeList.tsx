import React from 'react';
import { motion } from 'framer-motion';
import { Check, Settings2, Trash2 } from 'lucide-react';

export const ThemeCard = ({
    id,
    theme,
    isActive,
    isPreviewed,
    viewMode,
    onPreview,
    onApply,
    onEdit,
    onDelete
}: any) => {
    return (
        <div
            onClick={() => onPreview(id)}
            className={`group/item relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isActive
                ? 'border-theme-primary bg-theme-primary/10 shadow-lg shadow-theme-primary/20 scale-[1.01]'
                : isPreviewed
                    ? 'border-theme-primary/40 bg-theme-primary/5'
                    : 'border-theme-border/50 bg-theme-card/30 hover:border-theme-primary/20 hover:bg-theme-card'
                }`}
        >
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isPreviewed ? 'text-theme-primary' : 'text-theme-title'}`}>
                        {theme.name}
                    </span>
                    {isActive && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse" />
                            <span className="text-[7px] font-black text-theme-primary uppercase tracking-widest">In use</span>
                        </div>
                    )}
                </div>
                <span className="text-[7px] font-black uppercase opacity-60 mt-0.5">
                    {id.startsWith('custom-') ? 'Custom Preset' : 'Native Model'}
                </span>
            </div>

            <div className="flex gap-1.5 items-center">
                <button
                    onClick={(e) => { e.stopPropagation(); onApply(id); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isActive
                        ? 'bg-theme-primary text-white shadow-md'
                        : 'bg-theme-card/50 border border-theme-border/50 text-theme-muted hover:border-theme-primary/30 hover:text-theme-primary'
                        }`}
                >
                    <Check className={`w-3 h-3 ${isActive ? 'opacity-100' : 'opacity-30'}`} />
                    <span>{isActive ? 'Active' : 'Apply'}</span>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(id, theme); }}
                    className="w-7 h-7 rounded-lg border border-theme-border/50 bg-theme-card/50 text-theme-muted hover:border-theme-primary/30 hover:text-theme-primary transition-all flex items-center justify-center"
                    title="Settings"
                >
                    <Settings2 className="w-3.5 h-3.5" />
                </button>
                {id.startsWith('custom-') && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                        className="w-7 h-7 rounded-lg border border-theme-border/50 bg-theme-card/50 text-theme-muted hover:border-rose-500/30 hover:text-rose-500 transition-all flex items-center justify-center"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export const ThemeList = ({
    layouts,
    customThemes,
    currentLayout,
    previewLayoutId,
    viewMode,
    onPreview,
    onApply,
    onEdit,
    onDelete
}: any) => {
    return (
        <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-3" : "space-y-3"}>
            {Object.entries({ ...layouts, ...customThemes }).map(([id, theme]: any) => (
                <ThemeCard
                    key={id}
                    id={id}
                    theme={theme}
                    isActive={currentLayout === id}
                    isPreviewed={previewLayoutId === id}
                    viewMode={viewMode}
                    onPreview={onPreview}
                    onApply={onApply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};
