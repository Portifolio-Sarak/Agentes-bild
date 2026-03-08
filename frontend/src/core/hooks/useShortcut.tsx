import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const useShortcut = (info: { id: string, name: string, description?: string, category?: string }, callback: () => void) => {
    const { shortcuts, registerAction, unregisterAction } = useTheme();
    const callbackRef = useRef(callback);

    // Keep callback updated without re-triggering the listener effect
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Register action in the central system (to appear in the Shortcut Modal)
    useEffect(() => {
        registerAction({
            id: info.id,
            name: info.name,
            description: info.description || info.name,
            category: info.category || 'General'
        });
        return () => unregisterAction(info.id);
    }, [info.id, info.name, info.description, info.category, registerAction, unregisterAction]);

    // Keyboard event listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if focused on an input element
            const activeElement = document.activeElement;
            if (activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) return;

            const currentShortcut = shortcuts[info.id];
            if (!currentShortcut || !currentShortcut.keys) return;

            const { keys } = currentShortcut;

            // Check Modifiers
            const ctrlMatch = keys.includes('Control') === (e.ctrlKey || e.metaKey);
            const shiftMatch = keys.includes('Shift') === e.shiftKey;
            const altMatch = keys.includes('Alt') === e.altKey;

            // Identify the main key (non-modifier)
            // Logic: find the key in the list that isn't a standard modifier
            const modifiers = ['Control', 'Shift', 'Alt', 'Meta'];
            const mainKey = keys.find((k: string) => !modifiers.includes(k));

            // Key comparison (case-insensitive for safety)
            let keyMatch = false;
            if (mainKey) {
                // Special mapping for arrows and other keys
                const pressedKey = e.key;
                keyMatch = pressedKey.toLowerCase() === mainKey.toLowerCase();
            } else {
                // If shortcut is modifiers only, keyMatch is true if no other key was pressed
                keyMatch = true;
            }

            if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                e.preventDefault();
                callbackRef.current();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [info.id, shortcuts]);
};

export default useShortcut;
