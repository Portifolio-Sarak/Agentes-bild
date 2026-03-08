import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandableCardProps {
    title: string;
    iconContent?: React.ReactNode;
    helpButton?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    baseHeight?: number;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
    title,
    iconContent,
    helpButton,
    children,
    className = "",
    contentClassName = "",
    baseHeight = 300
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isExpanded]);

    // Dynamic height based on global font scale factor, ensuring it scales up
    const dynamicStyle = {
        minHeight: isExpanded ? '100%' : `calc(${baseHeight}px * var(--font-size-factor, 1))`
    };

    return (
        <>
            <div className={`bg-theme-card border border-theme-border p-6 rounded-theme shadow-theme flex flex-col relative group transition-all duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : ''} ${className}`}>
                <div className="w-full flex justify-between items-start mb-6">
                    <h3 className="text-[11px] font-black text-theme-main uppercase tracking-widest flex items-center gap-2">
                        {iconContent}
                        <span className="truncate">{title}</span>
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                        {helpButton}
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="p-1.5 text-theme-muted hover:text-theme-primary hover:bg-theme-primary/10 rounded-lg transition-colors cursor-pointer"
                            title="Expandir Tela Cheia"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className={`w-full flex-1 flex flex-col relative ${contentClassName}`} style={dynamicStyle}>
                    {children}
                </div>
            </div>

            {mounted && createPortal(
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[99999] bg-theme-body flex flex-col"
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="flex-1 w-full h-full mx-auto p-4 sm:p-6 lg:p-8 relative flex flex-col overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-4 sm:mb-8 shrink-0 flex-wrap gap-4">
                                    <h3 className="text-lg sm:text-2xl font-black text-theme-title uppercase tracking-widest flex items-center gap-3">
                                        {iconContent}
                                        {title}
                                    </h3>
                                    <div className="flex items-center gap-4 flex-wrap justify-end">
                                        {helpButton && <div className="flex items-center">{helpButton}</div>}
                                        <button
                                            onClick={() => setIsExpanded(false)}
                                            className="p-3 bg-theme-card hover:bg-theme-primary/20 text-theme-primary border border-theme-border rounded-full transition-all shadow-lg cursor-pointer shrink-0 ml-2"
                                            title="Fechar"
                                        >
                                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>
                                    </div>
                                </div>
                                <div className={`flex-1 w-full relative flex flex-col min-h-0 bg-theme-card rounded-2xl border border-theme-border shadow-theme ${contentClassName}`}>
                                    {children}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default ExpandableCard;
