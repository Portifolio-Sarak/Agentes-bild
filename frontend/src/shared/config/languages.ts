import { ALL_LANGUAGES } from '../../core/constants/engine';

export const DEFAULT_SOURCE = 'pt';
export const DEFAULT_TARGET = 'en';

export const isSupportedLanguage = (lang: string): boolean => {
    return ALL_LANGUAGES.some(l => l.id === lang);
};
