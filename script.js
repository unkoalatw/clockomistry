import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
    Maximize2, Minimize2, Timer, Clock, Monitor,
    Play, Pause, RotateCcw, AlertCircle, Globe,
    StopCircle, Settings, X, Check, Plus, Search,
    Type, Upload, Palette, ArrowLeft, Coffee, Brain,
    CalendarDays, Languages, Trash2, ChevronLeft, ChevronRight,
    Calendar, CloudSun, Share2, Download, LayoutTemplate, Sparkles, Delete
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

// --- 國際化 (i18n) ---
const I18N = {
    'zh-TW': {
        lang: '繁體中文', locale: 'zh-TW',
        settings: '設定', back: '返回', settingsDesc: '自訂你的質感時鐘',
        appearance: '外觀風格', fonts: '顯示字體', importFont: '匯入字體',
        worldClock: '世界時鐘設定', searchCity: '搜尋城市或時區...',
        general: '一般設定', showMillis: '顯示毫秒', legal: '法律與權利',
        privacy: '隱私權條款', terms: '服務條款', cookies: 'Cookie 條款', disclaimer: '免責聲明',
        language: '語言設定', addEditZones: '新增 / 編輯時區',
        work: '專注', break: '短暫休息', long: '長時間休息',
        lap: '計次', agree: '開始探索',
        splashTitle: 'omistry', splashDesc: '專屬於你的質感時光體驗。',
        splashTerms: '繼續使用即表示您同意我們的使用條款。',
        splashBottom: 'Pure Experience · Local Privacy',
        bgGradient: '背景漸層色', textAccent: '文字 / 強調色', bgImage: '背景圖片',
        uploadImage: '上傳圖片', remove: '移除',
        color1: '色彩1', color2: '色彩2', color3: '色彩3', text: '文字', accent: '強調',
        custom: '自訂', imported: '已匯入字體',
        calendar: '月曆', multiTimer: '多計時器',
        addTimer: '新增計時器', noTimers: '點擊 + 新增計時器',
        mon: '一', tue: '二', wed: '三', thu: '四', fri: '五', sat: '六', sun: '日',
        today: '今天',
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        anniversary: '倒數日', addEvent: '新增事件', eventName: '事件名稱', date: '日期',
        weather: '天氣', temp: '溫度', shareTheme: '分享主題', export: '匯出', import: '導入',
        importPrompt: '請貼上主題代碼', screenSaver: '螢幕保護', ssHint: '移動滑鼠結束',
        daysLeft: '天', daysAgo: '天前',
        fullscreenError: '全螢幕切換失敗', fontLoadError: '字體載入失敗', imageSizeError: '圖片不能超過 5MB',
        invalidThemeCode: '主題代碼錯誤',
        themeModern: '極夜黑', themeLight: '光學白', themeCyber: '霓虹紫', themeForest: '水晶綠', themeCustom: '自訂',
        fontModern: '現代', fontElegant: '經典', fontTechnical: '工程', fontCyber: '未來', fontCustom: '已匯入',
        alarmSound: '計時鈴聲', notifications: '系統通知', soundNone: '無', soundBeep: '嗶嗶聲', soundDigital: '電子錶', soundBell: '清脆鈴聲', testSound: '測試鈴聲',
        "Taipei": "台北", "Tokyo": "東京", "Seoul": "首爾", "Shanghai": "上海", "Hong Kong": "香港",
        "Singapore": "新加坡", "Bangkok": "曼谷", "Dubai": "杜拜", "Kolkata": "加爾各答", "Ho Chi Minh": "胡志明市",
        "London": "倫敦", "Paris": "巴黎", "Berlin": "柏林", "Rome": "羅馬", "Madrid": "馬德里", "Moscow": "莫斯科",
        "Amsterdam": "阿姆斯特丹", "Zurich": "蘇黎世", "New York": "紐約", "Los Angeles": "洛杉磯",
        "Chicago": "芝加哥", "Toronto": "多倫多", "Vancouver": "溫哥華", "São Paulo": "聖保羅",
        "Mexico City": "墨西哥城", "Sydney": "雪梨", "Melbourne": "墨爾本", "Auckland": "奧克蘭",
        "Cairo": "開羅", "Johannesburg": "約翰尼斯堡"
    },
    'en': {
        lang: 'English', locale: 'en-US',
        settings: 'Settings', back: 'Back', settingsDesc: 'Customize your premium clock',
        appearance: 'Appearance', fonts: 'Fonts', importFont: 'Import Font',
        worldClock: 'World Clock', searchCity: 'Search city or timezone...',
        general: 'General', showMillis: 'Show Milliseconds', legal: 'Legal',
        privacy: 'Privacy Policy', terms: 'Terms of Service', cookies: 'Cookie Policy', disclaimer: 'Disclaimer',
        language: 'Language', addEditZones: 'Add / Edit Zones',
        work: 'Work', break: 'Break', long: 'Long Break',
        lap: 'Lap', agree: 'Get Started',
        splashTitle: 'omistry', splashDesc: 'Your premium time experience.',
        splashTerms: 'By continuing, you agree to our terms of use.',
        splashBottom: 'Pure Experience · Local Privacy',
        bgGradient: 'Background Gradient', textAccent: 'Text / Accent', bgImage: 'Background Image',
        uploadImage: 'Upload Image', remove: 'Remove',
        color1: 'Color 1', color2: 'Color 2', color3: 'Color 3', text: 'Text', accent: 'Accent',
        custom: 'Custom', imported: 'Imported Font',
        calendar: 'Calendar', multiTimer: 'Multi Timer',
        addTimer: 'Add Timer', noTimers: 'Tap + to add a timer',
        mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
        today: 'Today',
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        anniversary: 'Anniversary', addEvent: 'Add Event', eventName: 'Event Name', date: 'Date',
        weather: 'Weather', temp: 'Temp', shareTheme: 'Share Theme', export: 'Export', import: 'Import',
        importPrompt: 'Paste theme code here', screenSaver: 'Screen Saver', ssHint: 'Move mouse to exit',
        daysLeft: 'days left', daysAgo: 'days ago',
        fullscreenError: 'Fullscreen Change Failed', fontLoadError: 'Font Load Failed', imageSizeError: 'Image too large (>5MB)',
        invalidThemeCode: 'Invalid Theme Code',
        themeModern: 'Midnight', themeLight: 'Optical', themeCyber: 'Cyber', themeForest: 'Crystal', themeCustom: 'Custom',
        fontModern: 'Modern', fontElegant: 'Elegant', fontTechnical: 'Tech', fontCyber: 'Future', fontCustom: 'Imported',
        alarmSound: 'Alarm Sound', notifications: 'Notifications', soundNone: 'None', soundBeep: 'Beep', soundDigital: 'Digital', soundBell: 'Bell', testSound: 'Test Sound',
        "Taipei": "Taipei", "Tokyo": "Tokyo", "Seoul": "Seoul", "Shanghai": "Shanghai", "Hong Kong": "Hong Kong",
        "Singapore": "Singapore", "Bangkok": "Bangkok", "Dubai": "Dubai", "Kolkata": "Kolkata", "Ho Chi Minh": "Ho Chi Minh",
        "London": "London", "Paris": "Paris", "Berlin": "Berlin", "Rome": "Rome", "Madrid": "Madrid", "Moscow": "Moscow",
        "Amsterdam": "Amsterdam", "Zurich": "Zurich", "New York": "New York", "Los Angeles": "Los Angeles",
        "Chicago": "Chicago", "Toronto": "Toronto", "Vancouver": "Vancouver", "São Paulo": "São Paulo",
        "Mexico City": "Mexico City", "Sydney": "Sydney", "Melbourne": "Melbourne", "Auckland": "Auckland",
        "Cairo": "Cairo", "Johannesburg": "Johannesburg"
    },
    'ja': {
        lang: '日本語', locale: 'ja-JP',
        settings: '設定', back: '戻る', settingsDesc: 'プレミアム時計をカスタマイズ',
        appearance: '外観', fonts: 'フォント', importFont: 'フォントを読込',
        worldClock: '世界時計', searchCity: '都市またはタイムゾーンを検索...',
        general: '一般', showMillis: 'ミリ秒を表示', legal: '法的情報',
        privacy: 'プライバシー', terms: '利用規規約', cookies: 'Cookie', disclaimer: '免責事項',
        language: '言語', addEditZones: 'ゾーンを追加 / 編輯',
        work: '作業', break: '休憩', long: '長時間休憩',
        lap: 'ラップ', agree: '始める',
        splashTitle: 'omistry', splashDesc: 'あなただけの上質な時間體驗。',
        splashTerms: '続行することで利用規約に同意したものとみなされます。',
        splashBottom: 'Pure Experience · Local Privacy',
        bgGradient: '背景グラデーション', textAccent: 'テキスト / アクセント', bgImage: '背景画像',
        uploadImage: '画像をアップ', remove: '削除',
        color1: '色1', color2: '色2', color3: '色3', text: 'テキスト', accent: 'アクセント',
        custom: 'カスタム', imported: '読込済みフォント',
        calendar: 'カレンダー', multiTimer: 'マルチタイマー',
        addTimer: 'タイマーを追加', noTimers: '+ でタイマーを追加',
        mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土', sun: '日',
        today: '今日',
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        anniversary: 'お祝い', addEvent: 'イベント追加', eventName: '名目', date: '日付',
        weather: '天氣', temp: '溫度', shareTheme: 'テーマ共有', export: '書き出し', import: '読み込み',
        importPrompt: 'コードを貼り付け', screenSaver: 'スクリーンセーバー', ssHint: 'マウスを動かして終了',
        daysLeft: '日', daysAgo: '日前',
        fullscreenError: '全畫面切換失敗', fontLoadError: 'フォント読込失敗', imageSizeError: '畫像は 5MB 未満である必要があります',
        invalidThemeCode: 'テーマコードが無効です',
        themeModern: '真夜中', themeLight: 'ライト', themeCyber: 'サイバー', themeForest: 'フォレスト', themeCustom: 'カスタム',
        fontModern: 'モダン', fontElegant: 'エレガント', fontTechnical: 'テック', fontCyber: 'フューチャー', fontCustom: 'カスタム',
        alarmSound: 'アラーム音', notifications: '通知', soundNone: '無し', soundBeep: 'ビープ', soundDigital: 'デジタル', soundBell: 'ベル', testSound: 'テスト音',
        "Taipei": "台北", "Tokyo": "東京", "Seoul": "ソウル", "Shanghai": "上海", "Hong Kong": "香港",
        "Singapore": "シンガポール", "Bangkok": "バンコク", "Dubai": "ドバイ", "Kolkata": "コルカタ", "Ho Chi Minh": "ホーチミン",
        "London": "ロンドン", "Paris": "パリ", "Berlin": "ベルリン", "Rome": "ローマ", "Madrid": "マドリード", "Moscow": "モスクワ",
        "Amsterdam": "アムステルダム", "Zurich": "チューリッヒ", "New York": "ニューヨーク", "Los Angeles": "ロサンゼルス",
        "Chicago": "シカゴ", "Toronto": "トロント", "Vancouver": "バンクーバー", "São Paulo": "サンパウロ",
        "Mexico City": "メキシコシティ", "Sydney": "シドニー", "Melbourne": "メルボルン", "Auckland": "オークランド",
        "Cairo": "カイロ", "Johannesburg": "ヨハネスブルグ"
    }
};

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

