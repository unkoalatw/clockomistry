import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
    Maximize2, Minimize2, Timer, Clock, Monitor,
    Play, Pause, RotateCcw, AlertCircle, Globe,
    StopCircle, Settings, X, Check, Plus, Search,
    Type, Upload, Palette, ArrowLeft, Coffee, Brain
} from 'lucide-react';

// --- IndexedDB 管理 (用於儲存大體積字型) ---
const DB_NAME = 'ClockomistryDB';
const STORE_NAME = 'fonts';
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};
const saveFontToDB = async (data) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, 'customFont');
    return new Promise((resolve) => tx.oncomplete = resolve);
};
const getFontFromDB = async () => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get('customFont');
    return new Promise((resolve) => request.onsuccess = () => resolve(request.result));
};

// --- 配置與常數 ---
const DEFAULT_THEMES = {
    modern: {
        name: '極夜黑',
        bg: 'bg-slate-950',
        text: 'text-slate-100',
        accent: 'text-cyan-400',
        card: 'bg-slate-900/20 backdrop-blur-3xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]',
        gradient: 'from-slate-950 via-slate-900 to-black',
        button: 'hover:bg-cyan-400/20',
        settingsBg: 'bg-slate-950/90'
    },
    light: {
        name: '光學白',
        bg: 'bg-gray-50',
        text: 'text-gray-900',
        accent: 'text-blue-600',
        card: 'bg-white/30 backdrop-blur-3xl border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]',
        gradient: 'from-gray-100 via-gray-50 to-white',
        button: 'hover:bg-blue-600/10',
        settingsBg: 'bg-white/90'
    },
    cyber: {
        name: '霓虹紫',
        bg: 'bg-indigo-950',
        text: 'text-fuchsia-100',
        accent: 'text-fuchsia-400',
        card: 'bg-indigo-950/30 backdrop-blur-3xl border-fuchsia-500/20 shadow-[0_8px_32px_0_rgba(88,28,135,0.3)]',
        gradient: 'from-[#0f0c29] via-[#302b63] to-[#24243e]',
        button: 'hover:bg-fuchsia-500/20',
        settingsBg: 'bg-[#0f0c29]/90'
    },
    forest: {
        name: '水晶綠',
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
    modern: { name: '現代 (Modern)', style: { fontFamily: 'ui-sans-serif, system-ui, sans-serif' } },
    elegant: { name: '經典 (Elegant)', style: { fontFamily: '"Playfair Display", serif' } },
    technical: { name: '工程 (Tech)', style: { fontFamily: '"JetBrains Mono", monospace' } },
    cyber: { name: '未來 (Cyber)', style: { fontFamily: '"Orbitron", sans-serif' } },
};

const ALL_ZONES = [
    // Asia
    { id: 'Asia/Taipei', label: '台北 (Taipei)', region: 'Asia' },
    { id: 'Asia/Tokyo', label: '東京 (Tokyo)', region: 'Asia' },
    { id: 'Asia/Seoul', label: '首爾 (Seoul)', region: 'Asia' },
    { id: 'Asia/Shanghai', label: '上海 (Shanghai)', region: 'Asia' },
    { id: 'Asia/Hong_Kong', label: '香港 (Hong Kong)', region: 'Asia' },
    { id: 'Asia/Singapore', label: '新加坡 (Singapore)', region: 'Asia' },
    { id: 'Asia/Bangkok', label: '曼谷 (Bangkok)', region: 'Asia' },
    { id: 'Asia/Dubai', label: '杜拜 (Dubai)', region: 'Asia' },
    { id: 'Asia/Kolkata', label: '加爾各答 (Kolkata)', region: 'Asia' },
    { id: 'Asia/Ho_Chi_Minh', label: '胡志明市 (Ho Chi Minh)', region: 'Asia' },
    // Europe
    { id: 'Europe/London', label: '倫敦 (London)', region: 'Europe' },
    { id: 'Europe/Paris', label: '巴黎 (Paris)', region: 'Europe' },
    { id: 'Europe/Berlin', label: '柏林 (Berlin)', region: 'Europe' },
    { id: 'Europe/Rome', label: '羅馬 (Rome)', region: 'Europe' },
    { id: 'Europe/Madrid', label: '馬德里 (Madrid)', region: 'Europe' },
    { id: 'Europe/Moscow', label: '莫斯科 (Moscow)', region: 'Europe' },
    { id: 'Europe/Amsterdam', label: '阿姆斯特丹 (Amsterdam)', region: 'Europe' },
    { id: 'Europe/Zurich', label: '蘇黎世 (Zurich)', region: 'Europe' },
    // America
    { id: 'America/New_York', label: '紐約 (New York)', region: 'America' },
    { id: 'America/Los_Angeles', label: '洛杉磯 (Los Angeles)', region: 'America' },
    { id: 'America/Chicago', label: '芝加哥 (Chicago)', region: 'America' },
    { id: 'America/Toronto', label: '多倫多 (Toronto)', region: 'America' },
    { id: 'America/Vancouver', label: '溫哥華 (Vancouver)', region: 'America' },
    { id: 'America/Sao_Paulo', label: '聖保羅 (São Paulo)', region: 'America' },
    { id: 'America/Mexico_City', label: '墨西哥城 (Mexico City)', region: 'America' },
    // Oceania
    { id: 'Australia/Sydney', label: '雪梨 (Sydney)', region: 'Oceania' },
    { id: 'Australia/Melbourne', label: '墨爾本 (Melbourne)', region: 'Oceania' },
    { id: 'Pacific/Auckland', label: '奧克蘭 (Auckland)', region: 'Oceania' },
    // Africa
    { id: 'Africa/Cairo', label: '開羅 (Cairo)', region: 'Africa' },
    { id: 'Africa/Johannesburg', label: '約翰尼斯堡 (Johannesburg)', region: 'Africa' },
];

function App() {
    const [time, setTime] = useState(new Date());
    const [theme, setTheme] = useState(() => localStorage.getItem('clock_theme') || 'modern');
    const [font, setFont] = useState(() => localStorage.getItem('clock_font') || 'modern');
    const [showMillis, setShowMillis] = useState(() => localStorage.getItem('clock_millis') === 'true');
    const [selectedZones, setSelectedZones] = useState(() => {
        try {
            const saved = localStorage.getItem('clock_zones');
            if (saved) {
                const parsed = JSON.parse(saved);
                // 兼容性處理：如果儲存的是字串陣列，或是舊的物件，重新對應
                const zones = parsed.map(item => {
                    const id = typeof item === 'string' ? item : item.id;
                    return ALL_ZONES.find(z => z.id === id);
                }).filter(Boolean);
                if (zones.length > 0) return zones;
            }
        } catch (e) { }
        return [
            ALL_ZONES.find(z => z.id === 'Asia/Taipei'),
            ALL_ZONES.find(z => z.id === 'America/New_York'),
            ALL_ZONES.find(z => z.id === 'Europe/London'),
            ALL_ZONES.find(z => z.id === 'Asia/Tokyo')
        ].filter(Boolean);
    });

    const [mode, setMode] = useState('clock');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasCustomFont, setHasCustomFont] = useState(false);
    const [customColors, setCustomColors] = useState(() => {
        try { const s = localStorage.getItem('clock_custom_colors'); if (s) return JSON.parse(s); } catch (e) { }
        return { bg1: '#0a0a1a', bg2: '#1a1a3e', bg3: '#0a0a1a', text: '#e2e8f0', accent: '#22d3ee' };
    });
    const [customBgImage, setCustomBgImage] = useState(() => localStorage.getItem('clock_custom_bg') || '');

    // Timer 狀態
    const [timerSeconds, setTimerSeconds] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerInitial, setTimerInitial] = useState(25 * 60);

    // Pomodoro 狀態
    const [pomoMode, setPomoMode] = useState('work'); // 'work', 'short', 'long'
    const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
    const [isPomoRunning, setIsPomoRunning] = useState(false);

    // Stopwatch 狀態
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
    const [laps, setLaps] = useState([]);

    const containerRef = useRef(null);
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const fileInputRef = useRef(null);
    const bgImageInputRef = useRef(null);

    // --- 持久化設定 ---
    useEffect(() => { localStorage.setItem('clock_theme', theme); }, [theme]);
    useEffect(() => { localStorage.setItem('clock_font', font); }, [font]);
    useEffect(() => { localStorage.setItem('clock_millis', showMillis); }, [showMillis]);
    useEffect(() => { localStorage.setItem('clock_zones', JSON.stringify(selectedZones)); }, [selectedZones]);
    useEffect(() => { localStorage.setItem('clock_custom_colors', JSON.stringify(customColors)); }, [customColors]);
    useEffect(() => { localStorage.setItem('clock_custom_bg', customBgImage); }, [customBgImage]);

    // 初始化時從 IndexedDB 載入字體
    useEffect(() => {
        const initFont = async () => {
            const savedFont = await getFontFromDB();
            if (savedFont) {
                await loadCustomFont(savedFont);
            }
        };
        initFont();
    }, []);

    // --- 字體載入邏輯 ---
    const loadCustomFont = async (base64Data) => {
        try {
            const fontFace = new FontFace('CustomFont', `url(${base64Data})`);
            const loadedFace = await fontFace.load();
            document.fonts.add(loadedFace);
            setHasCustomFont(true);
            return true;
        } catch (e) {
            showError('字體載入失敗');
            return false;
        }
    };

    const handleFontUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target.result;
            const success = await loadCustomFont(data);
            if (success) {
                await saveFontToDB(data);
                setFont('custom');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleBgImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { showError('圖片不能超過 5MB'); return; }
        const reader = new FileReader();
        reader.onload = (ev) => { setCustomBgImage(ev.target.result); setTheme('custom'); };
        reader.readAsDataURL(file);
    };

    const updateCustomColor = (key, value) => setCustomColors(prev => ({ ...prev, [key]: value }));

    // --- Pomodoro 邏輯 ---
    useEffect(() => {
        let interval = null;
        if (isPomoRunning && pomoSeconds > 0) {
            interval = setInterval(() => setPomoSeconds(prev => prev - 1), 1000);
        } else if (pomoSeconds === 0) {
            setIsPomoRunning(false);
            // 自動切換模式或播放鈴聲（這裡先簡單處理）
            if (pomoMode === 'work') {
                setPomoMode('short');
                setPomoSeconds(5 * 60);
            } else {
                setPomoMode('work');
                setPomoSeconds(25 * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isPomoRunning, pomoSeconds, pomoMode]);

    const resetPomo = (modeType) => {
        setIsPomoRunning(false);
        setPomoMode(modeType);
        if (modeType === 'work') setPomoSeconds(25 * 60);
        else if (modeType === 'short') setPomoSeconds(5 * 60);
        else if (modeType === 'long') setPomoSeconds(15 * 60);
    };

    // --- 核心計時邏輯 ---
    useEffect(() => {
        const updateTime = () => {
            setTime(new Date());
            if (showMillis) requestRef.current = requestAnimationFrame(updateTime);
        };
        if (showMillis) requestRef.current = requestAnimationFrame(updateTime);
        else {
            const timer = setInterval(() => setTime(new Date()), 1000);
            return () => clearInterval(timer);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [showMillis]);

    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timerSeconds > 0) {
            interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
        } else if (timerSeconds === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerSeconds]);

    useEffect(() => {
        if (isStopwatchRunning) {
            previousTimeRef.current = Date.now();
            const animate = () => {
                const now = Date.now();
                const deltaTime = now - previousTimeRef.current;
                previousTimeRef.current = now;
                setStopwatchTime(prev => prev + deltaTime);
                requestRef.current = requestAnimationFrame(animate);
            };
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isStopwatchRunning]);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef(null);

    const handleMouseMove = () => {
        setShowControls(true);
        if (isZenMode) {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    };

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) await containerRef.current.requestFullscreen();
            else await document.exitFullscreen();
        } catch (err) {
            showError("全螢幕切換失敗");
        }
    };

    const showError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(''), 3000);
    };

    const formatTime = (date) => {
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        const s = date.getSeconds().toString().padStart(2, '0');
        const ms = Math.floor(date.getMilliseconds() / 10).toString().padStart(2, '0');
        return { h, m, s, ms };
    };

    const formatDate = (date) => date.toLocaleDateString('zh-TW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const formatDuration = (ms) => {
        const m = Math.floor(ms / 60000).toString().padStart(2, '0');
        const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
        const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
        return { m, s, cs };
    };

    const getWorldTime = (timezone) => {
        try {
            const d = new Date();
            const s = d.toLocaleTimeString('en-US', { timeZone: timezone, hour12: false, hour: '2-digit', minute: '2-digit' });
            const [h, m] = s.split(':');
            return { h, m };
        } catch (e) { return { h: '--', m: '--' }; }
    };

    const filteredZones = useMemo(() => ALL_ZONES.filter(z => z.label.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery]);
    const currentTheme = theme === 'custom' ? {
        name: '自訂', bg: '', text: '', accent: 'custom-accent',
        card: 'custom-card backdrop-blur-3xl',
        gradient: '', button: 'hover:bg-white/20', settingsBg: 'custom-settings'
    } : (DEFAULT_THEMES[theme] || DEFAULT_THEMES.modern);
    const { h, m, s, ms } = formatTime(time);
    const stopwatch = formatDuration(stopwatchTime);
    const currentFontStyle = useMemo(() => (font === 'custom' && hasCustomFont) ? { fontFamily: 'CustomFont' } : (DEFAULT_FONTS[font]?.style || {}), [font, hasCustomFont]);
    const containerStyle = theme === 'custom' ? {
        ...currentFontStyle,
        background: customBgImage
            ? `linear-gradient(${customColors.bg1}cc, ${customColors.bg1}cc), url(${customBgImage}) center/cover no-repeat fixed`
            : `linear-gradient(135deg, ${customColors.bg1}, ${customColors.bg2}, ${customColors.bg3})`,
        color: customColors.text
    } : currentFontStyle;

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            style={containerStyle}
            className={`h-screen w-full flex flex-col items-center justify-center transition-all duration-1000 ${theme !== 'custom' ? `bg-gradient-to-br ${currentTheme.gradient} ${currentTheme.text}` : ''} overflow-hidden relative selection:bg-pink-500 selection:text-white`}
        >
            {theme === 'custom' && <style>{`
                .custom-accent { color: ${customColors.accent}; }
                .custom-card { background: ${customColors.bg1}33; border-color: ${customColors.text}1a; box-shadow: 0 8px 32px 0 rgba(0,0,0,0.36); }
                .custom-settings { background: ${customColors.bg1}e6; backdrop-filter: blur(64px); }
            `}</style>}
            {/* Toast */}
            <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${errorMsg ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className={`px-6 py-3 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 bg-slate-800/90 text-white`}>
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">{errorMsg}</span>
                </div>
            </div>

            {/* Settings Overlay */}
            {showSettings && (
                <div className={`fixed inset-0 z-[60] ${currentTheme.settingsBg} backdrop-blur-3xl animate-in fade-in duration-300 flex flex-col md:flex-row overflow-hidden`}>
                    <div className="md:w-1/3 lg:w-1/4 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10">
                        <button onClick={() => setShowSettings(false)} className="mb-8 p-2 -ml-2 hover:bg-white/10 rounded-full flex items-center gap-2 opacity-60 hover:opacity-100 group">
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            <span>返回</span>
                        </button>
                        <h2 className="text-4xl font-bold tracking-wider mb-2">設定</h2>
                        <p className="opacity-50 text-lg">自訂你的質感時鐘</p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                        <div className="max-w-3xl mx-auto space-y-12 pb-20">
                            <section className="space-y-6">
                                <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Palette size={24} /> 外觀風格</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {Object.entries(DEFAULT_THEMES).map(([key, t]) => (
                                        <button key={key} onClick={() => setTheme(key)} className={`flex flex-col items-center gap-4 p-6 rounded-3xl transition-all border ${theme === key ? `bg-white/10 border-white/50 scale-105` : 'border-white/5 hover:bg-white/5'}`}>
                                            <div className={`w-12 h-12 rounded-full ${t.bg.includes('gray-50') ? 'bg-gray-300' : t.bg}`}></div>
                                            <span className="text-sm">{t.name}</span>
                                        </button>
                                    ))}
                                    <button onClick={() => setTheme('custom')} className={`flex flex-col items-center gap-4 p-6 rounded-3xl transition-all border ${theme === 'custom' ? 'bg-white/10 border-white/50 scale-105' : 'border-white/5 hover:bg-white/5'}`}>
                                        <div className="w-12 h-12 rounded-full border border-white/20" style={{ background: `linear-gradient(135deg, ${customColors.bg1}, ${customColors.bg2}, ${customColors.bg3})` }}></div>
                                        <span className="text-sm">自訂</span>
                                    </button>
                                </div>
                                {theme === 'custom' && (
                                    <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        <div>
                                            <span className="text-sm font-medium opacity-80" style={{ display: 'block', marginBottom: 12 }}>背景漸層色</span>
                                            <div className="flex gap-4 items-center">
                                                {[['bg1', '色彩1'], ['bg2', '色彩2'], ['bg3', '色彩3']].map(([k, l]) => (
                                                    <label key={k} className="flex flex-col items-center gap-1 cursor-pointer">
                                                        <input type="color" value={customColors[k]} onChange={(e) => updateCustomColor(k, e.target.value)} style={{ width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                                                        <span className="opacity-50" style={{ fontSize: 10 }}>{l}</span>
                                                    </label>
                                                ))}
                                                <div className="flex-1 rounded-lg border border-white/10" style={{ height: 40, background: `linear-gradient(135deg, ${customColors.bg1}, ${customColors.bg2}, ${customColors.bg3})` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium opacity-80" style={{ display: 'block', marginBottom: 12 }}>文字 / 強調色</span>
                                            <div className="flex gap-4 items-center">
                                                {[['text', '文字'], ['accent', '強調']].map(([k, l]) => (
                                                    <label key={k} className="flex flex-col items-center gap-1 cursor-pointer">
                                                        <input type="color" value={customColors[k]} onChange={(e) => updateCustomColor(k, e.target.value)} style={{ width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                                                        <span className="opacity-50" style={{ fontSize: 10 }}>{l}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium opacity-80" style={{ display: 'block', marginBottom: 12 }}>背景圖片</span>
                                            <div className="flex gap-3 items-center">
                                                <button onClick={() => bgImageInputRef.current.click()} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm"><Upload size={14} /> 上傳圖片</button>
                                                {customBgImage && <button onClick={() => setCustomBgImage('')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm opacity-60 hover:opacity-100"><X size={14} /> 移除</button>}
                                                <input type="file" ref={bgImageInputRef} className="hidden" accept="image/*" onChange={handleBgImageUpload} />
                                            </div>
                                            {customBgImage && <div className="w-full rounded-xl overflow-hidden border border-white/10" style={{ height: 96, marginTop: 12 }}><img src={customBgImage} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} /></div>}
                                        </div>
                                    </div>
                                )}
                                <div className="pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg opacity-80">顯示字體</span>
                                        <button onClick={() => fileInputRef.current.click()} className="text-sm flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"><Upload size={14} /> 匯入字體</button>
                                        <input type="file" ref={fileInputRef} className="hidden" accept=".ttf,.otf,.woff" onChange={handleFontUpload} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {Object.entries(DEFAULT_FONTS).map(([key, f]) => (
                                            <button key={key} onClick={() => setFont(key)} style={f.style} className={`p-4 rounded-2xl border ${font === key ? `bg-white/10 border-white/30 shadow-lg` : 'border-white/10 hover:bg-white/5'}`}>{f.name}</button>
                                        ))}
                                        {hasCustomFont && <button onClick={() => setFont('custom')} className={`p-4 rounded-2xl border col-span-full ${font === 'custom' ? `bg-white/10 border-white/30 shadow-lg` : 'border-white/10 hover:bg-white/5'}`}>已匯入字體</button>}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Globe size={24} /> 世界時鐘設定</h3>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={18} />
                                    <input
                                        type="text"
                                        placeholder="搜尋城市或時區..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:bg-white/10 transition-colors"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
                                    {filteredZones.map(zone => {
                                        const isSelected = selectedZones.some(z => z.id === zone.id);
                                        return (
                                            <button
                                                key={zone.id}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setSelectedZones(prev => prev.filter(z => z.id !== zone.id));
                                                    } else {
                                                        setSelectedZones(prev => [...prev, zone]);
                                                    }
                                                }}
                                                className={`p-3 rounded-lg text-left flex justify-between items-center transition-all ${isSelected ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
                                            >
                                                <span className="text-sm">{zone.label}</span>
                                                {isSelected && <Check size={16} className="text-blue-400" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </section>
                            <section className="space-y-6">
                                <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Settings size={24} /> 一般設定</h3>
                                <label className="flex items-center justify-between p-6 rounded-2xl bg-white/5 cursor-pointer">
                                    <span>顯示毫秒</span>
                                    <div onClick={() => setShowMillis(!showMillis)} className={`w-14 h-8 rounded-full relative transition-colors ${showMillis ? 'bg-blue-500' : 'bg-slate-600'}`}>
                                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${showMillis ? 'left-7' : 'left-1'}`} />
                                    </div>
                                </label>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Decor */}
            <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${isZenMode ? 'opacity-30' : 'opacity-100'}`}>
                <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-20 bg-blue-500/40 animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-20 bg-purple-500/40 animate-pulse"></div>
            </div>

            {/* Main Card */}
            <div className={`relative z-10 w-full max-w-[90vw] md:max-w-4xl p-8 sm:p-12 rounded-[3rem] transition-all duration-700 ${currentTheme.card} border-t border-l flex flex-col items-center justify-center min-h-[50vh] ${isZenMode ? 'scale-110 shadow-none bg-transparent !border-transparent backdrop-blur-0' : ''}`}>

                {mode === 'clock' && (
                    <div className="flex flex-col items-center select-none">
                        <div className="flex items-baseline font-bold tracking-tighter tabular-nums drop-shadow-2xl">
                            <span className="text-[12vw] sm:text-[150px] leading-none">{h}</span>
                            <span className={`text-[12vw] sm:text-[150px] leading-none animate-pulse ${currentTheme.accent}`}>:</span>
                            <span className="text-[12vw] sm:text-[150px] leading-none">{m}</span>
                            <div className="flex flex-col ml-4 justify-end pb-[2vw] sm:pb-8">
                                <span className="text-[4vw] sm:text-[40px] opacity-50 font-medium">{s}</span>
                                {showMillis && <span className={`text-[2vw] sm:text-[20px] ${currentTheme.accent} opacity-80`}>{ms}</span>}
                            </div>
                        </div>
                        <div className="mt-4 text-xl sm:text-2xl font-light tracking-[0.3em] opacity-80 uppercase text-center">{formatDate(time)}</div>
                    </div>
                )}

                {mode === 'world' && (
                    <div className="flex flex-col items-center select-none w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
                            {selectedZones.map(zone => {
                                const t = getWorldTime(zone.id);
                                return (
                                    <div key={zone.id} className="flex flex-col items-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div className="text-3xl font-bold tracking-tighter">{t.h}:{t.m}</div>
                                        <div className="text-sm opacity-60 mt-2 text-center uppercase tracking-wider">{zone.label.split('(')[0]}</div>
                                        <div className="text-[10px] opacity-40 uppercase tracking-widest">{zone.label.split('(')[1].replace(')', '')}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <button onClick={() => setShowSettings(true)} className="mt-8 flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity">
                            <Settings size={14} /> Add / Edit Zones
                        </button>
                    </div>
                )}

                {mode === 'timer' && (
                    <div className="flex flex-col items-center select-none">
                        <div className="text-[12vw] sm:text-[150px] font-bold tracking-tighter tabular-nums drop-shadow-2xl">
                            {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
                        </div>
                        <div className={`mt-8 flex gap-6 z-50 ${isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all`}>
                                {isTimerRunning ? <Pause size={32} /> : <Play size={32} className={currentTheme.accent} />}
                            </button>
                            <button onClick={() => { setIsTimerRunning(false); setTimerSeconds(timerInitial); }} className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                                <RotateCcw size={32} />
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'pomodoro' && (
                    <div className="flex flex-col items-center select-none">
                        <div className="flex gap-4 mb-4">
                            <button onClick={() => resetPomo('work')} className={`px-4 py-1 rounded-full text-sm border transition-all ${pomoMode === 'work' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50'}`}>Work</button>
                            <button onClick={() => resetPomo('short')} className={`px-4 py-1 rounded-full text-sm border transition-all ${pomoMode === 'short' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50'}`}>Break</button>
                            <button onClick={() => resetPomo('long')} className={`px-4 py-1 rounded-full text-sm border transition-all ${pomoMode === 'long' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50'}`}>Long</button>
                        </div>
                        <div className="text-[12vw] sm:text-[150px] font-bold tracking-tighter tabular-nums drop-shadow-2xl">
                            {Math.floor(pomoSeconds / 60).toString().padStart(2, '0')}:{(pomoSeconds % 60).toString().padStart(2, '0')}
                        </div>
                        <div className={`mt-8 flex gap-6 z-50 ${isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            <button onClick={() => setIsPomoRunning(!isPomoRunning)} className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all`}>
                                {isPomoRunning ? <Pause size={32} /> : <Play size={32} className={currentTheme.accent} />}
                            </button>
                            <button onClick={() => resetPomo(pomoMode)} className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                                <RotateCcw size={32} />
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'stopwatch' && (
                    <div className="flex flex-col items-center select-none w-full min-w-[300px]">
                        <div className="text-[10vw] sm:text-[120px] font-bold tracking-tighter tabular-nums flex items-baseline">
                            <span>{stopwatch.m}</span><span className="opacity-50 mx-1">:</span><span>{stopwatch.s}</span>
                            <span className={`text-[5vw] sm:text-[60px] ml-2 ${currentTheme.accent}`}>.{stopwatch.cs}</span>
                        </div>
                        <div className={`mt-8 flex gap-6 z-50 ${isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            <button onClick={() => setIsStopwatchRunning(!isStopwatchRunning)} className="p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
                                {isStopwatchRunning ? <Pause size={32} /> : <Play size={32} className={currentTheme.accent} />}
                            </button>
                            <button onClick={() => { if (isStopwatchRunning) setLaps([stopwatchTime, ...laps]); else { setStopwatchTime(0); setLaps([]); } }} className="p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
                                {isStopwatchRunning ? <Plus size={32} /> : <RotateCcw size={32} />}
                            </button>
                        </div>
                        <div className="mt-6 w-full max-h-32 overflow-y-auto custom-scrollbar">
                            {laps.map((lap, i) => {
                                const d = formatDuration(lap);
                                return <div key={i} className="flex justify-between px-6 py-2 border-b border-white/5 opacity-80"><span>計次 {laps.length - i}</span><span>{d.m}:{d.s}.{d.cs}</span></div>
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Control */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl transition-all duration-500 z-50 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}>
                <div className="flex bg-white/5 rounded-full p-1 gap-1 overflow-x-auto max-w-[80vw]">
                    <button onClick={() => setMode('clock')} className={`p-3 rounded-full transition-all ${mode === 'clock' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><Clock size={20} /></button>
                    <button onClick={() => setMode('world')} className={`p-3 rounded-full transition-all ${mode === 'world' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><Globe size={20} /></button>
                    <button onClick={() => setMode('timer')} className={`p-3 rounded-full transition-all ${mode === 'timer' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><Timer size={20} /></button>
                    <button onClick={() => setMode('pomodoro')} className={`p-3 rounded-full transition-all ${mode === 'pomodoro' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><Brain size={20} /></button>
                    <button onClick={() => setMode('stopwatch')} className={`p-3 rounded-full transition-all ${mode === 'stopwatch' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><StopCircle size={20} /></button>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex gap-1">
                    <button onClick={() => setShowSettings(true)} className="p-3 rounded-full opacity-80 hover:opacity-100 hover:rotate-90 transition-all"><Settings size={20} /></button>
                    <button onClick={() => setIsZenMode(!isZenMode)} className={`p-3 rounded-full ${isZenMode ? currentTheme.accent : 'opacity-80'}`}><Monitor size={20} /></button>
                    <button onClick={toggleFullscreen} className="p-3 rounded-full opacity-80 hover:opacity-100"><Maximize2 size={20} /></button>
                </div>
            </div>
        </div>
    );
}
createRoot(document.getElementById('root')).render(<App />);
