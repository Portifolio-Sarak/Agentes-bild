import React, { useState } from "react";
import { X } from "lucide-react";

const HelpButton = ({ text }: { text: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true); }}
                className="w-5 h-5 rounded-full border border-theme-border flex items-center justify-center text-[10px] text-theme-muted hover:border-theme-primary hover:text-theme-primary transition-colors z-20 relative outline-none"
            >
                ?
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-theme-body/80 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-theme-card border border-theme-border rounded-theme shadow-theme w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-theme-border bg-theme-primary/5">
                            <h3 className="text-sm font-bold text-theme-title flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-theme-primary/20 flex items-center justify-center text-theme-primary font-black">?</div>
                                Indicator Information
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-theme-muted hover:text-theme-title transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-theme-main leading-relaxed font-medium">
                                {text}
                            </p>
                        </div>
                        <div className="p-4 border-t border-theme-border flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-5 py-2 bg-theme-primary text-white text-xs font-bold uppercase rounded-lg transition-colors shadow-theme hover:opacity-90"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HelpButton;
