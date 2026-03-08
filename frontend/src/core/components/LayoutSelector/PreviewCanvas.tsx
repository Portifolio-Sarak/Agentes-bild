import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Monitor, Tablet, Smartphone, Settings, Users,
    BarChart3, MessageSquare, History, Settings2,
    Zap, Shield, Database, Box
} from 'lucide-react';
import { EMOJI_SETS, THEME_EFFECTS } from '../../theme-library';
import { MockDashboard, MockChat, MockLogs, MockSettings } from './MockApps';
import { useTheme } from '../../contexts/ThemeContext';

const ANIMATION_VARIANTS = THEME_EFFECTS.page;

export const PreviewCanvas = ({
    previewDevice,
    previewLayoutId,
    activePreviewApp,
    setActivePreviewApp,
    previewAnimationStyle,
    previewEmojiSet,
    config,
    previewPrimaryColor,
    mode
}: any) => {
    const previewStyles = {
        desktop: { width: '100%', height: '100%', maxWidth: '1320px', aspectRatio: '16/9.5' },
        tablet: { width: '922px', height: '100%', maxWidth: '922px', aspectRatio: '3/4' },
        smartphone: { width: '450px', height: '100%', maxWidth: '450px', aspectRatio: '9/19.5' }
    };

    const renderApp = () => {
        const props = { config, animationVariants: ANIMATION_VARIANTS, animationStyle: previewAnimationStyle };
        switch (activePreviewApp) {
            case 'dashboard': return <MockDashboard {...props} />;
            case 'chat': return <MockChat {...props} />;
            case 'logs': return <MockLogs {...props} />;
            case 'settings': return <MockSettings {...props} />;
            default: return <MockDashboard {...props} />;
        }
    };

    const { layoutDensity, setLayoutDensity } = useTheme();

    return (
        <div className="flex-grow flex flex-col relative overflow-hidden bg-theme-body/20">
            {/* TOP FILTERS & TOOLS */}
            <div className="flex items-center justify-between shrink-0 relative z-30 p-4">
                {/* Center Presets */}
                <div className="flex-grow flex justify-center">
                    <div className="flex gap-4 items-center bg-theme-body/80 p-1.5 rounded-full border border-theme-border/50 backdrop-blur-md">
                        {[
                            { id: 'compact', label: 'Compact', gap: '0.75rem', pad: '0.75rem', radius: '8px' },
                            { id: 'standard', label: 'Standard', gap: '1.5rem', pad: '1.5rem', radius: '12px' },
                            { id: 'comfortable', label: 'Comfortable', gap: '2rem', pad: '2rem', radius: '20px' }
                        ].map(preset => (
                            <button
                                key={preset.id}
                                onClick={() => setLayoutDensity(preset.id)}
                                className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${layoutDensity === preset.id
                                    ? 'bg-theme-primary text-white shadow-lg shadow-theme-primary/30 scale-105'
                                    : 'text-theme-muted hover:text-theme-title'} `}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* PREVIEW CANVAS CONTAINER */}
            <div className="flex-grow flex items-center justify-center p-4 relative z-10 overflow-auto custom-scrollbar">
                <motion.div
                    layout
                    initial={false}
                    animate={(previewStyles as any)[previewDevice]}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                        '--primary-color': previewPrimaryColor,
                        '--font-main': config['--font-main'],
                        '--font-heading': config['--font-heading'],
                        '--radius-theme': config['--radius-theme'],
                        '--glass-blur': config['--glass-blur'],
                        '--glass-opacity': config['--glass-opacity'],
                        '--shadow-intensity': config['--shadow-intensity'],
                        '--border-width': config['--border-width'],
                        '--theme-padding': config['--theme-padding'],
                        '--theme-gap': config['--theme-gap'],
                        '--font-weight-heading': config['--font-weight-heading'] || '700',
                        '--letter-spacing-heading': config['--letter-spacing-heading'] || '0',
                        '--text-transform-heading': config['--text-transform-heading'] || 'none',
                        '--bg-texture-opacity': config['--bg-texture'] === 'none' ? '0' : (config['--bg-texture'] === 'mesh' ? '0.15' : '0.05'),
                        ...(config['--theme-title'] && { '--theme-title': config['--theme-title'] }),
                        ...(config['--theme-muted'] && { '--theme-muted': config['--theme-muted'] }),
                        ...(config['--theme-card'] && { '--theme-card': config['--theme-card'] }),
                        ...(config['--theme-sidebar'] && { '--theme-sidebar': config['--theme-sidebar'] }),
                        ...(config['--theme-body'] && { '--theme-body': config['--theme-body'] })
                    }}
                    className={`preview-container ${mode} layout-${previewLayoutId.replace('custom-', '')} bg-theme-body text-theme-main rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative transition-colors duration-500 ${config['--bg-texture'] ? `texture-${config['--bg-texture']}` : ''}`}
                >
                    {/* Mock Browser/App Header */}
                    <div className="h-8 bg-theme-card/80 border-b border-theme-border/50 px-6 flex items-center gap-2 shrink-0">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                        </div>
                        <div className="mx-auto bg-theme-body/50 px-4 py-0.5 rounded-full border border-theme-border/30 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-theme-primary animate-pulse"></div>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-theme-muted/60">sarak.engine/preview</span>
                        </div>
                    </div>

                    {/* Mock Navigation Sidebar */}
                    <div className="flex flex-grow overflow-hidden">
                        <div className="w-16 sm:w-20 bg-theme-card/30 border-r border-theme-border shrink-0 flex flex-col items-center py-6 gap-6">
                            <div className="w-8 h-8 rounded-xl bg-theme-primary flex items-center justify-center text-white shadow-lg shadow-theme-primary/20 mb-4">
                                <Zap className="w-4 h-4" />
                            </div>
                            {[BarChart3, MessageSquare, History, Users, Shield, Database].map((Icon, i) => (
                                <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${i === 0 ? 'bg-theme-primary/10 text-theme-primary' : 'text-theme-muted hover:text-theme-title hover:bg-theme-body/50'}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                            ))}
                            <div className="mt-auto hidden md:block w-20 h-2 bg-theme-muted/5 rounded-full"></div>
                        </div>

                        {/* App Content Area */}
                        <div className="flex-grow flex flex-col overflow-hidden">
                            <div className="h-14 border-b border-theme-border bg-theme-card/30 px-6 flex items-center justify-between shrink-0">
                                <div className="flex gap-4">
                                    {[
                                        { id: 'dashboard', icon: (EMOJI_SETS as any)[previewEmojiSet]?.dashboard || <BarChart3 className="w-3.5 h-3.5" />, label: 'Dash' },
                                        { id: 'chat', icon: (EMOJI_SETS as any)[previewEmojiSet]?.analises || <MessageSquare className="w-3.5 h-3.5" />, label: 'Chat' },
                                        { id: 'logs', icon: (EMOJI_SETS as any)[previewEmojiSet]?.audit || <History className="w-3.5 h-3.5" />, label: 'Logs' },
                                        { id: 'settings', icon: (EMOJI_SETS as any)[previewEmojiSet]?.settings || <Settings2 className="w-3.5 h-3.5" />, label: 'Config' }
                                    ].map(app => (
                                        <button
                                            key={app.id}
                                            onClick={() => setActivePreviewApp(app.id)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[10px] font-bold ${activePreviewApp === app.id ? 'bg-theme-primary/10 text-theme-primary shadow-sm border border-theme-primary/20' : 'text-theme-muted hover:text-theme-title'}`}
                                        >
                                            <span className="shrink-0">{app.icon}</span>
                                            <span className="hidden sm:inline">{app.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-theme-muted/10 border border-theme-border flex items-center justify-center">
                                        <Users className="w-3.5 h-3.5 text-theme-muted" />
                                    </div>
                                </div>
                            </div>

                            <div
                                className="flex-grow overflow-auto relative"
                                style={{ padding: config['--theme-padding'] }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activePreviewApp}
                                        initial={(ANIMATION_VARIANTS as any)[previewAnimationStyle]?.page?.initial || (ANIMATION_VARIANTS as any).none.page.initial}
                                        animate={(ANIMATION_VARIANTS as any)[previewAnimationStyle]?.page?.animate || (ANIMATION_VARIANTS as any).none.page.animate}
                                        exit={(ANIMATION_VARIANTS as any)[previewAnimationStyle]?.page?.exit || (ANIMATION_VARIANTS as any).none.page.exit}
                                        transition={(ANIMATION_VARIANTS as any)[previewAnimationStyle]?.page?.transition || (ANIMATION_VARIANTS as any).none.page.transition}
                                        className="flex flex-col h-full"
                                    >
                                        {renderApp()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Right Info */}
            <div className="flex justify-end pr-4 opacity-40 relative z-10">
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted">
                    <span>MODO: {previewLayoutId.toUpperCase()}</span>
                    <span>APP: {activePreviewApp.toUpperCase()}</span>
                </div>
            </div>
        </div >
    );
};