// --- Memoized Components ---
const WeatherWidget = React.memo(({ weather, accent }) => (
    <div className="mb-8 flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in opacity-60 hover:opacity-100 transition-opacity">
        <CloudSun size={18} className={accent} />
        <div className="text-sm font-medium">
            {weather.city} · {weather.temp}°C · {weather.condition}
        </div>
    </div>
));

const ClockDisplay = React.memo(({ h, m, s, ms, showMillis, accent, dateLabel }) => (
    <div className="flex flex-col items-center select-none">
        <div className="flex items-baseline font-bold tracking-tighter tabular-nums drop-shadow-2xl">
            <span className="text-[12vw] sm:text-[150px] leading-none">{h}</span>
            <span className={`text-[12vw] sm:text-[150px] leading-none animate-pulse ${accent}`}>:</span>
            <span className="text-[12vw] sm:text-[150px] leading-none">{m}</span>
            <div className="flex flex-col ml-4 justify-end pb-[2vw] sm:pb-8">
                <span className="text-[4vw] sm:text-[40px] opacity-50 font-medium">{s}</span>
                {showMillis && <span className={`text-[2vw] sm:text-[20px] ${accent} opacity-80`}>{ms}</span>}
            </div>
        </div>
        <div className="mt-4 text-xl sm:text-2xl font-light tracking-[0.3em] opacity-80 uppercase text-center">{dateLabel}</div>
    </div>
));

