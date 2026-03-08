import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronUp, ChevronDown, Check, Palette, Grid, Type, Layers, Box, Film, Smile
} from 'lucide-react';
import { THEME_FONTS, TEXTURE_LIBRARY, ICON_PACKS, EMOJI_SETS, THEME_EFFECTS } from '../../theme-library';

export const ConfigSection = ({ id, icon: Icon, title, isOpen, onToggle, children }: any) => {
    return (
        <div className="border-b border-theme-border/50 flex flex-col last:border-0">
            <button
                onClick={() => onToggle(id)}
                className={`flex items-center justify-between p-4 transition-all group ${isOpen ? 'bg-theme-primary/5' : 'hover:bg-theme-primary/5'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-theme-primary text-white' : 'bg-theme-card text-theme-muted group-hover:text-theme-primary border border-theme-border'}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isOpen ? 'text-theme-title' : 'text-theme-muted group-hover:text-theme-title'}`}>
                        {title}
                    </span>
                </div>
                {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-theme-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-theme-muted" />}
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-2 space-y-6">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const ThemeEditor = ({
    config,
    onConfigChange,
    previewAnimationStyle,
    setPreviewAnimationStyle,
    previewEmojiSet,
    setPreviewEmojiSet,
    openSections,
    onToggleSection,
    primaryColors,
    previewPrimaryColor,
    setPreviewPrimaryColor,
    previewFontScale,
    setPreviewFontScale
}: any) => {
    return (
        <div className="flex-grow overflow-y-auto custom-scrollbar border-t border-theme-border/50 bg-black/5">
            {/* Section: Colors & Identity */}
            <ConfigSection
                id="colors"
                icon={Palette}
                title="Colors & Identity"
                isOpen={openSections.includes('colors')}
                onToggle={onToggleSection}
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">Accent Color</span>
                        <div className="relative">
                            <input
                                type="color"
                                value={previewPrimaryColor}
                                onChange={(e) => setPreviewPrimaryColor(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-6 h-6 rounded-full border border-theme-border/50" style={{ backgroundColor: previewPrimaryColor }}></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {primaryColors.map((color: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setPreviewPrimaryColor(color.value)}
                                className={`w-full aspect-square rounded-full transition-all hover:scale-110 ${previewPrimaryColor === color.value ? 'ring-2 ring-theme-primary ring-offset-2 ring-offset-theme-card' : 'opacity-80'}`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
            </ConfigSection>

            {/* Section: Geometry */}
            <ConfigSection
                id="geo"
                icon={Grid}
                title="Geometry & Spacing"
                isOpen={openSections.includes('geo')}
                onToggle={onToggleSection}
            >
                <div className="space-y-6">
                    {/* Radius Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-theme-muted">Corner Radius</span>
                            <span className="text-theme-primary font-mono">{config['--radius-theme']}</span>
                        </div>
                        <input
                            type="range" min="0" max="32" step="1"
                            value={parseInt(config['--radius-theme'])}
                            onChange={(e) => onConfigChange('--radius-theme', `${e.target.value}px`)}
                            className="w-full accent-theme-primary"
                        />
                    </div>
                    {/* Gap Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-theme-muted">Spacing (Gap)</span>
                            <span className="text-theme-primary font-mono">{config['--theme-gap']}</span>
                        </div>
                        <input
                            type="range" min="0" max="48" step="4"
                            value={parseInt(config['--theme-gap'])}
                            onChange={(e) => onConfigChange('--theme-gap', `${e.target.value}px`)}
                            className="w-full accent-theme-primary"
                        />
                    </div>
                </div>
            </ConfigSection>

            {/* Section: Typography */}
            <ConfigSection
                id="fonts"
                icon={Type}
                title="Premium Typography"
                isOpen={openSections.includes('fonts')}
                onToggle={onToggleSection}
            >
                <div className="space-y-6">
                    {/* Controle de Escala da Fonte */}
                    <div>
                        <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block mb-3">Font Size (Global)</span>
                        <div className="flex bg-theme-body/50 p-1 rounded-xl border border-theme-border/50">
                            {['p1', 'p', 'm', 'g', 'g1'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setPreviewFontScale(size)}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${previewFontScale === size
                                        ? 'bg-theme-primary text-white shadow-md'
                                        : 'text-theme-muted hover:text-theme-title'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block mb-3">Heading Font</span>
                        <div className="grid grid-cols-1 gap-2">
                            {THEME_FONTS.filter(f => f.category === 'display' || f.category === 'serif' || f.category === 'sans').slice(0, 8).map(font => (
                                <button
                                    key={font.id}
                                    onClick={() => onConfigChange('--font-heading', font.value)}
                                    className={`p-3 rounded-xl border text-left transition-all ${config['--font-heading'] === font.value ? 'border-theme-primary bg-theme-primary/10' : 'border-theme-border/50 hover:bg-theme-card'}`}
                                >
                                    <div style={{ fontFamily: font.value }} className="text-sm font-bold text-theme-title">{font.name}</div>
                                    <div className="text-[9px] text-theme-muted opacity-60 uppercase mt-1">{font.category}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </ConfigSection>

            {/* Section: Materials */}
            <ConfigSection
                id="textures"
                icon={Layers}
                title="Textures & Materials"
                isOpen={openSections.includes('textures')}
                onToggle={onToggleSection}
            >
                <div className="grid grid-cols-2 gap-3">
                    {TEXTURE_LIBRARY.map(tex => (
                        <button
                            key={tex.id}
                            onClick={() => onConfigChange('--bg-texture', tex.id)}
                            className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${config['--bg-texture'] === tex.id ? 'border-theme-primary bg-theme-primary/10' : 'border-theme-border/50 hover:bg-theme-card'}`}
                        >
                            <span className="text-[10px] font-bold text-theme-title uppercase">{tex.name}</span>
                            <span className="text-[8px] text-theme-muted leading-tight">{tex.description}</span>
                        </button>
                    ))}
                </div>
            </ConfigSection>

            {/* Section: Effects */}
            <ConfigSection
                id="fx"
                icon={Film}
                title="Cinematic Effects"
                isOpen={openSections.includes('fx')}
                onToggle={onToggleSection}
            >
                <div className="space-y-3">
                    {Object.entries(THEME_EFFECTS.page).map(([id, effect]) => (
                        <button
                            key={id}
                            onClick={() => setPreviewAnimationStyle(id)}
                            className={`w-full p-4 rounded-xl border text-left transition-all ${previewAnimationStyle === id ? 'border-theme-primary bg-theme-primary/10' : 'border-theme-border/50 hover:bg-theme-card'}`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-theme-title">{effect.name || id}</span>
                            </div>
                            <p className="text-[9px] text-theme-muted leading-relaxed">{effect.description || 'Page transition effect'}</p>
                        </button>
                    ))}
                </div>
            </ConfigSection>

            {/* Section: Emojis */}
            <ConfigSection
                id="emojis"
                icon={Smile}
                title="Icon Packs"
                isOpen={openSections.includes('emojis')}
                onToggle={onToggleSection}
            >
                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(EMOJI_SETS).map(([id, pack]: [string, any]) => (
                        <button
                            key={id}
                            onClick={() => setPreviewEmojiSet(id)}
                            className={`p-4 rounded-xl border text-center transition-all ${previewEmojiSet === id ? 'border-theme-primary bg-theme-primary/10' : 'border-theme-border/50 hover:bg-theme-card'}`}
                        >
                            <div className="text-xl mb-2">{pack.dashboard}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-theme-title">{id}</div>
                        </button>
                    ))}
                </div>
            </ConfigSection>
        </div>
    );
};
