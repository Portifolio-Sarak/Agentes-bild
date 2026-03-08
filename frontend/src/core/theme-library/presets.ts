export const BASE_PRESETS = {
    glass: {
        '--radius-theme': '12px', '--font-main': "'Inter', sans-serif", '--font-heading': "'Outfit', sans-serif",
        '--theme-padding': '1.5rem', '--theme-gap': '1.5rem', '--glass-blur': '12px', '--glass-opacity': '0.7',
        '--font-weight-heading': '800', '--letter-spacing-heading': '-0.02em', '--border-width': '1px',
        '--shadow-intensity': '0.15', '--card-style': 'glass', '--bg-texture': 'noise'
    },
    corporate: {
        '--radius-theme': '4px', '--font-main': "'Inter', sans-serif", '--font-heading': "'Inter', sans-serif",
        '--theme-padding': '1.25rem', '--theme-gap': '1rem', '--glass-blur': '0px', '--glass-opacity': '1',
        '--font-weight-heading': '700', '--letter-spacing-heading': '0', '--border-width': '1px',
        '--shadow-intensity': '0.05', '--card-style': 'solid', '--bg-texture': 'dots'
    },
    minimal: {
        '--radius-theme': '0px', '--font-main': "'Inter', sans-serif", '--font-heading': "'Inter', sans-serif",
        '--theme-padding': '2rem', '--theme-gap': '2rem', '--glass-blur': '0px', '--glass-opacity': '1',
        '--font-weight-heading': '400', '--letter-spacing-heading': '0.05em', '--border-width': '0px',
        '--shadow-intensity': '0', '--card-style': 'solid', '--bg-texture': 'none'
    },
    technical: {
        '--radius-theme': '0px', '--font-main': "'JetBrains Mono', monospace", '--font-heading': "'JetBrains Mono', monospace",
        '--theme-padding': '1rem', '--theme-gap': '1rem', '--glass-blur': '0px', '--glass-opacity': '1',
        '--font-weight-heading': '700', '--letter-spacing-heading': '-0.01em', '--border-width': '1px',
        '--shadow-intensity': '0.2', '--card-style': 'solid', '--bg-texture': 'grid'
    },
    prestige: {
        '--radius-theme': '24px', '--font-main': "'Inter', sans-serif", '--font-heading': "'Sentient', serif",
        '--theme-padding': '2.5rem', '--theme-gap': '2rem', '--glass-blur': '20px', '--glass-opacity': '0.4',
        '--font-weight-heading': '400', '--letter-spacing-heading': '-0.03em', '--border-width': '1px',
        '--shadow-intensity': '0.08', '--card-style': 'glass', '--bg-texture': 'prestige'
    },
    atmospheric: {
        '--radius-theme': '32px', '--font-main': "'Inter', sans-serif", '--font-heading': "'Satoshi', sans-serif",
        '--theme-padding': '3rem', '--theme-gap': '2.5rem', '--glass-blur': '40px', '--glass-opacity': '0.3',
        '--font-weight-heading': '900', '--letter-spacing-heading': '-0.05em', '--border-width': '1px',
        '--shadow-intensity': '0.3', '--card-style': 'glass', '--bg-texture': 'mesh'
    },
    // NEW MASTER THEMES (V7.0)
    neon_circuit: {
        '--radius-theme': '4px', '--font-main': "'Space Mono', monospace", '--font-heading': "'Space Grotesk', sans-serif",
        '--theme-padding': '1.5rem', '--theme-gap': '1rem', '--glass-blur': '8px', '--glass-opacity': '0.6',
        '--font-weight-heading': '900', '--letter-spacing-heading': '-0.05em', '--text-transform-heading': 'uppercase',
        '--border-width': '2px', '--shadow-intensity': '0.4', '--card-style': 'glass', '--bg-texture': 'circuit'
    },
    zen_parchment: {
        '--radius-theme': '2px', '--font-main': "'STIX Two Text', serif", '--font-heading': "'Fraunces', serif",
        '--theme-padding': '2.5rem', '--theme-gap': '2rem', '--glass-blur': '0px', '--glass-opacity': '1',
        '--font-weight-heading': '400', '--letter-spacing-heading': '-0.02em', '--text-transform-heading': 'none',
        '--border-width': '1px', '--shadow-intensity': '0.05', '--card-style': 'solid', '--bg-texture': 'paper'
    },
    finance_pro: {
        '--radius-theme': '8px', '--font-main': "'Public Sans', sans-serif", '--font-heading': "'Public Sans', sans-serif",
        '--theme-padding': '1.25rem', '--theme-gap': '1rem', '--glass-blur': '4px', '--glass-opacity': '0.9',
        '--font-weight-heading': '800', '--letter-spacing-heading': '0', '--text-transform-heading': 'none',
        '--border-width': '1px', '--shadow-intensity': '0.1', '--card-style': 'solid', '--bg-texture': 'scanlines'
    },
    gamer_elite: {
        '--radius-theme': '16px', '--font-main': "'Inter', sans-serif", '--font-heading': "'Syne', sans-serif",
        '--theme-padding': '1.5rem', '--theme-gap': '1.5rem', '--glass-blur': '10px', '--glass-opacity': '0.5',
        '--font-weight-heading': '800', '--letter-spacing-heading': '0.05em', '--text-transform-heading': 'uppercase',
        '--border-width': '1px', '--shadow-intensity': '0.5', '--card-style': 'glass', '--bg-texture': 'carbon'
    },
    ai_neural: {
        '--radius-theme': '12px', '--font-main': "'Bricolage Grotesque', sans-serif", '--font-heading': "'Bricolage Grotesque', sans-serif",
        '--theme-padding': '2rem', '--theme-gap': '2rem', '--glass-blur': '20px', '--glass-opacity': '0.3',
        '--font-weight-heading': '700', '--letter-spacing-heading': '-0.04em', '--text-transform-heading': 'none',
        '--border-width': '1px', '--shadow-intensity': '0.2', '--card-style': 'glass', '--bg-texture': 'hexagon'
    },
    editorial: {
        '--radius-theme': '40px', '--font-main': "'Inter', sans-serif", '--font-heading': "'Sentient', serif",
        '--theme-padding': '3rem', '--theme-gap': '3rem', '--glass-blur': '12px', '--glass-opacity': '0.8',
        '--font-weight-heading': '400', '--letter-spacing-heading': '-0.03em', '--text-transform-heading': 'none',
        '--border-width': '1px', '--shadow-intensity': '0.1', '--card-style': 'glass', '--bg-texture': 'prestige'
    },
    terminal: {
        '--radius-theme': '0px', '--font-main': "'JetBrains Mono', monospace", '--font-heading': "'Space Mono', monospace",
        '--theme-padding': '1rem', '--theme-gap': '1px', '--glass-blur': '0px', '--glass-opacity': '1',
        '--font-weight-heading': '700', '--letter-spacing-heading': '0.1em', '--text-transform-heading': 'uppercase',
        '--border-width': '1px', '--shadow-intensity': '0.8', '--card-style': 'solid', '--bg-texture': 'scanlines'
    },
    // REQUESTED THEMES (V2 HIGH FIDELITY)
    main: {
        '--radius-theme': '0px', '--font-main': "'JetBrains Mono', monospace", '--font-heading': "'JetBrains Mono', monospace",
        '--theme-padding': '1rem', '--theme-gap': '1.5rem', '--glass-blur': '0px', '--glass-opacity': '1',
        '--font-weight-heading': '700', '--letter-spacing-heading': '-0.01em', '--border-width': '1.5px',
        '--shadow-intensity': '0.3', '--card-style': 'solid', '--bg-texture': 'grid',
        '--theme-body': '#000000', '--theme-card': '#080808', '--theme-sidebar': '#050505'
    },
    cyberpunk: {
        '--radius-theme': '0px', '--font-main': "'Space Mono', monospace", '--font-heading': "'Space Grotesk', sans-serif",
        '--theme-padding': '1.5rem', '--theme-gap': '1.25rem', '--glass-blur': '12px', '--glass-opacity': '0.4',
        '--font-weight-heading': '900', '--letter-spacing-heading': '0.1em', '--text-transform-heading': 'uppercase',
        '--border-width': '3px', '--shadow-intensity': '0.8', '--card-style': 'glass', '--bg-texture': 'circuit'
    },
    formal_1: {
        '--radius-theme': '0px', '--font-main': "'Inter', sans-serif", '--font-heading': "'Inter', sans-serif",
        '--theme-padding': '1.5rem', '--theme-gap': '1.5rem', '--glass-blur': '0px', '--glass-opacity': '1',
        '--font-weight-heading': '700', '--letter-spacing-heading': '0', '--border-width': '1px',
        '--shadow-intensity': '0.05', '--card-style': 'solid', '--bg-texture': 'none'
    },
    formal_2: {
        '--radius-theme': '4px', '--font-main': "'Inter', sans-serif", '--font-heading': "'Inter', sans-serif",
        '--theme-padding': '1.25rem', '--theme-gap': '1rem', '--glass-blur': '0px', '--glass-opacity': '1',
        '--font-weight-heading': '800', '--letter-spacing-heading': '-0.02em', '--border-width': '2px',
        '--shadow-intensity': '0.1', '--card-style': 'solid', '--bg-texture': 'dots'
    },
    formal_3: {
        '--radius-theme': '0px', '--font-main': "'Inter', sans-serif", '--font-heading': "'Inter', sans-serif",
        '--theme-padding': '2rem', '--theme-gap': '2rem', '--glass-blur': '0px', '--glass-opacity': '1',
        '--font-weight-heading': '400', '--letter-spacing-heading': '0', '--border-width': '1px',
        '--shadow-intensity': '0.05', '--card-style': 'solid', '--bg-texture': 'paper'
    },
    mac: {
        '--radius-theme': '12px', '--font-main': "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", '--font-heading': "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        '--theme-padding': '1.5rem', '--theme-gap': '1.5rem', '--glass-blur': '50px', '--glass-opacity': '0.75',
        '--font-weight-heading': '600', '--letter-spacing-heading': '-0.02em', '--border-width': '0.5px',
        '--shadow-intensity': '0.15', '--card-style': 'glass', '--bg-texture': 'none',
        '--theme-sidebar': 'rgba(230,230,230,0.1)', '--theme-card': 'rgba(255,255,255,0.1)'
    }
};