const NavigationBar = React.memo(({ mode, setMode, isZenMode, accent, showControls, toggleFullscreen, setShowSettings, setIsZenMode }) => (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl transition-all duration-500 z-50 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}>
        <div className="flex bg-white/5 rounded-full p-1 gap-1 overflow-x-auto max-w-[90vw]">
            <button onClick={() => setMode('clock')} className={`p-3 rounded-full transition-all ${mode === 'clock' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><Clock size={20} /></button>
            <button onClick={() => setMode('world')} className={`p-3 rounded-full transition-all ${mode === 'world' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><Globe size={20} /></button>
            <button onClick={() => setMode('calendar')} className={`p-3 rounded-full transition-all ${mode === 'calendar' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><CalendarDays size={20} /></button>
            <button onClick={() => setMode('anniversary')} className={`p-3 rounded-full transition-all ${mode === 'anniversary' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><Calendar size={20} /></button>
            <button onClick={() => setMode('timer')} className={`p-3 rounded-full transition-all ${mode === 'timer' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><Timer size={20} /></button>
            <button onClick={() => setMode('pomodoro')} className={`p-3 rounded-full transition-all ${mode === 'pomodoro' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><Brain size={20} /></button>
            <button onClick={() => setMode('stopwatch')} className={`p-3 rounded-full transition-all ${mode === 'stopwatch' ? 'bg-white/20 scale-105' : 'opacity-60'}`}><StopCircle size={20} /></button>
        </div>
        <div className="w-px h-8 bg-white/20"></div>
        <div className="flex gap-1">
            <button onClick={() => setShowSettings(true)} className="p-3 rounded-full opacity-80 hover:opacity-100 hover:rotate-90 transition-all"><Settings size={20} /></button>
            <button onClick={() => setIsZenMode(!isZenMode)} className={`p-3 rounded-full ${isZenMode ? accent : 'opacity-80'}`}><Monitor size={20} /></button>
            <button onClick={toggleFullscreen} className="p-3 rounded-full opacity-80 hover:opacity-100"><Maximize2 size={20} /></button>
        </div>
    </div>
));

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
    const [hasAgreed, setHasAgreed] = useState(() => localStorage.getItem('clock_agreed') === 'true');
    const [customColors, setCustomColors] = useState(() => {
        try { const s = localStorage.getItem('clock_custom_colors'); if (s) return JSON.parse(s); } catch (e) { }
        return { bg1: '#0a0a1a', bg2: '#1a1a3e', bg3: '#0a0a1a', text: '#e2e8f0', accent: '#22d3ee' };
    });
    const [customBgImage, setCustomBgImage] = useState(() => localStorage.getItem('clock_custom_bg') || '');
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('clock_lang');
        if (saved) return saved;
        // 自動偵測瀏覽器語言
        const browserLang = navigator.language.split('-')[0];
        if (I18N[browserLang]) return browserLang;
        if (navigator.language === 'zh-CN' || navigator.language === 'zh-HK') return 'zh-TW';
        return 'zh-TW';
    });

    // Anniversary 狀態
    const [anniversaries, setAnniversaries] = useState(() => {
        try { const s = localStorage.getItem('clock_anniversaries'); if (s) return JSON.parse(s); } catch (e) { }
        return [];
    });

    // Weather 狀態
    const [weather, setWeather] = useState({ temp: '--', condition: '', city: '--' });

    // Screen Saver 狀態
    const [isScreenSaverActive, setIsScreenSaverActive] = useState(false);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [ssPos, setSsPos] = useState({ x: 40, y: 40 });
    const ssVelocity = useRef({ x: 0.15, y: 0.12 });

    // i18n helper
    const t = useCallback((key) => (I18N[lang] || I18N['zh-TW'])[key] || key, [lang]);

    // Timer 狀態
    const [timerSeconds, setTimerSeconds] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerInitial, setTimerInitial] = useState(25 * 60);
    const [isEditingTimer, setIsEditingTimer] = useState(false);
    const [timerInput, setTimerInput] = useState('000000');

    const handleTimerInput = (val) => {
        if (val === 'del') {
            setTimerInput(prev => '0' + prev.slice(0, 5));
        } else if (val === '00') {
            setTimerInput(prev => (prev + '00').slice(-6));
        } else {
            setTimerInput(prev => (prev + val).slice(-6));
        }
    };
    const getTimerInputSeconds = () => {
        const h = parseInt(timerInput.slice(0, 2), 10);
        const m = parseInt(timerInput.slice(2, 4), 10);
        const s = parseInt(timerInput.slice(4, 6), 10);
        return h * 3600 + m * 60 + s;
    };

    // Pomodoro 狀態
    const [pomoMode, setPomoMode] = useState('work'); // 'work', 'short', 'long'
    const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
    const [isPomoRunning, setIsPomoRunning] = useState(false);

    // Alarm & Notification 狀態
    const [alarmSound, setAlarmSound] = useState(() => localStorage.getItem('clock_alarmSound') || 'beep');
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('clock_notifications') === 'true');
    const audioRef = useRef(null);

    const playAlarm = useCallback(() => {
        if (alarmSound === 'none') return;
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = `public/audio/${alarmSound}.ogg`;
        audioRef.current.play().catch(e => console.log('Audio play failed', e));
    }, [alarmSound]);

    const showNotification = useCallback((title, body) => {
        if (!notificationsEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body: body,
                    icon: 'icons/icon-192.png',
                    vibrate: [200, 100, 200, 100, 200, 100, 200]
                });
            });
        } else {
            new Notification(title, { body, icon: 'icons/icon-192.png' });
        }
    }, [notificationsEnabled]);

    const handleToggleNotifications = async () => {
        if (!notificationsEnabled) {
            if (!('Notification' in window)) {
                showError('Browser does not support notifications');
                return;
            }
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') setNotificationsEnabled(true);
            } else if (Notification.permission === 'granted') {
                setNotificationsEnabled(true);
            }
        } else {
            setNotificationsEnabled(false);
        }
    };

    // Stopwatch 狀態
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
    const [laps, setLaps] = useState([]);

    // Multi-Timer 狀態
    const [multiTimers, setMultiTimers] = useState([]);
    const multiTimerIdRef = useRef(0);

    // Calendar 狀態
    const [calendarDate, setCalendarDate] = useState(new Date());

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
    useEffect(() => { localStorage.setItem('clock_agreed', hasAgreed); }, [hasAgreed]);
    useEffect(() => { localStorage.setItem('clock_lang', lang); }, [lang]);
    useEffect(() => { localStorage.setItem('clock_anniversaries', JSON.stringify(anniversaries)); }, [anniversaries]);
    useEffect(() => { localStorage.setItem('clock_alarmSound', alarmSound); }, [alarmSound]);
    useEffect(() => { localStorage.setItem('clock_notifications', notificationsEnabled); }, [notificationsEnabled]);

    // 螢幕保護自動偵測
    useEffect(() => {
        const updateActivity = () => {
            setLastActivity(Date.now());
            if (isScreenSaverActive) setIsScreenSaverActive(false);
        };
        const events = ['mousemove', 'keydown', 'touchstart', 'scroll'];
        events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));
        return () => events.forEach(e => window.removeEventListener(e, updateActivity));
    }, [isScreenSaverActive]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isScreenSaverActive && Date.now() - lastActivity > 5 * 60 * 1000) {
                setIsScreenSaverActive(true);
            }
        }, 30000); // 降低檢測頻率
        return () => clearInterval(interval);
    }, [lastActivity, isScreenSaverActive]);

    // 螢幕保護位移邏輯 - 優化版 (使用 CSS Transition 代替每幀更新)
    useEffect(() => {
        if (!isScreenSaverActive) return;
        const move = () => {
            setSsPos({
                x: Math.random() * 70 + 5,
                y: Math.random() * 80 + 5
            });
        };
        move();
        const interval = setInterval(move, 4000); // 每 4 秒更換目標
        return () => clearInterval(interval);
    }, [isScreenSaverActive]);

    // 天氣抓取
    const fetchWeather = async () => {
        try {
            // 使用 IP-API 獲取大致位置
            const locRes = await fetch('https://ipapi.co/json/');
            const loc = await locRes.json();
            const { latitude, longitude, city } = loc;

            // 使用 Open-Meteo 獲取天氣
            const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const wData = await wRes.json();
            const code = wData.current_weather.weathercode;

            // 簡易天氣代碼轉中文/英文
            const conditionMap = {
                0: 'Clear', 1: 'Cloudy', 2: 'Cloudy', 3: 'Overcast',
                45: 'Fog', 48: 'Fog', 51: 'Drizzle', 61: 'Rain',
                71: 'Snow', 95: 'Storm'
            };

            setWeather({
                temp: Math.round(wData.current_weather.temperature),
                condition: conditionMap[code] || 'Cloudy',
                city: city
            });
        } catch (e) { console.error('Weather fetch error:', e); }
    };

    useEffect(() => {
        fetchWeather();
        const interval = setInterval(fetchWeather, 30 * 60 * 1000); // 30分鐘更新一次
        return () => clearInterval(interval);
    }, []);

    // Multi-Timer 計時邏輯
    useEffect(() => {
        const hasRunning = multiTimers.some(t => t.running && t.remaining > 0);
        if (!hasRunning) return;
        const interval = setInterval(() => {
            setMultiTimers(prev => prev.map(t => {
                if (!t.running || t.remaining <= 0) return t;
                const next = t.remaining - 1;
                if (next <= 0) {
                    playAlarm();
                    showNotification('Timer Finished', `Timer ${t.label} has finished`);
                    return { ...t, remaining: 0, running: false };
                }
                return { ...t, remaining: next };
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, [multiTimers, playAlarm, showNotification]);

    const addMultiTimer = (minutes = 5) => {
        multiTimerIdRef.current += 1;
        setMultiTimers(prev => [...prev, { id: multiTimerIdRef.current, label: `${minutes}:00`, initial: minutes * 60, remaining: minutes * 60, running: false }]);
    };
    const toggleMultiTimer = (id) => setMultiTimers(prev => prev.map(t => t.id === id ? { ...t, running: !t.running } : t));
    const resetMultiTimer = (id) => setMultiTimers(prev => prev.map(t => t.id === id ? { ...t, remaining: t.initial, running: false } : t));
    const deleteMultiTimer = (id) => setMultiTimers(prev => prev.filter(t => t.id !== id));

    // --- 主題匯出導入 ---
    const exportTheme = () => {
        const data = { theme, font, customColors, customBgImage };
        const code = btoa(JSON.stringify(data));
        navigator.clipboard.writeText(code);
    };

    const importTheme = (code) => {
        if (!code) return;
        try {
            const data = JSON.parse(atob(code));
            if (data.theme) setTheme(data.theme);
            if (data.font) setFont(data.font);
            if (data.customColors) setCustomColors(data.customColors);
            if (data.customBgImage !== undefined) setCustomBgImage(data.customBgImage);
        } catch (e) { setErrorMsg(t('invalidThemeCode')); setTimeout(() => setErrorMsg(''), 3000); }
    };

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
            showError(t('fontLoadError'));
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
        if (file.size > 5 * 1024 * 1024) { showError(t('imageSizeError')); return; }
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
        } else if (isPomoRunning && pomoSeconds === 0) {
            setIsPomoRunning(false);
            playAlarm();
            showNotification('Pomodoro Finished', `${t(pomoMode)} section is complete`);

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
    }, [isPomoRunning, pomoSeconds, pomoMode, playAlarm, showNotification, t]);

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
        } else if (isTimerRunning && timerSeconds === 0) {
            playAlarm();
            showNotification('Timer Finished', 'Your timer has finished');
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerSeconds, playAlarm, showNotification]);

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
            showError(t('fullscreenError'));
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

    const formatDate = (date) => date.toLocaleDateString(t('locale'), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

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
        name: 'themeCustom', bg: '', text: '', accent: 'custom-accent',
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
                            <span>{t('back')}</span>
                        </button>
                        <h2 className="text-4xl font-bold tracking-wider mb-2">{t('settings')}</h2>
                        <p className="opacity-50 text-lg">{t('settingsDesc')}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                        <div className="max-w-3xl mx-auto space-y-12 pb-20">
                            <section className="space-y-6">
                                <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Palette size={24} /> {t('appearance')}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {Object.entries(DEFAULT_THEMES).map(([key, thm]) => (
                                        <button key={key} onClick={() => setTheme(key)} className={`flex flex-col items-center gap-4 p-6 rounded-3xl transition-all border ${theme === key ? `bg-white/10 border-white/50 scale-105` : 'border-white/5 hover:bg-white/5'}`}>
                                            <div className={`w-12 h-12 rounded-full ${thm.bg.includes('gray-50') ? 'bg-gray-300' : thm.bg}`}></div>
                                            <span className="text-sm">{t(thm.name)}</span>
                                        </button>
                                    ))}
                                    <button onClick={() => setTheme('custom')} className={`flex flex-col items-center gap-4 p-6 rounded-3xl transition-all border ${theme === 'custom' ? 'bg-white/10 border-white/50 scale-105' : 'border-white/5 hover:bg-white/5'}`}>
                                        <div className="w-12 h-12 rounded-full border border-white/20" style={{ background: `linear-gradient(135deg, ${customColors.bg1}, ${customColors.bg2}, ${customColors.bg3})` }}></div>
                                        <span className="text-sm">{t('custom')}</span>
                                    </button>
                                </div>
                                {theme === 'custom' && (
                                    <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        <div>
                                            <span className="text-sm font-medium opacity-80" style={{ display: 'block', marginBottom: 12 }}>{t('bgGradient')}</span>
                                            <div className="flex gap-4 items-center">
                                                {[['bg1', t('color1')], ['bg2', t('color2')], ['bg3', t('color3')]].map(([k, l]) => (
                                                    <label key={k} className="flex flex-col items-center gap-1 cursor-pointer">
                                                        <input type="color" value={customColors[k]} onChange={(e) => updateCustomColor(k, e.target.value)} style={{ width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                                                        <span className="opacity-50" style={{ fontSize: 10 }}>{l}</span>
                                                    </label>
                                                ))}
                                                <div className="flex-1 rounded-lg border border-white/10" style={{ height: 40, background: `linear-gradient(135deg, ${customColors.bg1}, ${customColors.bg2}, ${customColors.bg3})` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium opacity-80" style={{ display: 'block', marginBottom: 12 }}>{t('textAccent')}</span>
                                            <div className="flex gap-4 items-center">
                                                {[['text', t('text')], ['accent', t('accent')]].map(([k, l]) => (
                                                    <label key={k} className="flex flex-col items-center gap-1 cursor-pointer">
                                                        <input type="color" value={customColors[k]} onChange={(e) => updateCustomColor(k, e.target.value)} style={{ width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                                                        <span className="opacity-50" style={{ fontSize: 10 }}>{l}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium opacity-80" style={{ display: 'block', marginBottom: 12 }}>{t('bgImage')}</span>
                                            <div className="flex gap-3 items-center">
                                                <button onClick={() => bgImageInputRef.current.click()} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm"><Upload size={14} /> {t('uploadImage')}</button>
                                                {customBgImage && <button onClick={() => setCustomBgImage('')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm opacity-60 hover:opacity-100"><X size={14} /> {t('remove')}</button>}
                                                <input type="file" ref={bgImageInputRef} className="hidden" accept="image/*" onChange={handleBgImageUpload} />
                                            </div>
                                            {customBgImage && <div className="w-full rounded-xl overflow-hidden border border-white/10" style={{ height: 96, marginTop: 12 }}><img src={customBgImage} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} /></div>}
                                        </div>
                                    </div>
                                )}
                                <div className="pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg opacity-80">{t('fonts')}</span>
                                        <button onClick={() => fileInputRef.current.click()} className="text-sm flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"><Upload size={14} /> {t('importFont')}</button>
                                        <input type="file" ref={fileInputRef} className="hidden" accept=".ttf,.otf,.woff" onChange={handleFontUpload} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {Object.entries(DEFAULT_FONTS).map(([key, f]) => (
                                            <button key={key} onClick={() => setFont(key)} style={f.style} className={`p-4 rounded-2xl border ${font === key ? `bg-white/10 border-white/30 shadow-lg` : 'border-white/10 hover:bg-white/5'}`}>{t(f.name)}</button>
                                        ))}
                                        {hasCustomFont && <button onClick={() => setFont('custom')} className={`p-4 rounded-2xl border col-span-full ${font === 'custom' ? `bg-white/10 border-white/30 shadow-lg` : 'border-white/10 hover:bg-white/5'}`}>{t('imported')}</button>}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Globe size={24} /> {t('worldClock')}</h3>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={18} />
                                    <input
                                        type="text"
                                        placeholder={t('searchCity')}
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
                                                <span className="text-sm">{t(zone.label)}</span>
                                                {isSelected && <Check size={16} className="text-blue-400" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </section>
                            <section className="space-y-6">
                                <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Settings size={24} /> {t('general')}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className="flex items-center justify-between p-6 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                        <span>{t('showMillis')}</span>
                                        <div onClick={() => setShowMillis(!showMillis)} className={`w-14 h-8 rounded-full relative transition-colors ${showMillis ? 'bg-blue-500' : 'bg-slate-600'}`}>
                                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${showMillis ? 'left-7' : 'left-1'}`} />
                                        </div>
                                    </label>
                                    <label className="flex items-center justify-between p-6 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                        <span>{t('notifications')}</span>
                                        <div onClick={handleToggleNotifications} className={`w-14 h-8 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-blue-500' : 'bg-slate-600'}`}>
                                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`} />
                                        </div>
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium opacity-80">{t('alarmSound')}</span>
                                        <button onClick={playAlarm} className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">{t('testSound')}</button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {['none', 'beep', 'digital', 'bell'].map(sk => (
                                            <button
                                                key={sk}
                                                onClick={() => setAlarmSound(sk)}
                                                className={`p-4 rounded-xl text-center text-sm transition-all border ${alarmSound === sk ? 'bg-white/10 border-white/50 scale-105' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                            >
                                                {t(`sound${sk.charAt(0).toUpperCase() + sk.slice(1)}`)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Languages size={24} /> {t('language')}</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {Object.entries(I18N).map(([key, val]) => (
                                        <button key={key} onClick={() => setLang(key)} className={`p-4 rounded-2xl border text-center text-sm transition-all ${lang === key ? 'bg-white/10 border-white/50 scale-105' : 'border-white/5 hover:bg-white/5'}`}>{val.lang}</button>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Share2 size={24} /> {t('shareTheme')}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={exportTheme} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center gap-2 transition-all">
                                        <Download size={20} />
                                        <span>{t('export')}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const code = prompt(t('importPrompt'));
                                            importTheme(code);
                                        }}
                                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center gap-2 transition-all"
                                    >
                                        <LayoutTemplate size={20} />
                                        <span>{t('import')}</span>
                                    </button>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><AlertCircle size={24} /> {t('legal')}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <a href="privacy.html" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all">{t('privacy')}</a>
                                    <a href="terms.html" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all">{t('terms')}</a>
                                    <a href="cookies.html" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all">{t('cookies')}</a>
                                    <a href="disclaimer.html" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all">{t('disclaimer')}</a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Full-Screen Welcome Splash */}
            {!hasAgreed && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none" style={{ background: 'linear-gradient(160deg, #020420 0%, #0a1628 30%, #111d3a 50%, #0d1a2f 70%, #040812 100%)' }}>
                    {/* Animated gradient orbs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute w-[80vw] h-[80vw] rounded-full bg-blue-600/8 blur-[120px] -top-[20%] -left-[20%] animate-pulse" />
                        <div className="absolute w-[60vw] h-[60vw] rounded-full bg-indigo-500/8 blur-[100px] -bottom-[10%] -right-[10%] animate-pulse" style={{ animationDelay: '2s' }} />
                        <div className="absolute w-[40vw] h-[40vw] rounded-full bg-cyan-500/5 blur-[80px] top-[40%] left-[50%] -translate-x-1/2 animate-pulse" style={{ animationDelay: '4s' }} />
                    </div>

                    {/* Subtle grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                    {/* Main Content */}
                    <div className="relative flex flex-col items-center text-center px-8 max-w-xl space-y-10">

                        {/* Logo / Brand Mark */}
                        <div className="relative mb-2">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-blue-500/10">
                                <Clock size={36} className="text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.4)]" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-4">
                            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[0.9]">
                                Clock<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">omistry</span>
                            </h1>

                            {/* Splash Language Toggle */}
                            <div className="flex gap-2 justify-center mt-6">
                                {Object.entries(I18N).map(([key, val]) => (
                                    <button
                                        key={key}
                                        onClick={() => setLang(key)}
                                        className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border transition-all ${lang === key ? 'bg-white/10 border-white/40' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                    >
                                        {val.lang}
                                    </button>
                                ))}
                            </div>

                            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-md mx-auto font-light mt-6">
                                {t('splashDesc')}<br className="hidden sm:block" />{t('splashTerms')}
                            </p>
                        </div>

                        {/* Legal Links Row */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {[
                                { label: t('privacy'), href: 'privacy.html' },
                                { label: t('terms'), href: 'terms.html' },
                                { label: t('cookies'), href: 'cookies.html' },
                                { label: t('disclaimer'), href: 'disclaimer.html' }
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    className="px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.15] text-xs font-medium text-slate-500 hover:text-slate-300 transition-all duration-300"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => setHasAgreed(true)}
                            className="group relative px-12 py-5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-base tracking-wide transition-all duration-300 hover:shadow-[0_0_60px_-12px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95"
                        >
                            <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                            <span className="relative">{t('agree')}</span>
                        </button>
                    </div>

                    {/* Bottom attribution */}
                    <div className="absolute bottom-8 text-[10px] text-slate-600 tracking-[0.3em] uppercase">
                        {t('splashBottom')}
                    </div>
                </div>
            )}

            {/* Screen Saver Overaly */}
            {isScreenSaverActive && (
                <div className="fixed inset-0 z-[200] bg-black select-none cursor-none flex items-center justify-center">
                    <div
                        className="absolute flex flex-col items-center transition-all duration-[4000ms] ease-linear"
                        style={{ left: `${ssPos.x}%`, top: `${ssPos.y}%` }}
                    >
                        <div className="text-8xl sm:text-[120px] font-bold tracking-tighter opacity-80">
                            {h}<span className="animate-pulse">:</span>{m}
                        </div>
                        <div className="mt-4 text-sm opacity-20 tracking-[1em] uppercase">{t('ssHint')}</div>
                    </div>
                </div>
            )}

            {/* Decor - Optimized blurs for performance */}
            <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${isZenMode ? 'opacity-20' : 'opacity-100'}`}>
                <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-10 bg-blue-500/30"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-10 bg-purple-500/30"></div>
            </div>

            {/* Main Card */}
            <div className={`relative z-10 w-full max-w-[90vw] md:max-w-4xl p-8 sm:p-12 rounded-[3rem] transition-all duration-700 ${currentTheme.card} border-t border-l flex flex-col items-center justify-center min-h-[50vh] ${isZenMode ? 'scale-110 shadow-none bg-transparent !border-transparent backdrop-blur-0' : ''}`}>

                {mode === 'clock' && (
                    <div className="flex flex-col items-center select-none">
                        <WeatherWidget weather={weather} accent={currentTheme.accent} />
                        <ClockDisplay h={h} m={m} s={s} ms={ms} showMillis={showMillis} accent={currentTheme.accent} dateLabel={formatDate(time)} />
                    </div>
                )}

                {mode === 'world' && (
                    <div className="flex flex-col items-center select-none w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
                            {selectedZones.map(zone => {
                                const tWorld = getWorldTime(zone.id);
                                return (
                                    <div key={zone.id} className="flex flex-col items-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div className="text-3xl font-bold tracking-tighter">{tWorld.h}:{tWorld.m}</div>
                                        <div className="text-sm opacity-60 mt-2 text-center uppercase tracking-wider">{t(zone.label)}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <button onClick={() => setShowSettings(true)} className="mt-8 flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity">
                            <Settings size={14} /> {t('addEditZones')}
                        </button>
                    </div>
                )}

                {mode === 'timer' && (
                    <div className="flex flex-col items-center select-none w-full max-w-lg">
                        <div className="flex flex-col items-center mb-12 w-full">
                            {isEditingTimer ? (
                                <div className="flex flex-col items-center w-full animate-fade-in">
                                    <div className="text-[8vw] sm:text-[80px] font-bold tracking-tighter tabular-nums drop-shadow-2xl flex items-baseline gap-2 mb-6">
                                        <span className={timerInput.slice(0, 2) === '00' ? 'opacity-30' : ''}>{timerInput.slice(0, 2)}<span className="text-2xl opacity-50 ml-1">h</span></span>
                                        <span className={timerInput.slice(0, 4) === '0000' ? 'opacity-30' : ''}>{timerInput.slice(2, 4)}<span className="text-2xl opacity-50 ml-1">m</span></span>
                                        <span className={timerInput === '000000' ? 'opacity-30' : ''}>{timerInput.slice(4, 6)}<span className="text-2xl opacity-50 ml-1">s</span></span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[280px]">
                                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'del'].map(btn => (
                                            <button key={btn} onClick={() => handleTimerInput(btn)} className="h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-2xl font-medium transition-all active:scale-95">
                                                {btn === 'del' ? <Delete size={24} /> : btn}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-8 flex gap-6 z-50">
                                        <button onClick={() => setIsEditingTimer(false)} className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                                            <X size={32} />
                                        </button>
                                        <button onClick={() => {
                                            const sec = getTimerInputSeconds();
                                            if (sec > 0) {
                                                setTimerInitial(sec);
                                                setTimerSeconds(sec);
                                                setIsEditingTimer(false);
                                                setIsTimerRunning(true);
                                            } else {
                                                setIsEditingTimer(false);
                                            }
                                        }} className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all`}>
                                            <Play size={32} className={currentTheme.accent} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div
                                        className="text-[10vw] sm:text-[120px] font-bold tracking-tighter tabular-nums drop-shadow-2xl cursor-pointer hover:opacity-80 transition-opacity flex items-baseline gap-2"
                                        onClick={() => {
                                            if (!isTimerRunning) {
                                                setIsEditingTimer(true);
                                                setTimerInput('000000');
                                            }
                                        }}
                                    >
                                        {timerSeconds >= 3600 && <span>{Math.floor(timerSeconds / 3600).toString().padStart(2, '0')}<span className="text-[4vw] sm:text-[40px] opacity-50 ml-1">h</span></span>}
                                        <span>{Math.floor((timerSeconds % 3600) / 60).toString().padStart(2, '0')}<span className="text-[4vw] sm:text-[40px] opacity-50 ml-1">m</span></span>
                                        <span>{(timerSeconds % 60).toString().padStart(2, '0')}<span className="text-[4vw] sm:text-[40px] opacity-50 ml-1">s</span></span>
                                    </div>
                                    <div className={`mt-8 flex gap-6 z-50 ${isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                        <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all`}>
                                            {isTimerRunning ? <Pause size={32} /> : <Play size={32} className={currentTheme.accent} />}
                                        </button>
                                        <button onClick={() => { setIsTimerRunning(false); setTimerSeconds(timerInitial); }} className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                                            <RotateCcw size={32} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Integrated Multi-Timers */}
                        <div className="w-full max-h-[40vh] overflow-y-auto custom-scrollbar space-y-3 p-2 border-t border-white/10 pt-8">
                            {multiTimers.map(timer => {
                                const mins = Math.floor(timer.remaining / 60).toString().padStart(2, '0');
                                const secs = (timer.remaining % 60).toString().padStart(2, '0');
                                const pct = timer.initial > 0 ? (timer.remaining / timer.initial) * 100 : 0;
                                return (
                                    <div key={timer.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <div className="flex-1">
                                            <div className="text-3xl font-bold tabular-nums tracking-tighter">{mins}:{secs}</div>
                                            <div className="w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-1000 ${pct > 20 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => toggleMultiTimer(timer.id)} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                                                {timer.running ? <Pause size={18} /> : <Play size={18} className={currentTheme.accent} />}
                                            </button>
                                            <button onClick={() => resetMultiTimer(timer.id)} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"><RotateCcw size={18} /></button>
                                            <button onClick={() => deleteMultiTimer(timer.id)} className="p-2.5 rounded-full bg-white/10 hover:bg-red-500/30 transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className={`flex flex-wrap justify-center gap-3 pt-4 ${isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                {[1, 3, 5, 10, 15, 30].map(m => (
                                    <button key={m} onClick={() => addMultiTimer(m)} className="px-4 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 text-sm transition-all">+{m}m</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {mode === 'pomodoro' && (
                    <div className="flex flex-col items-center select-none">
                        <div className="flex gap-4 mb-4">
                            <button onClick={() => resetPomo('work')} className={`px-4 py-1 rounded-full text-sm border transition-all ${pomoMode === 'work' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50'}`}>{t('work')}</button>
                            <button onClick={() => resetPomo('short')} className={`px-4 py-1 rounded-full text-sm border transition-all ${pomoMode === 'short' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50'}`}>{t('break')}</button>
                            <button onClick={() => resetPomo('long')} className={`px-4 py-1 rounded-full text-sm border transition-all ${pomoMode === 'long' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50'}`}>{t('long')}</button>
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
                                return <div key={i} className="flex justify-between px-6 py-2 border-b border-white/5 opacity-80"><span>{t('lap')} {laps.length - i}</span><span>{d.m}:{d.s}.{d.cs}</span></div>
                            })}
                        </div>
                    </div>
                )}

                {mode === 'calendar' && (() => {
                    const year = calendarDate.getFullYear();
                    const month = calendarDate.getMonth();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const today = new Date();
                    const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
                    const isTodayDate = (d) => d === today.getDate() && isCurrentMonth;

                    // Sunday-start like Google Calendar
                    const firstDayOfWeek = new Date(year, month, 1).getDay();
                    const prevMonthDays = new Date(year, month, 0).getDate();

                    // Build 6 rows × 7 cols = 42 cells
                    const cells = [];
                    for (let i = firstDayOfWeek - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, type: 'prev' });
                    for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, type: 'current' });
                    let nextDay = 1;
                    while (cells.length < 42) cells.push({ day: nextDay++, type: 'next' });

                    const dayLabels = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
                    const monthNames = (I18N[lang] || I18N['zh-TW']).months;
                    const grid7 = { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' };

                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 540, userSelect: 'none' }}>
                            {/* Top Bar — Google Calendar style */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <button
                                    onClick={() => setCalendarDate(new Date())}
                                    style={{ padding: '8px 20px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.2)', fontSize: 14, fontWeight: 500, background: 'transparent', color: 'inherit', cursor: 'pointer' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {t('today')}
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} style={{ padding: 6, borderRadius: '50%', background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><ChevronLeft size={22} /></button>
                                    <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} style={{ padding: 6, borderRadius: '50%', background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><ChevronRight size={22} /></button>
                                </div>
                                <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em' }}>
                                    {monthNames[month]} {year}
                                </span>
                            </div>

                            {/* Weekday Headers */}
                            <div style={{ ...grid7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                {dayLabels.map((d, i) => (
                                    <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 500, padding: '8px 0', color: i === 0 ? 'rgba(248,113,113,0.7)' : i === 6 ? 'rgba(96,165,250,0.6)' : 'rgba(255,255,255,0.4)' }}>
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Date Grid */}
                            <div style={grid7}>
                                {cells.map((cell, i) => {
                                    const colIndex = i % 7;
                                    const isToday = cell.type === 'current' && isTodayDate(cell.day);
                                    const isSun = colIndex === 0;
                                    const isSat = colIndex === 6;
                                    const borderStyle = '1px solid rgba(255,255,255,0.05)';

                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                position: 'relative',
                                                minHeight: 56,
                                                borderBottom: borderStyle,
                                                borderRight: borderStyle,
                                                borderLeft: colIndex === 0 ? borderStyle : 'none'
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute',
                                                top: 6,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 28,
                                                height: 28,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 13,
                                                borderRadius: '50%',
                                                fontWeight: isToday ? 700 : 400,
                                                background: isToday ? '#3b82f6' : 'transparent',
                                                color: isToday ? '#fff'
                                                    : cell.type !== 'current' ? 'rgba(255,255,255,0.2)'
                                                        : isSun ? 'rgba(248,113,113,0.8)'
                                                            : isSat ? 'rgba(96,165,250,0.7)'
                                                                : 'inherit',
                                                transition: 'all 0.15s'
                                            }}>
                                                {cell.day}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}


                {mode === 'anniversary' && (
                    <div className="flex flex-col items-center select-none w-full max-w-lg">
                        <div className="w-full max-h-[50vh] overflow-y-auto custom-scrollbar space-y-4 p-2">
                            {anniversaries.length === 0 && (
                                <div className="text-center opacity-40 py-12">
                                    <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-lg">{t('addEvent')}</p>
                                </div>
                            )}
                            {anniversaries.map(ev => {
                                const target = new Date(ev.date);
                                const diff = target - new Date();
                                const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                const isFuture = days >= 0;

                                return (
                                    <div key={ev.id} className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10 group hover:bg-white/10 transition-all">
                                        <div>
                                            <div className="text-xl font-bold">{ev.label}</div>
                                            <div className="text-xs opacity-40 mt-1 uppercase tracking-widest">{ev.date}</div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className={`text-3xl font-black ${isFuture ? currentTheme.accent : 'opacity-40'}`}>
                                                    {Math.abs(days)}
                                                </div>
                                                <div className="text-[10px] opacity-40 uppercase tracking-tighter">
                                                    {isFuture ? t('daysLeft') : t('daysAgo')}
                                                </div>
                                            </div>
                                            <button onClick={() => setAnniversaries(prev => prev.filter(a => a.id !== ev.id))} className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => {
                                const label = prompt(t('eventName'));
                                const date = prompt(t('date'), '2026-01-01');
                                if (label && date) setAnniversaries([...anniversaries, { id: Date.now(), label, date }]);
                            }}
                            className="mt-8 px-8 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center gap-2 transition-all"
                        >
                            <Plus size={20} /> {t('addEvent')}
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Control */}
            <NavigationBar
                mode={mode}
                setMode={setMode}
                isZenMode={isZenMode}
                accent={currentTheme.accent}
                showControls={showControls}
                toggleFullscreen={toggleFullscreen}
                setShowSettings={setShowSettings}
                setIsZenMode={setIsZenMode}
            />
        </div>
    );
}
createRoot(document.getElementById('root')).render(<App />);
