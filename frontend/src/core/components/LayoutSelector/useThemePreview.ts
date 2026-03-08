import { useState, useEffect } from 'react';
import { BASE_PRESETS } from '../../theme-library';

export const useThemePreview = (
    currentLayout: string,
    globalAnimationStyle: string,
    globalEmojiSet: string,
    primaryColor: string,
    fontScale: string,
    navigationStyle: string,
    sidebarWidth: number,
    customThemes: any,
    layouts: any
) => {
    const [previewLayoutId, setPreviewLayoutId] = useState(currentLayout);
    const [previewAnimationStyle, setPreviewAnimationStyle] = useState(globalAnimationStyle);
    const [previewEmojiSet, setPreviewEmojiSet] = useState(globalEmojiSet);
    const [previewPrimaryColor, setPreviewPrimaryColor] = useState(primaryColor);
    const [previewFontScale, setPreviewFontScale] = useState(fontScale);
    const [previewNavigationStyle, setPreviewNavigationStyle] = useState(navigationStyle);
    const [previewSidebarWidth, setPreviewSidebarWidth] = useState(sidebarWidth);

    // Initialize with current layout config
    const [config, setConfig] = useState(
        (BASE_PRESETS as any)[currentLayout.toLowerCase()] ||
        (currentLayout.startsWith('custom-') ? customThemes[currentLayout.replace('custom-', '')]?.config : null) ||
        BASE_PRESETS.glass
    );

    const [themeName, setThemeName] = useState("");

    // Sync local preview with the selected theme from list
    useEffect(() => {
        const isCustom = previewLayoutId.startsWith('custom-');

        if (isCustom) {
            const cleanId = previewLayoutId.replace('custom-', '');
            const theme = customThemes[cleanId];
            if (theme) {
                if (theme.config) setConfig(theme.config);
                setThemeName(theme.name);
                if (theme.animationStyle) setPreviewAnimationStyle(theme.animationStyle);
                if (theme.emojiSet) setPreviewEmojiSet(theme.emojiSet);
            }
        } else {
            const normalizedId = previewLayoutId.toLowerCase();
            if ((BASE_PRESETS as any)[normalizedId]) {
                setConfig((BASE_PRESETS as any)[normalizedId]);
                const nativeKey = previewLayoutId.toUpperCase();
                const native = layouts[nativeKey];
                setThemeName(native?.name || previewLayoutId);
                if (native) {
                    setPreviewAnimationStyle(native.animation || 'standard');
                    setPreviewEmojiSet(native.emoji || 'none');
                }
            }
        }
    }, [previewLayoutId, customThemes, layouts]);

    const handleConfigChange = (key: string, value: any) => {
        setConfig((prev: any) => ({ ...prev, [key]: value }));
    };

    return {
        previewLayoutId, setPreviewLayoutId,
        previewAnimationStyle, setPreviewAnimationStyle,
        previewEmojiSet, setPreviewEmojiSet,
        previewPrimaryColor, setPreviewPrimaryColor,
        previewFontScale, setPreviewFontScale,
        previewNavigationStyle, setPreviewNavigationStyle,
        previewSidebarWidth, setPreviewSidebarWidth,
        config, setConfig,
        themeName, setThemeName,
        handleConfigChange
    };
};
