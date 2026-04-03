// --- 配置與常數 ---
const DEFAULT_THEMES = {
    modern: {
        name: 'themeModern',
        bg: 'bg-slate-950',
        text: 'text-slate-100',
        accent: 'text-cyan-400',
        card: 'glass',
        gradient: 'from-[#010B18] via-[#0a1628] to-[#010B18]',
        button: 'hover:bg-cyan-400/10',
        settingsBg: 'glass-heavy'
    },
    light: {
        name: 'themeLight',
        bg: 'bg-stone-100',
        text: 'text-stone-900',
        accent: 'text-violet-600',
        card: 'glass-light',
        gradient: 'from-[#f5f5f0] via-[#ededea] to-[#fafaf8]',
        button: 'hover:bg-violet-600/5',
        settingsBg: 'bg-white/90 backdrop-blur-2xl'
    },
    cyber: {
        name: 'themeCyber',
        bg: 'bg-violet-950',
        text: 'text-fuchsia-50',
        accent: 'text-fuchsia-400',
        card: 'glass',
        gradient: 'from-[#0d0721] via-[#1a0f3a] to-[#0d0721]',
        button: 'hover:bg-fuchsia-500/10',
        settingsBg: 'glass-heavy'
    },
    forest: {
        name: 'themeForest',
        bg: 'bg-emerald-950',
        text: 'text-emerald-50',
        accent: 'text-emerald-400',
        card: 'glass',
        gradient: 'from-[#021510] via-[#0a2e1c] to-[#021510]',
        button: 'hover:bg-emerald-500/10',
        settingsBg: 'glass-heavy'
    }
};

const DEFAULT_FONTS = {
    modern:    { name: 'fontModern',    style: { fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif' } },
    elegant:   { name: 'fontElegant',   style: { fontFamily: '"Playfair Display", Georgia, serif' } },
    technical: { name: 'fontTechnical', style: { fontFamily: '"JetBrains Mono", "Fira Code", monospace' } },
    cyber:     { name: 'fontCyber',     style: { fontFamily: '"Orbitron", sans-serif' } },
    mirai:     { name: 'fontMirai',     style: { fontFamily: 'Mirai, sans-serif' } },
    line:      { name: 'fontLine',      style: { fontFamily: 'LineFont, sans-serif' } },
};

const ALL_ZONES = [
    // Asia
    { id: 'Asia/Taipei', label: 'Taipei', region: 'Asia' },
    { id: 'Asia/Tokyo', label: 'Tokyo', region: 'Asia' },
    { id: 'Asia/Seoul', label: 'Seoul', region: 'Asia' },
    { id: 'Asia/Shanghai', label: 'Shanghai', region: 'Asia' },
    { id: 'Asia/Hong_Kong', label: 'Hong Kong', region: 'Asia' },
    { id: 'Asia/Singapore', label: 'Singapore', region: 'Asia' },
    { id: 'Asia/Bangkok', label: 'Bangkok', region: 'Asia' },
    { id: 'Asia/Dubai', label: 'Dubai', region: 'Asia' },
    { id: 'Asia/Kolkata', label: 'Kolkata', region: 'Asia' },
    { id: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh', region: 'Asia' },
    // Europe
    { id: 'Europe/London', label: 'London', region: 'Europe' },
    { id: 'Europe/Paris', label: 'Paris', region: 'Europe' },
    { id: 'Europe/Berlin', label: 'Berlin', region: 'Europe' },
    { id: 'Europe/Rome', label: 'Rome', region: 'Europe' },
    { id: 'Europe/Madrid', label: 'Madrid', region: 'Europe' },
    { id: 'Europe/Moscow', label: 'Moscow', region: 'Europe' },
    { id: 'Europe/Amsterdam', label: 'Amsterdam', region: 'Europe' },
    { id: 'Europe/Zurich', label: 'Zurich', region: 'Europe' },
    // America
    { id: 'America/New_York', label: 'New York', region: 'America' },
    { id: 'America/Los_Angeles', label: 'Los Angeles', region: 'America' },
    { id: 'America/Chicago', label: 'Chicago', region: 'America' },
    { id: 'America/Toronto', label: 'Toronto', region: 'America' },
    { id: 'America/Vancouver', label: 'Vancouver', region: 'America' },
    { id: 'America/Sao_Paulo', label: 'São Paulo', region: 'America' },
    { id: 'America/Mexico_City', label: 'Mexico City', region: 'America' },
    // Oceania
    { id: 'Australia/Sydney', label: 'Sydney', region: 'Oceania' },
    { id: 'Australia/Melbourne', label: 'Melbourne', region: 'Oceania' },
    { id: 'Pacific/Auckland', label: 'Auckland', region: 'Oceania' },
    // Africa
    { id: 'Africa/Cairo', label: 'Cairo', region: 'Africa' },
    { id: 'Africa/Johannesburg', label: 'Johannesburg', region: 'Africa' },
];

