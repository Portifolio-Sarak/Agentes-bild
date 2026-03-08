import React, { useEffect } from 'react';

const GoogleTranslateWidget = () => {
    useEffect(() => {
        const addScript = () => {
            if ((window as any).googleTranslateElementInit) return;

            (window as any).googleTranslateElementInit = () => {
                new (window as any).google.translate.TranslateElement({
                    pageLanguage: 'pt',
                    layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                }, 'google_translate_element');
            };

            const script = document.createElement('script');
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        };

        addScript();

        // Initial Detection and Persistence Logic
        const initLanguage = () => {
            const savedLang = localStorage.getItem('sarak_lang');
            const googTrans = document.cookie.split('; ').find(row => row.startsWith('googtrans='));

            if (!savedLang) {
                // First time: Detect from browser
                const browserLang = navigator.language.split('-')[0];
                const target = ['en', 'es'].includes(browserLang) ? browserLang : 'pt';
                localStorage.setItem('sarak_lang', target);
                setGoogleCookie(target);
            } else if (!googTrans || !googTrans.includes(savedLang)) {
                // Synchronize cookie if missing or incorrect
                setGoogleCookie(savedLang);
            }
        };

        const setGoogleCookie = (lang: string) => {
            const value = lang === 'pt' ? '' : `/pt/${lang}`;
            document.cookie = `googtrans=${value}; path=/`;
            document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;
            // If the cookie changed now, Google needs a reload to process it
            if (lang !== 'pt' && !document.cookie.includes(lang)) {
                // Wait a bit for the script to load
                setTimeout(() => window.location.reload(), 1000);
            }
        };

        initLanguage();
    }, []);

    return <div id="google_translate_element" style={{ display: 'none' }} />;
};

export default GoogleTranslateWidget;
