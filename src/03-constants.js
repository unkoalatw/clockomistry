// --- 配置與常數 ---
const DEFAULT_THEMES = {
    modern: {
        name: 'themeModern',
        bg: 'bg-slate-950',
        text: 'text-slate-100',
        accent: 'text-cyan-400',
        card: 'bg-slate-900/20 backdrop-blur-3xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]',
        gradient: 'from-slate-950 via-slate-900 to-black',
        button: 'hover:bg-cyan-400/20',
        settingsBg: 'bg-slate-950/90'
    },
    light: {
        name: 'themeLight',
        bg: 'bg-gray-50',
        text: 'text-gray-900',
        accent: 'text-blue-600',
        card: 'bg-white/30 backdrop-blur-3xl border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]',
        gradient: 'from-gray-100 via-gray-50 to-white',
        button: 'hover:bg-blue-600/10',
        settingsBg: 'bg-white/90'
    },
    cyber: {
        name: 'themeCyber',
        bg: 'bg-indigo-950',
        text: 'text-fuchsia-100',
        accent: 'text-fuchsia-400',
        card: 'bg-indigo-950/30 backdrop-blur-3xl border-fuchsia-500/20 shadow-[0_8px_32px_0_rgba(88,28,135,0.3)]',
        gradient: 'from-[#0f0c29] via-[#302b63] to-[#24243e]',
        button: 'hover:bg-fuchsia-500/20',
        settingsBg: 'bg-[#0f0c29]/90'
    },
    forest: {
        name: 'themeForest',
        bg: 'bg-teal-950',
        text: 'text-teal-50',
        accent: 'text-emerald-400',
        card: 'bg-teal-950/20 backdrop-blur-3xl border-emerald-500/20 shadow-[0_8px_32px_0_rgba(1,50,32,0.3)]',
        gradient: 'from-[#000000] via-[#134e5e] to-[#71b280]',
        button: 'hover:bg-emerald-500/20',
        settingsBg: 'bg-teal-950/90'
    }
};

const DEFAULT_FONTS = {
    modern: { name: 'fontModern', style: { fontFamily: 'ui-sans-serif, system-ui, sans-serif' } },
    elegant: { name: 'fontElegant', style: { fontFamily: '"Playfair Display", serif' } },
    technical: { name: 'fontTechnical', style: { fontFamily: '"JetBrains Mono", monospace' } },
    cyber: { name: 'fontCyber', style: { fontFamily: '"Orbitron", sans-serif' } },
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

