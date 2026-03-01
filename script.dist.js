function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(15);
  }
};
const triggerSuccess = () => {
  triggerHaptic();
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([30, 50, 30]);
  }
  confetti({
    particleCount: 150,
    spread: 100,
    origin: {
      y: 0.6
    },
    colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
    disableForReducedMotion: true
  });
};
import { Maximize2, Minimize2, Timer, Clock, Monitor, Play, Pause, RotateCcw, AlertCircle, Globe, StopCircle, Settings, X, Check, Plus, Search, Type, Upload, Palette, ArrowLeft, Coffee, Brain, CalendarDays, Languages, Trash2, ChevronLeft, ChevronRight, Calendar, CloudSun, Share2, Download, LayoutTemplate, Sparkles, Delete, Camera, CheckSquare, BarChart2, Sliders, Target, Sunrise, Sunset, LayoutGrid, LayoutPanelTop, RefreshCw } from 'lucide-react';
const APP_VERSION = '1.3.0';

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
const saveFontToDB = async data => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(data, 'customFont');
  return new Promise(resolve => tx.oncomplete = resolve);
};
const getFontFromDB = async () => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const request = tx.objectStore(STORE_NAME).get('customFont');
  return new Promise(resolve => request.onsuccess = () => resolve(request.result));
};

// --- 國際化 (i18n) ---
const I18N = {
  'zh-TW': {
    lang: '繁體中文',
    locale: 'zh-TW',
    settings: '設定',
    back: '返回',
    settingsDesc: '自訂你的質感時鐘',
    appearance: '外觀風格',
    fonts: '顯示字體',
    importFont: '匯入字體',
    worldClock: '世界時鐘設定',
    searchCity: '搜尋城市或時區...',
    general: '一般設定',
    showMillis: '顯示毫秒',
    legal: '法律與權利',
    privacy: '隱私權條款',
    terms: '服務條款',
    cookies: 'Cookie 條款',
    disclaimer: '免責聲明',
    language: '語言設定',
    addEditZones: '新增 / 編輯時區',
    work: '專注',
    break: '短暫休息',
    long: '長時間休息',
    lap: '計次',
    agree: '開始探索',
    splashTitle: 'omistry',
    splashDesc: '專屬於你的質感時光體驗。',
    splashTerms: '繼續使用即表示您同意我們的使用條款。',
    splashBottom: 'Pure Experience · Local Privacy',
    bgGradient: '背景漸層色',
    textAccent: '文字 / 強調色',
    bgImage: '背景圖片',
    uploadImage: '上傳圖片',
    remove: '移除',
    color1: '色彩1',
    color2: '色彩2',
    color3: '色彩3',
    text: '文字',
    accent: '強調',
    custom: '自訂',
    imported: '已匯入字體',
    calendar: '月曆',
    multiTimer: '多計時器',
    addTimer: '新增計時器',
    noTimers: '點擊 + 新增計時器',
    mon: '一',
    tue: '二',
    wed: '三',
    thu: '四',
    fri: '五',
    sat: '六',
    sun: '日',
    today: '今天',
    sunrise: '日出',
    sunset: '日落',
    memento: '生命日曆',
    birthDate: '您的出生日期',
    livedWeeks: '已度過的週數',
    totalWeeks: '總週數 (約 80 年)',
    miniMode: '懸浮/迷你模式',
    exitMiniMode: '退出迷你模式',
    tabTimer: '計時器',
    tabPomodoro: '番茄鐘',
    tabStopwatch: '碼表',
    tabMonthly: '月曆視圖',
    tabEvents: '事件與倒數',
    tabLife: '生命日曆',
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    anniversary: '倒數日',
    addEvent: '新增事件',
    eventName: '事件名稱',
    date: '日期',
    weather: '天氣',
    temp: '溫度',
    shareTheme: '分享主題',
    export: '匯出',
    import: '導入',
    importPrompt: '請貼上主題代碼',
    screenSaver: '螢幕保護',
    ssHint: '移動滑鼠結束',
    daysLeft: '天',
    daysAgo: '天前',
    fullscreenError: '全螢幕切換失敗',
    fontLoadError: '字體載入失敗',
    imageSizeError: '圖片不能超過 5MB',
    invalidThemeCode: '主題代碼錯誤',
    themeModern: '極夜黑',
    themeLight: '光學白',
    themeCyber: '霓虹紫',
    themeForest: '水晶綠',
    themeCustom: '自訂',
    fontModern: '現代',
    fontElegant: '經典',
    fontTechnical: '工程',
    fontCyber: '未來',
    fontCustom: '已匯入',
    alarmSound: '計時鈴聲',
    notifications: '系統通知',
    soundNone: '無',
    soundBeep: '嗶嗶聲',
    soundDigital: '電子錶',
    soundBell: '清脆鈴聲',
    testSound: '測試鈴聲',
    showProgressRing: '動態進度環',
    enableMiniTask: '微型任務管理',
    enableFocusAnalytics: '專注數據統計',
    enableMeetingPlanner: '智慧時區規劃器',
    focusGoal: '當前專注目標',
    focusStats: '專注時長統計',
    exportImage: '輸出為主題照片',
    exporting: '正在生成...',
    ringPosition: '進度環位置',
    ringLeft: '數字左側',
    ringRight: '數字右側',
    ringBackground: '背景置中',
    autoZenMode: '計時自動進入專注模式',
    downloadApp: '下載 Android 原生版',
    downloadingApp: '正在取得下載連結...',
    appDesc: '安裝 APK 以獲得更流暢的效能與震動回饋',
    updateTitle: '更新與版本',
    currentVersion: '目前版本',
    checkUpdate: '檢查更新',
    checking: '檢查中...',
    upToDate: '已是最新版本！',
    newVersion: '有新版本',
    updateNow: '立即更新',
    updateDesc: '確保您的 Clockomistry 始終保持最新狀態',
    clearData: '清除所有資料',
    clearDataDesc: '將刪除本機所有設定、檔案記錄和快取。此操作無法復原。',
    clearDataConfirm: '確認刪除所有資料？',
    clearDataDone: '資料已清除，即將重新載入…',
    clearDataBtn: '清除資料',
    "Taipei": "台北",
    "Tokyo": "東京",
    "Seoul": "首爾",
    "Shanghai": "上海",
    "Hong Kong": "香港",
    "Singapore": "新加坡",
    "Bangkok": "曼谷",
    "Dubai": "杜拜",
    "Kolkata": "加爾各答",
    "Ho Chi Minh": "胡志明市",
    "London": "倫敦",
    "Paris": "巴黎",
    "Berlin": "柏林",
    "Rome": "羅馬",
    "Madrid": "馬德里",
    "Moscow": "莫斯科",
    "Amsterdam": "阿姆斯特丹",
    "Zurich": "蘇黎世",
    "New York": "紐約",
    "Los Angeles": "洛杉磯",
    "Chicago": "芝加哥",
    "Toronto": "多倫多",
    "Vancouver": "溫哥華",
    "São Paulo": "聖保羅",
    "Mexico City": "墨西哥城",
    "Sydney": "雪梨",
    "Melbourne": "墨爾本",
    "Auckland": "奧克蘭",
    "Cairo": "開羅",
    "Johannesburg": "約翰尼斯堡"
  },
  'en': {
    lang: 'English',
    locale: 'en-US',
    settings: 'Settings',
    back: 'Back',
    settingsDesc: 'Customize your premium clock',
    appearance: 'Appearance',
    fonts: 'Fonts',
    importFont: 'Import Font',
    worldClock: 'World Clock',
    searchCity: 'Search city or timezone...',
    general: 'General',
    showMillis: 'Show Milliseconds',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cookies: 'Cookie Policy',
    disclaimer: 'Disclaimer',
    language: 'Language',
    addEditZones: 'Add / Edit Zones',
    work: 'Work',
    break: 'Break',
    long: 'Long Break',
    lap: 'Lap',
    agree: 'Get Started',
    splashTitle: 'omistry',
    splashDesc: 'Your premium time experience.',
    splashTerms: 'By continuing, you agree to our terms of use.',
    splashBottom: 'Pure Experience · Local Privacy',
    bgGradient: 'Background Gradient',
    textAccent: 'Text / Accent',
    bgImage: 'Background Image',
    uploadImage: 'Upload Image',
    remove: 'Remove',
    color1: 'Color 1',
    color2: 'Color 2',
    color3: 'Color 3',
    text: 'Text',
    accent: 'Accent',
    custom: 'Custom',
    imported: 'Imported Font',
    calendar: 'Calendar',
    multiTimer: 'Multi Timer',
    addTimer: 'Add Timer',
    noTimers: 'Tap + to add a timer',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
    today: 'Today',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    memento: 'Life Calendar',
    birthDate: 'Your Birth Date',
    livedWeeks: 'Weeks Lived',
    totalWeeks: 'Total Weeks (~80 yrs)',
    miniMode: 'PIP / Mini Mode',
    exitMiniMode: 'Exit Mini Mode',
    tabTimer: 'Timer',
    tabPomodoro: 'Pomodoro',
    tabStopwatch: 'Stopwatch',
    tabMonthly: 'Monthly UI',
    tabEvents: 'Events',
    tabLife: 'Life Grid',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    anniversary: 'Anniversary',
    addEvent: 'Add Event',
    eventName: 'Event Name',
    date: 'Date',
    weather: 'Weather',
    temp: 'Temp',
    shareTheme: 'Share Theme',
    export: 'Export',
    import: 'Import',
    importPrompt: 'Paste theme code here',
    screenSaver: 'Screen Saver',
    ssHint: 'Move mouse to exit',
    daysLeft: 'days left',
    daysAgo: 'days ago',
    fullscreenError: 'Fullscreen Change Failed',
    fontLoadError: 'Font Load Failed',
    imageSizeError: 'Image too large (>5MB)',
    invalidThemeCode: 'Invalid Theme Code',
    themeModern: 'Midnight',
    themeLight: 'Optical',
    themeCyber: 'Cyber',
    themeForest: 'Crystal',
    themeCustom: 'Custom',
    fontModern: 'Modern',
    fontElegant: 'Elegant',
    fontTechnical: 'Tech',
    fontCyber: 'Future',
    fontCustom: 'Imported',
    alarmSound: 'Alarm Sound',
    notifications: 'Notifications',
    soundNone: 'None',
    soundBeep: 'Beep',
    soundDigital: 'Digital',
    soundBell: 'Bell',
    testSound: 'Test Sound',
    showProgressRing: 'Progress Ring',
    enableMiniTask: 'Mini Task List',
    enableFocusAnalytics: 'Focus Analytics',
    enableMeetingPlanner: 'Meeting Planner',
    focusGoal: 'Current Goal',
    focusStats: 'Focus Stats',
    exportImage: 'Export as Image',
    exporting: 'Exporting...',
    ringPosition: 'Ring Position',
    ringLeft: 'Left of Number',
    ringRight: 'Right of Number',
    ringBackground: 'Background Centered',
    autoZenMode: 'Auto Zen Mode on Start',
    downloadApp: 'Download Android App',
    downloadingApp: 'Fetching link...',
    appDesc: 'Install the native APK for smoother performance and haptics',
    updateTitle: 'Updates & Version',
    currentVersion: 'Current Version',
    checkUpdate: 'Check for Updates',
    checking: 'Checking...',
    upToDate: 'You are up to date!',
    newVersion: 'New version available',
    updateNow: 'Update Now',
    updateDesc: 'Keep your Clockomistry always up to date',
    clearData: 'Clear All Data',
    clearDataDesc: 'Deletes all settings, records and cache on this device. This cannot be undone.',
    clearDataConfirm: 'Delete all data?',
    clearDataDone: 'Data cleared, reloading…',
    clearDataBtn: 'Clear Data',
    "Taipei": "Taipei",
    "Tokyo": "Tokyo",
    "Seoul": "Seoul",
    "Shanghai": "Shanghai",
    "Hong Kong": "Hong Kong",
    "Singapore": "Singapore",
    "Bangkok": "Bangkok",
    "Dubai": "Dubai",
    "Kolkata": "Kolkata",
    "Ho Chi Minh": "Ho Chi Minh",
    "London": "London",
    "Paris": "Paris",
    "Berlin": "Berlin",
    "Rome": "Rome",
    "Madrid": "Madrid",
    "Moscow": "Moscow",
    "Amsterdam": "Amsterdam",
    "Zurich": "Zurich",
    "New York": "New York",
    "Los Angeles": "Los Angeles",
    "Chicago": "Chicago",
    "Toronto": "Toronto",
    "Vancouver": "Vancouver",
    "São Paulo": "São Paulo",
    "Mexico City": "Mexico City",
    "Sydney": "Sydney",
    "Melbourne": "Melbourne",
    "Auckland": "Auckland",
    "Cairo": "Cairo",
    "Johannesburg": "Johannesburg"
  },
  'ja': {
    lang: '日本語',
    locale: 'ja-JP',
    settings: '設定',
    back: '戻る',
    settingsDesc: 'プレミアム時計をカスタマイズ',
    appearance: '外観',
    fonts: 'フォント',
    importFont: 'フォントを読込',
    worldClock: '世界時計',
    searchCity: '都市またはタイムゾーンを検索...',
    general: '一般',
    showMillis: 'ミリ秒を表示',
    legal: '法的情報',
    privacy: 'プライバシー',
    terms: '利用規規約',
    cookies: 'Cookie',
    disclaimer: '免責事項',
    language: '言語',
    addEditZones: 'ゾーンを追加 / 編輯',
    work: '作業',
    break: '休憩',
    long: '長時間休憩',
    lap: 'ラップ',
    agree: '始める',
    splashTitle: 'omistry',
    splashDesc: 'あなただけの上質な時間體驗。',
    splashTerms: '続行することで利用規約に同意したものとみなされます。',
    splashBottom: 'Pure Experience · Local Privacy',
    bgGradient: '背景グラデーション',
    textAccent: 'テキスト / アクセント',
    bgImage: '背景画像',
    uploadImage: '画像をアップ',
    remove: '削除',
    color1: '色1',
    color2: '色2',
    color3: '色3',
    text: 'テキスト',
    accent: 'アクセント',
    custom: 'カスタム',
    imported: '読込済みフォント',
    calendar: 'カレンダー',
    multiTimer: 'マルチタイマー',
    addTimer: 'タイマーを追加',
    noTimers: '+ でタイマーを追加',
    mon: '月',
    tue: '火',
    wed: '水',
    thu: '木',
    fri: '金',
    sat: '土',
    sun: '日',
    today: '今日',
    sunrise: '日の出',
    sunset: '日の入り',
    memento: 'ライフカレンダー',
    birthDate: 'あなたの生年月日',
    livedWeeks: '過ごした週',
    totalWeeks: '合計 (約80年)',
    miniMode: 'ミニモード',
    exitMiniMode: 'ミニモードを終了',
    tabTimer: 'タイマー',
    tabPomodoro: 'ポモドーロ',
    tabStopwatch: 'ストップウォッチ',
    tabMonthly: '月カレンダー',
    tabEvents: '記念日',
    tabLife: '人生',
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    anniversary: 'お祝い',
    addEvent: 'イベント追加',
    eventName: '名目',
    date: '日付',
    weather: '天氣',
    temp: '溫度',
    shareTheme: 'テーマ共有',
    export: '書き出し',
    import: '読み込み',
    importPrompt: 'コードを貼り付け',
    screenSaver: 'スクリーンセーバー',
    ssHint: 'マウスを動かして終了',
    daysLeft: '日',
    daysAgo: '日前',
    fullscreenError: '全畫面切換失敗',
    fontLoadError: 'フォント読込失敗',
    imageSizeError: '畫像は 5MB 未満である必要があります',
    invalidThemeCode: 'テーマコードが無効です',
    themeModern: '真夜中',
    themeLight: 'ライト',
    themeCyber: 'サイバー',
    themeForest: 'フォレスト',
    themeCustom: 'カスタム',
    fontModern: 'モダン',
    fontElegant: 'エレガント',
    fontTechnical: 'テック',
    fontCyber: 'フューチャー',
    fontCustom: 'カスタム',
    alarmSound: 'アラーム音',
    notifications: '通知',
    soundNone: '無し',
    soundBeep: 'ビープ',
    soundDigital: 'デジタル',
    soundBell: 'ベル',
    testSound: 'テスト音',
    showProgressRing: 'プログレスリング',
    enableMiniTask: 'ミニタスク管理',
    enableFocusAnalytics: '集中時間統計',
    enableMeetingPlanner: 'MTGプランナー',
    focusGoal: '現在の目標',
    focusStats: '集中時間統計',
    exportImage: '画像として書き出し',
    exporting: '書き出し中...',
    ringPosition: 'リングの位置',
    ringLeft: '数字の左側',
    ringRight: '数字の右側',
    ringBackground: '背景の中心',
    autoZenMode: '開始時に集中モード',
    downloadApp: 'Androidアプリをダウンロード',
    downloadingApp: 'リンクを取得中...',
    appDesc: 'よりスムーズなパフォーマンスのためにAPKをインストール',
    updateTitle: 'アップデートとバージョン',
    currentVersion: '現在のバージョン',
    checkUpdate: 'アップデートを確認',
    checking: '確認中...',
    upToDate: '最新版です！',
    newVersion: '新しいバージョンがあります',
    updateNow: '今すぐ更新',
    updateDesc: 'Clockomistryを常に最新の状態に保つ',
    clearData: '全データを削除',
    clearDataDesc: 'このデバイスのすべての設定、記録、キャッシュを削除します。元に戻せません。',
    clearDataConfirm: 'すべてのデータを削除しますか？',
    clearDataDone: 'データを削除しました。再読込み中…',
    clearDataBtn: 'データを削除',
    "Taipei": "台北",
    "Tokyo": "東京",
    "Seoul": "ソウル",
    "Shanghai": "上海",
    "Hong Kong": "香港",
    "Singapore": "シンガポール",
    "Bangkok": "バンコク",
    "Dubai": "ドバイ",
    "Kolkata": "コルカタ",
    "Ho Chi Minh": "ホーチミン",
    "London": "ロンドン",
    "Paris": "パリ",
    "Berlin": "ベルリン",
    "Rome": "ローマ",
    "Madrid": "マドリード",
    "Moscow": "モスクワ",
    "Amsterdam": "アムステルダム",
    "Zurich": "チューリッヒ",
    "New York": "ニューヨーク",
    "Los Angeles": "ロサンゼルス",
    "Chicago": "シカゴ",
    "Toronto": "トロント",
    "Vancouver": "バンクーバー",
    "São Paulo": "サンパウロ",
    "Mexico City": "メキシコシティ",
    "Sydney": "シドニー",
    "Melbourne": "メルボルン",
    "Auckland": "オークランド",
    "Cairo": "カイロ",
    "Johannesburg": "ヨハネスブルグ"
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
  modern: {
    name: 'fontModern',
    style: {
      fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    }
  },
  elegant: {
    name: 'fontElegant',
    style: {
      fontFamily: '"Playfair Display", serif'
    }
  },
  technical: {
    name: 'fontTechnical',
    style: {
      fontFamily: '"JetBrains Mono", monospace'
    }
  },
  cyber: {
    name: 'fontCyber',
    style: {
      fontFamily: '"Orbitron", sans-serif'
    }
  }
};
const ALL_ZONES = [
// Asia
{
  id: 'Asia/Taipei',
  label: 'Taipei',
  region: 'Asia'
}, {
  id: 'Asia/Tokyo',
  label: 'Tokyo',
  region: 'Asia'
}, {
  id: 'Asia/Seoul',
  label: 'Seoul',
  region: 'Asia'
}, {
  id: 'Asia/Shanghai',
  label: 'Shanghai',
  region: 'Asia'
}, {
  id: 'Asia/Hong_Kong',
  label: 'Hong Kong',
  region: 'Asia'
}, {
  id: 'Asia/Singapore',
  label: 'Singapore',
  region: 'Asia'
}, {
  id: 'Asia/Bangkok',
  label: 'Bangkok',
  region: 'Asia'
}, {
  id: 'Asia/Dubai',
  label: 'Dubai',
  region: 'Asia'
}, {
  id: 'Asia/Kolkata',
  label: 'Kolkata',
  region: 'Asia'
}, {
  id: 'Asia/Ho_Chi_Minh',
  label: 'Ho Chi Minh',
  region: 'Asia'
},
// Europe
{
  id: 'Europe/London',
  label: 'London',
  region: 'Europe'
}, {
  id: 'Europe/Paris',
  label: 'Paris',
  region: 'Europe'
}, {
  id: 'Europe/Berlin',
  label: 'Berlin',
  region: 'Europe'
}, {
  id: 'Europe/Rome',
  label: 'Rome',
  region: 'Europe'
}, {
  id: 'Europe/Madrid',
  label: 'Madrid',
  region: 'Europe'
}, {
  id: 'Europe/Moscow',
  label: 'Moscow',
  region: 'Europe'
}, {
  id: 'Europe/Amsterdam',
  label: 'Amsterdam',
  region: 'Europe'
}, {
  id: 'Europe/Zurich',
  label: 'Zurich',
  region: 'Europe'
},
// America
{
  id: 'America/New_York',
  label: 'New York',
  region: 'America'
}, {
  id: 'America/Los_Angeles',
  label: 'Los Angeles',
  region: 'America'
}, {
  id: 'America/Chicago',
  label: 'Chicago',
  region: 'America'
}, {
  id: 'America/Toronto',
  label: 'Toronto',
  region: 'America'
}, {
  id: 'America/Vancouver',
  label: 'Vancouver',
  region: 'America'
}, {
  id: 'America/Sao_Paulo',
  label: 'São Paulo',
  region: 'America'
}, {
  id: 'America/Mexico_City',
  label: 'Mexico City',
  region: 'America'
},
// Oceania
{
  id: 'Australia/Sydney',
  label: 'Sydney',
  region: 'Oceania'
}, {
  id: 'Australia/Melbourne',
  label: 'Melbourne',
  region: 'Oceania'
}, {
  id: 'Pacific/Auckland',
  label: 'Auckland',
  region: 'Oceania'
},
// Africa
{
  id: 'Africa/Cairo',
  label: 'Cairo',
  region: 'Africa'
}, {
  id: 'Africa/Johannesburg',
  label: 'Johannesburg',
  region: 'Africa'
}];

// --- Memoized Components ---
const ProgressRing = /*#__PURE__*/React.memo(_ref => {
  let {
    progress,
    accent,
    position
  } = _ref;
  const clampedProgress = Math.min(100, Math.max(0, progress || 0));
  const radius = 46;
  const stroke = position === 'background' ? 1.5 : 4;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = Math.max(0, circumference - clampedProgress / 100 * circumference);
  const baseClass = position === 'background' ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none drop-shadow-2xl opacity-50 z-0 flex justify-center items-center w-[90vw] h-[90vw] max-w-[500px] max-h-[500px]" : "pointer-events-none drop-shadow-2xl opacity-80 flex flex-shrink-0 justify-center items-center w-[12vw] h-[12vw] min-w-[50px] min-h-[50px] max-w-[100px] max-h-[100px] mx-4";
  return /*#__PURE__*/React.createElement("div", {
    className: baseClass
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    className: "w-full h-full pointer-events-none",
    preserveAspectRatio: "xMidYMid meet"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("filter", {
    id: "ringGlow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    in: "SourceGraphic",
    stdDeviation: "2",
    result: "blur1"
  }), /*#__PURE__*/React.createElement("feGaussianBlur", {
    in: "SourceGraphic",
    stdDeviation: "5",
    result: "blur2"
  }), /*#__PURE__*/React.createElement("feMerge", null, /*#__PURE__*/React.createElement("feMergeNode", {
    in: "blur2"
  }), /*#__PURE__*/React.createElement("feMergeNode", {
    in: "blur1"
  }), /*#__PURE__*/React.createElement("feMergeNode", {
    in: "SourceGraphic"
  })))), /*#__PURE__*/React.createElement("circle", {
    stroke: "currentColor",
    fill: "transparent",
    strokeWidth: stroke,
    className: "opacity-[0.1]",
    r: radius,
    cx: "50",
    cy: "50"
  }), /*#__PURE__*/React.createElement("circle", {
    filter: "url(#ringGlow)",
    stroke: "currentColor",
    fill: "transparent",
    strokeWidth: stroke,
    strokeDasharray: circumference + ' ' + circumference,
    style: {
      strokeDashoffset,
      transition: 'stroke-dashoffset 1s linear'
    },
    className: "opacity-100 ".concat(accent),
    strokeLinecap: "round",
    r: radius,
    cx: "50",
    cy: "50",
    transform: "rotate(-90 50 50)"
  })));
});
const WeatherWidget = /*#__PURE__*/React.memo(_ref2 => {
  let {
    weather,
    accent
  } = _ref2;
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-8 flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in opacity-60 hover:opacity-100 transition-opacity"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(CloudSun, {
    size: 18,
    className: accent
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, weather.city, " \xB7 ", weather.temp, "\xB0C \xB7 ", weather.condition)), (weather.sunrise || weather.sunset) && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 text-xs opacity-80 border-l border-white/20 pl-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Sunrise, {
    size: 14,
    className: "text-orange-400"
  }), weather.sunrise), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Sunset, {
    size: 14,
    className: "text-purple-400"
  }), weather.sunset)));
});
const ClockDisplay = /*#__PURE__*/React.memo(_ref3 => {
  let {
    h,
    m,
    s,
    ms,
    showMillis,
    accent,
    dateLabel
  } = _ref3;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center select-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline font-bold tracking-tighter tabular-nums drop-shadow-2xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[22vw] md:text-[150px] leading-none"
  }, h), /*#__PURE__*/React.createElement("span", {
    className: "text-[22vw] md:text-[150px] leading-none animate-pulse ".concat(accent)
  }, ":"), /*#__PURE__*/React.createElement("span", {
    className: "text-[22vw] md:text-[150px] leading-none"
  }, m), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col ml-2 md:ml-4 justify-end pb-[1vw] md:pb-8"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[8vw] md:text-[40px] opacity-50 font-medium"
  }, s), showMillis && /*#__PURE__*/React.createElement("span", {
    className: "text-[4vw] md:text-[20px] ".concat(accent, " opacity-80")
  }, ms))), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 md:mt-4 text-sm md:text-2xl font-light tracking-[0.3em] opacity-80 uppercase text-center"
  }, dateLabel));
});
const NavigationBar = /*#__PURE__*/React.memo(_ref4 => {
  let {
    mode,
    setMode,
    isZenMode,
    accent,
    showControls,
    toggleFullscreen,
    setShowSettings,
    setIsZenMode,
    isCleanMode,
    setIsMiniMode,
    t
  } = _ref4;
  return /*#__PURE__*/React.createElement("div", {
    className: "hide-on-export fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-[2rem] sm:rounded-full backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl transition-all duration-500 z-40 w-max max-w-[96vw] sm:max-w-2xl sm:w-auto ".concat(showControls && !isCleanMode ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none')
  }, /*#__PURE__*/React.createElement("style", null, ".hide-scroll::-webkit-scrollbar { display: none; }"), /*#__PURE__*/React.createElement("div", {
    className: "flex bg-white/5 rounded-full p-1 gap-1 flex-none overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scroll max-w-[65vw] sm:max-w-none",
    style: {
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch'
    }
  }, [{
    m: 'clock',
    icon: Clock
  }, {
    m: 'world',
    icon: Globe
  }, {
    m: 'calendar',
    icon: CalendarDays
  }, {
    m: 'pomodoro',
    icon: Timer
  }].map(_ref5 => {
    let {
      m,
      icon: Icon
    } = _ref5;
    const isActive = m === 'pomodoro' && ['timer', 'pomodoro', 'stopwatch'].includes(mode) || m === 'calendar' && ['calendar', 'anniversary', 'memento'].includes(mode) || mode === m;
    return /*#__PURE__*/React.createElement("button", {
      key: m,
      onClick: () => {
        if (m === 'pomodoro' && !['timer', 'pomodoro', 'stopwatch'].includes(mode)) setMode('pomodoro');else if (m === 'calendar' && !['calendar', 'anniversary', 'memento'].includes(mode)) setMode('calendar');else if (m === 'clock' || m === 'world') setMode(m);
      },
      className: "p-3 lg:px-6 lg:py-3 rounded-full transition-all snap-center flex-shrink-0 ".concat(isActive ? 'bg-white/20 scale-105 shadow-sm' : 'opacity-60 hover:bg-white/10')
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 20,
      className: isActive ? accent : ''
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "w-px h-8 bg-white/20 hidden sm:block"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1 pr-1 sm:pr-0"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSettings(true),
    className: "p-3 rounded-full opacity-80 hover:opacity-100 hover:rotate-90 transition-all"
  }, /*#__PURE__*/React.createElement(Settings, {
    size: 20
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsZenMode(!isZenMode),
    className: "p-3 rounded-full ".concat(isZenMode ? accent : 'opacity-80')
  }, /*#__PURE__*/React.createElement(Monitor, {
    size: 20
  })), /*#__PURE__*/React.createElement("button", {
    onClick: toggleFullscreen,
    className: "p-3 rounded-full opacity-80 hover:opacity-100 hidden sm:block"
  }, /*#__PURE__*/React.createElement(Maximize2, {
    size: 20
  }))));
});

// --- Custom Hooks for Local Storage ---
function useLocalString(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    if (item !== null) return item;
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);
  return [value, setValue];
}
function useLocalBoolean(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item !== null ? item === 'true' : initialValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);
  return [value, setValue];
}
function useLocalJSON(key, initialValue, parser) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return typeof initialValue === 'function' ? initialValue() : initialValue;
      const parsed = JSON.parse(item);
      return parser ? parser(parsed) : parsed;
    } catch (e) {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
const formatTime = date => {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  const ms = Math.floor(date.getMilliseconds() / 10).toString().padStart(2, '0');
  return {
    h,
    m,
    s,
    ms
  };
};
const formatDuration = ms => {
  const m = Math.floor(ms / 60000).toString().padStart(2, '0');
  const s = Math.floor(ms % 60000 / 1000).toString().padStart(2, '0');
  const cs = Math.floor(ms % 1000 / 10).toString().padStart(2, '0');
  return {
    m,
    s,
    cs
  };
};
function App() {
  const [time, setTime] = useState(new Date());
  const [theme, setTheme] = useLocalString('clock_theme', 'modern');
  const [font, setFont] = useLocalString('clock_font', 'modern');
  const [showMillis, setShowMillis] = useLocalBoolean('clock_millis', true);
  const [showProgressRing, setShowProgressRing] = useLocalBoolean('clock_progressRing', true);
  const [ringPosition, setRingPosition] = useLocalString('clock_ringPosition', 'left');
  const [enableMiniTask, setEnableMiniTask] = useLocalBoolean('clock_miniTask', true);
  const [enableFocusAnalytics, setEnableFocusAnalytics] = useLocalBoolean('clock_focusAnalytics', true);
  const [enableMeetingPlanner, setEnableMeetingPlanner] = useLocalBoolean('clock_meetingPlanner', true);

  // New Automation Settings
  const [autoZenMode, setAutoZenMode] = useLocalBoolean('clock_autoZenMode', true);
  const [selectedZones, setSelectedZones] = useLocalJSON('clock_zones', () => [ALL_ZONES.find(z => z.id === 'Asia/Taipei'), ALL_ZONES.find(z => z.id === 'America/New_York'), ALL_ZONES.find(z => z.id === 'Europe/London'), ALL_ZONES.find(z => z.id === 'Asia/Tokyo')].filter(Boolean), parsed => {
    const zones = parsed.map(item => {
      const id = typeof item === 'string' ? item : item.id;
      return ALL_ZONES.find(z => z.id === id);
    }).filter(Boolean);
    if (zones.length > 0) return zones;
    return null; // fallback
  });
  const [mode, setMode] = useState('clock');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasCustomFont, setHasCustomFont] = useState(false);
  const [hasAgreed, setHasAgreed] = useLocalBoolean('clock_agreed', false);
  const [customColors, setCustomColors] = useLocalJSON('clock_custom_colors', {
    bg1: '#0a0a1a',
    bg2: '#1a1a3e',
    bg3: '#0a0a1a',
    text: '#e2e8f0',
    accent: '#22d3ee'
  });
  const [customBgImage, setCustomBgImage] = useLocalString('clock_custom_bg', '');
  const [lang, setLang] = useLocalString('clock_lang', () => {
    const browserLang = navigator.language.split('-')[0];
    if (I18N[browserLang]) return browserLang;
    if (navigator.language === 'zh-CN' || navigator.language === 'zh-HK') return 'zh-TW';
    return 'zh-TW';
  });

  // Anniversary 狀態
  const [anniversaries, setAnniversaries] = useLocalJSON('clock_anniversaries', []);

  // Advance Features 狀態
  const [focusGoal, setFocusGoal] = useLocalString('clock_focusGoal', '');
  const [focusStats, setFocusStats] = useLocalJSON('clock_focusStats', {});
  const [meetingOffset, setMeetingOffset] = useState(0);

  // Weather 狀態
  const [weather, setWeather] = useState({
    temp: '--',
    condition: '',
    city: '--',
    sunrise: null,
    sunset: null
  });

  // Life Calendar & Mini Mode
  const [birthDate, setBirthDate] = useLocalString('clock_birthdate', '2000-01-01');

  // Auto-detect OBS
  const isOBS = useMemo(() => typeof window.obsstudio !== 'undefined', []);

  // If OBS, the UI becomes super clean
  const isCleanMode = isOBS;

  // Apply transparent bg if OBS
  useEffect(() => {
    if (isCleanMode) {
      document.body.style.backgroundColor = 'transparent';
    } else {
      document.body.style.backgroundColor = '';
    }
  }, [isCleanMode]);

  // Screen Saver 狀態
  const [isScreenSaverActive, setIsScreenSaverActive] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [ssPos, setSsPos] = useState({
    x: 40,
    y: 40
  });
  const ssVelocity = useRef({
    x: 0.15,
    y: 0.12
  });

  // i18n helper
  const t = useCallback(key => (I18N[lang] || I18N['zh-TW'])[key] || key, [lang]);

  // Timer 狀態
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInitial, setTimerInitial] = useState(25 * 60);
  const [isEditingTimer, setIsEditingTimer] = useState(false);
  const [timerInput, setTimerInput] = useState('000000');
  const handleTimerInput = val => {
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
  const [alarmSound, setAlarmSound] = useLocalString('clock_alarmSound', 'beep');
  const [notificationsEnabled, setNotificationsEnabled] = useLocalBoolean('clock_notifications', true);
  const audioRef = useRef(null);
  const playAlarm = useCallback(() => {
    if (alarmSound === 'none') return;
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = "public/audio/".concat(alarmSound, ".ogg");
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
      new Notification(title, {
        body,
        icon: 'icons/icon-192.png'
      });
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
  // The explicit useEffect syncing logic is now automatically managed by the custom hooks above!

  // 螢幕保護自動偵測
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
      if (isScreenSaverActive) setIsScreenSaverActive(false);
    };
    const events = ['mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, updateActivity, {
      passive: true
    }));
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
      var _wData$daily, _wData$daily2;
      // 使用 IP-API 獲取大致位置
      const locRes = await fetch('https://ipapi.co/json/');
      const loc = await locRes.json();
      const {
        latitude,
        longitude,
        city
      } = loc;

      // 使用 Open-Meteo 獲取天氣與日出日落
      const wRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=".concat(latitude, "&longitude=").concat(longitude, "&current_weather=true&daily=sunrise,sunset&timezone=auto"));
      const wData = await wRes.json();
      const code = wData.current_weather.weathercode;
      const sunriseStr = (_wData$daily = wData.daily) === null || _wData$daily === void 0 || (_wData$daily = _wData$daily.sunrise) === null || _wData$daily === void 0 ? void 0 : _wData$daily[0];
      const sunsetStr = (_wData$daily2 = wData.daily) === null || _wData$daily2 === void 0 || (_wData$daily2 = _wData$daily2.sunset) === null || _wData$daily2 === void 0 ? void 0 : _wData$daily2[0];

      // 簡易天氣代碼轉中文/英文
      const conditionMap = {
        0: 'Clear',
        1: 'Cloudy',
        2: 'Cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Fog',
        51: 'Drizzle',
        61: 'Rain',
        71: 'Snow',
        95: 'Storm'
      };
      const formatHm = isoStr => {
        if (!isoStr) return null;
        const d = new Date(isoStr);
        return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
      };
      setWeather({
        temp: Math.round(wData.current_weather.temperature),
        condition: conditionMap[code] || 'Cloudy',
        city: city,
        sunrise: formatHm(sunriseStr),
        sunset: formatHm(sunsetStr)
      });
    } catch (e) {
      console.error('Weather fetch error:', e);
    }
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
          showNotification('Timer Finished', "Timer ".concat(t.label, " has finished"));
          return _objectSpread(_objectSpread({}, t), {}, {
            remaining: 0,
            running: false
          });
        }
        return _objectSpread(_objectSpread({}, t), {}, {
          remaining: next
        });
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [multiTimers, playAlarm, showNotification]);
  const addMultiTimer = function () {
    let minutes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
    multiTimerIdRef.current += 1;
    setMultiTimers(prev => [...prev, {
      id: multiTimerIdRef.current,
      label: "".concat(minutes, ":00"),
      initial: minutes * 60,
      remaining: minutes * 60,
      running: false
    }]);
  };
  const toggleMultiTimer = id => setMultiTimers(prev => prev.map(t => t.id === id ? _objectSpread(_objectSpread({}, t), {}, {
    running: !t.running
  }) : t));
  const resetMultiTimer = id => setMultiTimers(prev => prev.map(t => t.id === id ? _objectSpread(_objectSpread({}, t), {}, {
    remaining: t.initial,
    running: false
  }) : t));
  const deleteMultiTimer = id => setMultiTimers(prev => prev.filter(t => t.id !== id));

  // --- 主題匯出導入 ---
  const exportTheme = () => {
    const data = {
      theme,
      font,
      customColors,
      customBgImage
    };
    const code = btoa(JSON.stringify(data));
    navigator.clipboard.writeText(code);
  };
  const importTheme = code => {
    if (!code) return;
    try {
      const data = JSON.parse(atob(code));
      if (data.theme) setTheme(data.theme);
      if (data.font) setFont(data.font);
      if (data.customColors) setCustomColors(data.customColors);
      if (data.customBgImage !== undefined) setCustomBgImage(data.customBgImage);
    } catch (e) {
      setErrorMsg(t('invalidThemeCode'));
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };
  const [isExporting, setIsExporting] = useState(false);
  const handleExportImage = async () => {
    if (!containerRef.current || isExporting) return;
    setIsExporting(true);
    const prevZen = isZenMode;
    if (!prevZen) setIsZenMode(true);
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(containerRef.current, {
          scale: 2,
          backgroundColor: null,
          ignoreElements: el => el.classList.contains('hide-on-export')
        });
        const link = document.createElement('a');
        link.download = "clockomistry-".concat(Date.now(), ".png");
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {}
      setIsZenMode(prevZen);
      setIsExporting(false);
    }, 500);
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
  const loadCustomFont = async base64Data => {
    try {
      const fontFace = new FontFace('CustomFont', "url(".concat(base64Data, ")"));
      const loadedFace = await fontFace.load();
      document.fonts.add(loadedFace);
      setHasCustomFont(true);
      return true;
    } catch (e) {
      showError(t('fontLoadError'));
      return false;
    }
  };
  const handleFontUpload = e => {
    var _e$target$files;
    const file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async e => {
      const data = e.target.result;
      const success = await loadCustomFont(data);
      if (success) {
        await saveFontToDB(data);
        setFont('custom');
      }
    };
    reader.readAsDataURL(file);
  };
  const handleBgImageUpload = e => {
    var _e$target$files2;
    const file = (_e$target$files2 = e.target.files) === null || _e$target$files2 === void 0 ? void 0 : _e$target$files2[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showError(t('imageSizeError'));
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      setCustomBgImage(ev.target.result);
      setTheme('custom');
    };
    reader.readAsDataURL(file);
  };
  const updateCustomColor = (key, value) => setCustomColors(prev => _objectSpread(_objectSpread({}, prev), {}, {
    [key]: value
  }));

  // --- Pomodoro 邏輯 ---
  useEffect(() => {
    let interval = null;
    if (isPomoRunning && pomoSeconds > 0) {
      interval = setInterval(() => setPomoSeconds(prev => prev - 1), 1000);
    } else if (isPomoRunning && pomoSeconds === 0) {
      setIsPomoRunning(false);
      playAlarm();
      showNotification('Pomodoro Finished', "".concat(t(pomoMode), " section is complete"));
      triggerSuccess();

      // 自動切換模式或播放鈴聲（這裡先簡單處理）
      if (pomoMode === 'work') {
        if (enableFocusAnalytics) {
          const today = new Date().toISOString().split('T')[0];
          setFocusStats(prev => _objectSpread(_objectSpread({}, prev), {}, {
            [today]: (prev[today] || 0) + 25 * 60
          }));
        }
        setPomoMode('short');
        setPomoSeconds(5 * 60);
      } else {
        setPomoMode('work');
        setPomoSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isPomoRunning, pomoSeconds, pomoMode, playAlarm, showNotification, t]);
  const resetPomo = modeType => {
    setIsPomoRunning(false);
    setPomoMode(modeType);
    if (modeType === 'work') setPomoSeconds(25 * 60);else if (modeType === 'short') setPomoSeconds(5 * 60);else if (modeType === 'long') setPomoSeconds(15 * 60);
  };

  // --- 核心計時邏輯 ---
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
      if (showMillis) requestRef.current = requestAnimationFrame(updateTime);
    };
    if (showMillis) requestRef.current = requestAnimationFrame(updateTime);else {
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
      triggerSuccess();
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

  // 全域按鈕震動與快捷鍵 (Spacebar Play/Pause, Esc Reset)
  useEffect(() => {
    const handleBtnClick = e => {
      if (e.target.closest('button')) triggerHaptic();
    };
    const handleKeyDown = e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        triggerHaptic();
        if (mode === 'timer') {
          if (isTimerRunning) setIsTimerRunning(false);else if (timerSeconds > 0) setIsTimerRunning(true);
        } else if (mode === 'pomodoro') {
          setIsPomoRunning(prev => !prev);
        } else if (mode === 'stopwatch') {
          setIsStopwatchRunning(prev => !prev);
        }
      } else if (e.code === 'Escape') {
        e.preventDefault();
        triggerHaptic();
        if (mode === 'timer') {
          setIsTimerRunning(false);
          // setIsEditingTimer(true); // Let button handle editing explicitly
        } else if (mode === 'pomodoro') {
          resetPomo(pomoMode);
        } else if (mode === 'stopwatch') {
          setStopwatchTime(0);
          setLaps([]);
          setIsStopwatchRunning(false);
        }
      }
    };
    document.addEventListener('click', handleBtnClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleBtnClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, isTimerRunning, timerSeconds, isPomoRunning, pomoMode, isStopwatchRunning]);
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
      if (!document.fullscreenElement) await containerRef.current.requestFullscreen();else await document.exitFullscreen();
    } catch (err) {
      showError(t('fullscreenError'));
    }
  };
  const showError = msg => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 3000);
  };
  const handleClearData = async () => {
    if (!window.confirm(t('clearDataConfirm'))) return;
    // 1. Clear all localStorage keys
    localStorage.clear();
    // 2. Clear all cookies for this origin
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    // 3. Clear all SW caches
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    // 4. Unregister service workers
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    showError(t('clearDataDone'));
    setTimeout(() => window.location.reload(true), 1800);
  };
  const [isDownloadingApp, setIsDownloadingApp] = useState(false);
  const handleDownloadApp = async () => {
    if (isDownloadingApp) return;
    setIsDownloadingApp(true);
    try {
      var _data$assets;
      const res = await fetch('https://api.github.com/repos/unkoalatw/clockomistry/releases/latest');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const apkAsset = (_data$assets = data.assets) === null || _data$assets === void 0 ? void 0 : _data$assets.find(a => a.name.endsWith('.apk'));
      if (apkAsset && apkAsset.browser_download_url) {
        window.open(apkAsset.browser_download_url, '_blank');
      } else {
        showError('APK not found in the latest release.');
      }
    } catch (err) {
      showError('Failed to fetch release from GitHub.');
    } finally {
      setIsDownloadingApp(false);
    }
  };
  const [updateStatus, setUpdateStatus] = useState(null); // null | 'checking' | 'latest' | 'new'
  const [latestVersion, setLatestVersion] = useState(null);
  const handleCheckUpdate = async () => {
    setUpdateStatus('checking');
    try {
      var _data$tag_name;
      // Fetch package.json or use release tag from GitHub API
      const res = await fetch('https://api.github.com/repos/unkoalatw/clockomistry/releases/latest');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const remoteTag = ((_data$tag_name = data.tag_name) === null || _data$tag_name === void 0 ? void 0 : _data$tag_name.replace(/^v/, '')) || '';
      setLatestVersion(remoteTag);
      if (remoteTag && remoteTag !== APP_VERSION) {
        setUpdateStatus('new');
      } else {
        setUpdateStatus('latest');
        setTimeout(() => setUpdateStatus(null), 3000);
      }
    } catch (err) {
      // If no release exists yet, try to force-refresh SW
      setUpdateStatus('latest');
      setTimeout(() => setUpdateStatus(null), 3000);
    }
  };
  const handleForceUpdate = async () => {
    // 1. Force SW update
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.update()));
    }
    // 2. Clear caches
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    // 3. Hard reload
    window.location.reload(true);
  };
  const formatDate = date => date.toLocaleDateString(t('locale'), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const getWorldTime = timezone => {
    try {
      const d = new Date(Date.now() + meetingOffset * 3600 * 1000);
      const s = d.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      const [h, m] = s.split(':');
      return {
        h,
        m
      };
    } catch (e) {
      return {
        h: '--',
        m: '--'
      };
    }
  };
  const filteredZones = useMemo(() => ALL_ZONES.filter(z => z.label.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery]);
  const currentTheme = theme === 'custom' ? {
    name: 'themeCustom',
    bg: '',
    text: '',
    accent: 'custom-accent',
    card: 'custom-card backdrop-blur-3xl',
    gradient: '',
    button: 'hover:bg-white/20',
    settingsBg: 'custom-settings'
  } : DEFAULT_THEMES[theme] || DEFAULT_THEMES.modern;
  const {
    h,
    m,
    s,
    ms
  } = formatTime(time);
  const stopwatch = formatDuration(stopwatchTime);
  const currentFontStyle = useMemo(() => {
    var _DEFAULT_FONTS$font;
    return font === 'custom' && hasCustomFont ? {
      fontFamily: 'CustomFont'
    } : ((_DEFAULT_FONTS$font = DEFAULT_FONTS[font]) === null || _DEFAULT_FONTS$font === void 0 ? void 0 : _DEFAULT_FONTS$font.style) || {};
  }, [font, hasCustomFont]);
  const containerStyle = theme === 'custom' && !isCleanMode ? _objectSpread(_objectSpread({}, currentFontStyle), {}, {
    background: customBgImage ? "linear-gradient(".concat(customColors.bg1, "cc, ").concat(customColors.bg1, "cc), url(").concat(customBgImage, ") center/cover no-repeat fixed") : "linear-gradient(135deg, ".concat(customColors.bg1, ", ").concat(customColors.bg2, ", ").concat(customColors.bg3, ")"),
    color: customColors.text
  }) : currentFontStyle;
  const calendarView = useMemo(() => {
    if (mode !== 'calendar') return null;
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
    const isTodayDate = d => d === today.getDate() && isCurrentMonth;

    // Sunday-start like Google Calendar
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Build 6 rows × 7 cols = 42 cells
    const cells = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) cells.push({
      day: prevMonthDays - i,
      type: 'prev'
    });
    for (let i = 1; i <= daysInMonth; i++) cells.push({
      day: i,
      type: 'current'
    });
    let nextDay = 1;
    while (cells.length < 42) cells.push({
      day: nextDay++,
      type: 'next'
    });
    const dayLabels = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
    const monthNames = (I18N[lang] || I18N['zh-TW']).months;
    const grid7 = {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)'
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 540,
        userSelect: 'none',
        marginTop: '48px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setCalendarDate(new Date()),
      style: {
        padding: '8px 20px',
        borderRadius: 9999,
        border: '1px solid rgba(255,255,255,0.2)',
        fontSize: 14,
        fontWeight: 500,
        background: 'transparent',
        color: 'inherit',
        cursor: 'pointer'
      },
      onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)',
      onMouseLeave: e => e.currentTarget.style.background = 'transparent'
    }, t('today')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setCalendarDate(new Date(year, month - 1, 1)),
      style: {
        padding: 6,
        borderRadius: '50%',
        background: 'transparent',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(ChevronLeft, {
      size: 22
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => setCalendarDate(new Date(year, month + 1, 1)),
      style: {
        padding: 6,
        borderRadius: '50%',
        background: 'transparent',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(ChevronRight, {
      size: 22
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 24,
        fontWeight: 400,
        opacity: 0.9,
        letterSpacing: -0.5,
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        marginRight: 8,
        color: "var(--".concat(currentTheme.accent, ")")
      }
    }, year), /*#__PURE__*/React.createElement("span", null, monthNames[month])), /*#__PURE__*/React.createElement("div", {
      style: grid7
    }, dayLabels.map((lbl, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: '100%',
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1,
        paddingBottom: 12,
        color: 'rgba(255,255,255,0.4)',
        userSelect: 'none'
      }
    }, lbl)), /*#__PURE__*/React.createElement("div", {
      style: _objectSpread(_objectSpread({}, grid7), {}, {
        gridColumn: '1 / -1',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      })
    }, cells.map((cell, i) => {
      const isToday = cell.type === 'current' && isTodayDate(cell.day);
      const colIndex = i % 7;
      const isSun = colIndex === 0;
      const isSat = colIndex === 6;
      const borderStyle = '1px solid rgba(255,255,255,0.05)';
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          position: 'relative',
          minHeight: 56,
          borderBottom: borderStyle,
          borderRight: borderStyle,
          borderLeft: colIndex === 0 ? borderStyle : 'none'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
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
          color: isToday ? '#fff' : cell.type !== 'current' ? 'rgba(255,255,255,0.2)' : isSun ? 'rgba(248,113,113,0.8)' : isSat ? 'rgba(96,165,250,0.7)' : 'inherit',
          transition: 'all 0.15s'
        }
      }, cell.day));
    }))));
  }, [calendarDate, currentTheme, lang, mode]);
  const mementoView = useMemo(() => {
    if (mode !== 'memento') return null;
    const weeksPerYear = 52;
    const years = 80;
    const totalWeeksCount = weeksPerYear * years;
    let livedWeeksCount = 0;
    if (birthDate) {
      const livedMillis = Date.now() - new Date(birthDate).getTime();
      livedWeeksCount = Math.max(0, Math.floor(livedMillis / (1000 * 60 * 60 * 24 * 7)));
    }
    const pct = birthDate ? Math.min(100, Math.floor(livedWeeksCount / totalWeeksCount * 100)) : 0;
    return /*#__PURE__*/React.createElement("div", {
      className: "w-full mt-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-xs opacity-60 mb-4 px-2 font-mono uppercase tracking-[0.2em]"
    }, /*#__PURE__*/React.createElement("span", null, t('livedWeeks'), " : ", livedWeeksCount), /*#__PURE__*/React.createElement("span", null, pct, "% - ", t('totalWeeks'))), /*#__PURE__*/React.createElement("div", {
      className: "relative w-full rounded-2xl overflow-hidden bg-black/50 border flex border-white/5 p-4 sm:p-6",
      style: {
        display: 'grid',
        gridTemplateColumns: "repeat(".concat(weeksPerYear, ", 1fr)"),
        gap: '2px',
        alignContent: 'start'
      }
    }, Array.from({
      length: totalWeeksCount
    }).map((_, i) => {
      const isLived = i < livedWeeksCount;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "w-full aspect-square rounded-[1px] ".concat(isLived ? 'bg-indigo-400' : 'bg-white/10'),
        style: {
          opacity: isLived ? 0.9 : 0.2
        },
        title: "Week ".concat(i + 1)
      });
    })));
  }, [birthDate, lang, currentTheme, mode]);
  return /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    onMouseMove: handleMouseMove,
    style: containerStyle,
    className: "h-[100dvh] w-full flex flex-col items-center py-8 transition-all duration-1000 ".concat(theme !== 'custom' && !isCleanMode ? "bg-gradient-to-br ".concat(currentTheme.gradient, " ").concat(currentTheme.text) : '', " ").concat(isCleanMode ? 'bg-transparent text-white' : '', " overflow-x-hidden overflow-y-auto relative custom-scrollbar selection:bg-pink-500 selection:text-white")
  }, theme === 'custom' && /*#__PURE__*/React.createElement("style", null, "\n                .custom-accent { color: ".concat(customColors.accent, "; }\n                .custom-card { background: ").concat(customColors.bg1, "33; border-color: ").concat(customColors.text, "1a; box-shadow: 0 8px 32px 0 rgba(0,0,0,0.36); }\n                .custom-settings { background: ").concat(customColors.bg1, "e6; backdrop-filter: blur(64px); }\n            ")), /*#__PURE__*/React.createElement("div", {
    className: "hide-on-export fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ".concat(errorMsg ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none')
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-6 py-3 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 bg-slate-800/90 text-white"
  }, /*#__PURE__*/React.createElement(AlertCircle, {
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, errorMsg))), showSettings && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[60] ".concat(currentTheme.settingsBg, " backdrop-blur-3xl animate-in fade-in duration-300 flex flex-col md:flex-row overflow-hidden")
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:w-1/3 lg:w-1/4 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSettings(false),
    className: "mb-8 p-2 -ml-2 hover:bg-white/10 rounded-full flex items-center gap-2 opacity-60 hover:opacity-100 group"
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    size: 24,
    className: "group-hover:-translate-x-1 transition-transform"
  }), /*#__PURE__*/React.createElement("span", null, t('back'))), /*#__PURE__*/React.createElement("h2", {
    className: "text-4xl font-bold tracking-wider mb-2"
  }, t('settings')), /*#__PURE__*/React.createElement("p", {
    className: "opacity-50 text-lg"
  }, t('settingsDesc'))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto space-y-12 pb-20"
  }, /*#__PURE__*/React.createElement("section", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"
  }, /*#__PURE__*/React.createElement(Palette, {
    size: 24
  }), " ", t('appearance')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-4"
  }, Object.entries(DEFAULT_THEMES).map(_ref6 => {
    let [key, thm] = _ref6;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      onClick: () => setTheme(key),
      className: "flex flex-col items-center gap-4 p-6 rounded-3xl transition-all border ".concat(theme === key ? "bg-white/10 border-white/50 scale-105" : 'border-white/5 hover:bg-white/5')
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-12 h-12 rounded-full ".concat(thm.bg.includes('gray-50') ? 'bg-gray-300' : thm.bg)
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-sm"
    }, t(thm.name)));
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme('custom'),
    className: "flex flex-col items-center gap-4 p-6 rounded-3xl transition-all border ".concat(theme === 'custom' ? 'bg-white/10 border-white/50 scale-105' : 'border-white/5 hover:bg-white/5')
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-full border border-white/20",
    style: {
      background: "linear-gradient(135deg, ".concat(customColors.bg1, ", ").concat(customColors.bg2, ", ").concat(customColors.bg3, ")")
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, t('custom')))), theme === 'custom' && /*#__PURE__*/React.createElement("div", {
    className: "mt-6 p-6 rounded-2xl bg-white/5 border border-white/10",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium opacity-80",
    style: {
      display: 'block',
      marginBottom: 12
    }
  }, t('bgGradient')), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4 items-center"
  }, [['bg1', t('color1')], ['bg2', t('color2')], ['bg3', t('color3')]].map(_ref7 => {
    let [k, l] = _ref7;
    return /*#__PURE__*/React.createElement("label", {
      key: k,
      className: "flex flex-col items-center gap-1 cursor-pointer"
    }, /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: customColors[k],
      onChange: e => updateCustomColor(k, e.target.value),
      style: {
        width: 40,
        height: 40,
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        background: 'transparent'
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "opacity-50",
      style: {
        fontSize: 10
      }
    }, l));
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 rounded-lg border border-white/10",
    style: {
      height: 40,
      background: "linear-gradient(135deg, ".concat(customColors.bg1, ", ").concat(customColors.bg2, ", ").concat(customColors.bg3, ")")
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium opacity-80",
    style: {
      display: 'block',
      marginBottom: 12
    }
  }, t('textAccent')), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4 items-center"
  }, [['text', t('text')], ['accent', t('accent')]].map(_ref8 => {
    let [k, l] = _ref8;
    return /*#__PURE__*/React.createElement("label", {
      key: k,
      className: "flex flex-col items-center gap-1 cursor-pointer"
    }, /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: customColors[k],
      onChange: e => updateCustomColor(k, e.target.value),
      style: {
        width: 40,
        height: 40,
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        background: 'transparent'
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "opacity-50",
      style: {
        fontSize: 10
      }
    }, l));
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium opacity-80",
    style: {
      display: 'block',
      marginBottom: 12
    }
  }, t('bgImage')), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 items-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => bgImageInputRef.current.click(),
    className: "flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm"
  }, /*#__PURE__*/React.createElement(Upload, {
    size: 14
  }), " ", t('uploadImage')), customBgImage && /*#__PURE__*/React.createElement("button", {
    onClick: () => setCustomBgImage(''),
    className: "flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm opacity-60 hover:opacity-100"
  }, /*#__PURE__*/React.createElement(X, {
    size: 14
  }), " ", t('remove')), /*#__PURE__*/React.createElement("input", {
    type: "file",
    ref: bgImageInputRef,
    className: "hidden",
    accept: "image/*",
    onChange: handleBgImageUpload
  })), customBgImage && /*#__PURE__*/React.createElement("div", {
    className: "w-full rounded-xl overflow-hidden border border-white/10",
    style: {
      height: 96,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: customBgImage,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: 0.6
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "pt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg opacity-80"
  }, t('fonts')), /*#__PURE__*/React.createElement("button", {
    onClick: () => fileInputRef.current.click(),
    className: "text-sm flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
  }, /*#__PURE__*/React.createElement(Upload, {
    size: 14
  }), " ", t('importFont')), /*#__PURE__*/React.createElement("input", {
    type: "file",
    ref: fileInputRef,
    className: "hidden",
    accept: ".ttf,.otf,.woff",
    onChange: handleFontUpload
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, Object.entries(DEFAULT_FONTS).map(_ref9 => {
    let [key, f] = _ref9;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      onClick: () => setFont(key),
      style: f.style,
      className: "p-4 rounded-2xl border ".concat(font === key ? "bg-white/10 border-white/30 shadow-lg" : 'border-white/10 hover:bg-white/5')
    }, t(f.name));
  }), hasCustomFont && /*#__PURE__*/React.createElement("button", {
    onClick: () => setFont('custom'),
    className: "p-4 rounded-2xl border col-span-full ".concat(font === 'custom' ? "bg-white/10 border-white/30 shadow-lg" : 'border-white/10 hover:bg-white/5')
  }, t('imported'))))), /*#__PURE__*/React.createElement("section", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"
  }, /*#__PURE__*/React.createElement(Globe, {
    size: 24
  }), " ", t('worldClock')), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Search, {
    className: "absolute left-4 top-1/2 -translate-y-1/2 opacity-50",
    size: 18
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: t('searchCity'),
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    className: "w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:bg-white/10 transition-colors"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1"
  }, filteredZones.map(zone => {
    const isSelected = selectedZones.some(z => z.id === zone.id);
    return /*#__PURE__*/React.createElement("button", {
      key: zone.id,
      onClick: () => {
        if (isSelected) {
          setSelectedZones(prev => prev.filter(z => z.id !== zone.id));
        } else {
          setSelectedZones(prev => [...prev, zone]);
        }
      },
      className: "p-3 rounded-lg text-left flex justify-between items-center transition-all ".concat(isSelected ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-white/5 hover:bg-white/10 border border-transparent')
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-sm"
    }, t(zone.label)), isSelected && /*#__PURE__*/React.createElement(Check, {
      size: 16,
      className: "text-blue-400"
    }));
  }))), /*#__PURE__*/React.createElement("section", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"
  }, /*#__PURE__*/React.createElement(Settings, {
    size: 24
  }), " ", t('general')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, [['showMillis', showMillis, setShowMillis], ['notifications', notificationsEnabled, handleToggleNotifications], ['autoZenMode', autoZenMode, setAutoZenMode], ['showProgressRing', showProgressRing, setShowProgressRing], ['enableMiniTask', enableMiniTask, setEnableMiniTask], ['enableFocusAnalytics', enableFocusAnalytics, setEnableFocusAnalytics], ['enableMeetingPlanner', enableMeetingPlanner, setEnableMeetingPlanner]].map(_ref0 => {
    let [k, val, setVal] = _ref0;
    return /*#__PURE__*/React.createElement("label", {
      key: k,
      className: "flex items-center justify-between p-6 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
    }, /*#__PURE__*/React.createElement("span", null, t(k)), /*#__PURE__*/React.createElement("div", {
      onClick: () => k === 'notifications' ? handleToggleNotifications() : setVal(!val),
      className: "w-14 h-8 rounded-full relative transition-colors ".concat(val ? 'bg-blue-500' : 'bg-slate-600')
    }, /*#__PURE__*/React.createElement("div", {
      className: "absolute top-1 w-6 h-6 rounded-full bg-white transition-all ".concat(val ? 'left-7' : 'left-1')
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium opacity-80"
  }, t('ringPosition'))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3"
  }, ['left', 'right', 'background'].map(sk => /*#__PURE__*/React.createElement("button", {
    key: sk,
    onClick: () => setRingPosition(sk),
    className: "p-4 rounded-xl text-center text-sm transition-all border ".concat(ringPosition === sk ? 'bg-white/10 border-white/50 shadow-lg scale-105' : 'bg-white/5 border-transparent hover:bg-white/10')
  }, t("ring".concat(sk.charAt(0).toUpperCase() + sk.slice(1))))))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium opacity-80"
  }, t('alarmSound')), /*#__PURE__*/React.createElement("button", {
    onClick: playAlarm,
    className: "text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
  }, t('testSound'))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-3"
  }, ['none', 'beep', 'digital', 'bell'].map(sk => /*#__PURE__*/React.createElement("button", {
    key: sk,
    onClick: () => setAlarmSound(sk),
    className: "p-4 rounded-xl text-center text-sm transition-all border ".concat(alarmSound === sk ? 'bg-white/10 border-white/50 scale-105' : 'bg-white/5 border-transparent hover:bg-white/10')
  }, t("sound".concat(sk.charAt(0).toUpperCase() + sk.slice(1)))))))), /*#__PURE__*/React.createElement("section", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"
  }, /*#__PURE__*/React.createElement(Languages, {
    size: 24
  }), " ", t('language')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-4"
  }, Object.entries(I18N).map(_ref1 => {
    let [key, val] = _ref1;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      onClick: () => setLang(key),
      className: "p-4 rounded-2xl border text-center text-sm transition-all ".concat(lang === key ? 'bg-white/10 border-white/50 scale-105' : 'border-white/5 hover:bg-white/5')
    }, val.lang);
  }))), /*#__PURE__*/React.createElement("section", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"
  }, /*#__PURE__*/React.createElement(Share2, {
    size: 24
  }), " ", t('shareTheme')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: exportTheme,
    className: "p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center gap-2 transition-all"
  }, /*#__PURE__*/React.createElement(Download, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", null, t('export'))), /*#__PURE__*/React.createElement("button", {
    onClick: handleExportImage,
    disabled: isExporting,
    className: "p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center gap-2 transition-all"
  }, /*#__PURE__*/React.createElement(Camera, {
    size: 20,
    className: isExporting ? 'animate-pulse' : ''
  }), /*#__PURE__*/React.createElement("span", null, isExporting ? t('exporting') : t('exportImage'))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const code = prompt(t('importPrompt'));
      importTheme(code);
    },
    className: "p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center gap-2 transition-all"
  }, /*#__PURE__*/React.createElement(LayoutTemplate, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", null, t('import'))))), /*#__PURE__*/React.createElement("section", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"
  }, /*#__PURE__*/React.createElement(Download, {
    size: 24,
    className: "text-blue-400"
  }), " ", t('downloadApp')), /*#__PURE__*/React.createElement("div", {
    className: "p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm opacity-80 mb-6 leading-relaxed text-blue-100"
  }, t('appDesc')), /*#__PURE__*/React.createElement("button", {
    onClick: handleDownloadApp,
    disabled: isDownloadingApp,
    className: "w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
  }, /*#__PURE__*/React.createElement(Download, {
    size: 18,
    className: isDownloadingApp ? 'animate-bounce' : ''
  }), isDownloadingApp ? t('downloadingApp') : t('downloadApp')))), /*#__PURE__*/React.createElement("section", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    size: 24,
    className: "text-emerald-400"
  }), " ", t('updateTitle')), /*#__PURE__*/React.createElement("div", {
    className: "p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm opacity-60"
  }, t('currentVersion')), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-mono font-bold bg-white/10 px-3 py-1 rounded-full"
  }, "v", APP_VERSION)), /*#__PURE__*/React.createElement("p", {
    className: "text-sm opacity-60 mb-6 leading-relaxed"
  }, t('updateDesc')), updateStatus === 'new' ? /*#__PURE__*/React.createElement("button", {
    onClick: handleForceUpdate,
    className: "w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
  }, /*#__PURE__*/React.createElement(Download, {
    size: 18
  }), t('updateNow'), " (v", latestVersion, ")") : /*#__PURE__*/React.createElement("button", {
    onClick: handleCheckUpdate,
    disabled: updateStatus === 'checking',
    className: "w-full py-4 rounded-xl border font-medium active:scale-95 transition-all flex items-center justify-center gap-2 ".concat(updateStatus === 'latest' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/20 hover:bg-white/10')
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    size: 18,
    className: updateStatus === 'checking' ? 'animate-spin' : ''
  }), updateStatus === 'checking' ? t('checking') : updateStatus === 'latest' ? t('upToDate') : t('checkUpdate')))), /*#__PURE__*/React.createElement("section", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-medium flex items-center gap-3 border-b border-red-500/30 pb-4 text-red-400"
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 24
  }), " ", t('clearData')), /*#__PURE__*/React.createElement("div", {
    className: "p-6 rounded-2xl bg-red-500/5 border border-red-500/20"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm opacity-60 mb-6 leading-relaxed"
  }, t('clearDataDesc')), /*#__PURE__*/React.createElement("button", {
    onClick: handleClearData,
    className: "w-full py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/25 hover:border-red-500/60 active:scale-95 transition-all flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 18
  }), t('clearDataBtn')))), /*#__PURE__*/React.createElement("section", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"
  }, /*#__PURE__*/React.createElement(AlertCircle, {
    size: 24
  }), " ", t('legal')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("a", {
    href: "privacy.html",
    className: "p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all"
  }, t('privacy')), /*#__PURE__*/React.createElement("a", {
    href: "terms.html",
    className: "p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all"
  }, t('terms')), /*#__PURE__*/React.createElement("a", {
    href: "cookies.html",
    className: "p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all"
  }, t('cookies')), /*#__PURE__*/React.createElement("a", {
    href: "disclaimer.html",
    className: "p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all"
  }, t('disclaimer'))))))), !hasAgreed && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none",
    style: {
      background: 'linear-gradient(160deg, #020420 0%, #0a1628 30%, #111d3a 50%, #0d1a2f 70%, #040812 100%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 overflow-hidden pointer-events-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute w-[80vw] h-[80vw] rounded-full bg-blue-600/8 blur-[120px] -top-[20%] -left-[20%] animate-pulse"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute w-[60vw] h-[60vw] rounded-full bg-indigo-500/8 blur-[100px] -bottom-[10%] -right-[10%] animate-pulse",
    style: {
      animationDelay: '2s'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute w-[40vw] h-[40vw] rounded-full bg-cyan-500/5 blur-[80px] top-[40%] left-[50%] -translate-x-1/2 animate-pulse",
    style: {
      animationDelay: '4s'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 opacity-[0.03]",
    style: {
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
      backgroundSize: '40px 40px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative flex flex-col items-center text-center px-8 max-w-xl space-y-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-blue-500/10"
  }, /*#__PURE__*/React.createElement(Clock, {
    size: 36,
    className: "text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.4)]"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-5xl sm:text-7xl font-black text-white tracking-tight leading-[0.9]"
  }, "Clock", /*#__PURE__*/React.createElement("span", {
    className: "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500"
  }, "omistry")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 justify-center mt-6"
  }, Object.entries(I18N).map(_ref10 => {
    let [key, val] = _ref10;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      onClick: () => setLang(key),
      className: "px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border transition-all ".concat(lang === key ? 'bg-white/10 border-white/40' : 'border-transparent opacity-40 hover:opacity-100')
    }, val.lang);
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-base sm:text-lg text-slate-400 leading-relaxed max-w-md mx-auto font-light mt-6"
  }, t('splashDesc'), /*#__PURE__*/React.createElement("br", {
    className: "hidden sm:block"
  }), t('splashTerms'))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-center gap-3"
  }, [{
    label: t('privacy'),
    href: 'privacy.html'
  }, {
    label: t('terms'),
    href: 'terms.html'
  }, {
    label: t('cookies'),
    href: 'cookies.html'
  }, {
    label: t('disclaimer'),
    href: 'disclaimer.html'
  }].map((item, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: item.href,
    className: "px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.15] text-xs font-medium text-slate-500 hover:text-slate-300 transition-all duration-300"
  }, item.label))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setHasAgreed(true),
    className: "group relative px-12 py-5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-base tracking-wide transition-all duration-300 hover:shadow-[0_0_60px_-12px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-300"
  }), /*#__PURE__*/React.createElement("span", {
    className: "relative"
  }, t('agree')))), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-8 text-[10px] text-slate-600 tracking-[0.3em] uppercase"
  }, t('splashBottom'))), isScreenSaverActive && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[200] bg-black select-none cursor-none flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute flex flex-col items-center transition-all duration-[4000ms] ease-linear",
    style: {
      left: "".concat(ssPos.x, "%"),
      top: "".concat(ssPos.y, "%")
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-8xl sm:text-[120px] font-bold tracking-tighter opacity-80"
  }, h, /*#__PURE__*/React.createElement("span", {
    className: "animate-pulse"
  }, ":"), m), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 text-sm opacity-20 tracking-[1em] uppercase"
  }, t('ssHint')))), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ".concat(isZenMode ? 'opacity-20' : 'opacity-100')
  }, /*#__PURE__*/React.createElement("style", null, "\n                    @keyframes ambientFloat1 {\n                        0%, 100% { transform: translate(0, 0) scale(1); }\n                        33% { transform: translate(5vw, 5vh) scale(1.1); }\n                        66% { transform: translate(-5vw, 10vh) scale(0.9); }\n                    }\n                    @keyframes ambientFloat2 {\n                        0%, 100% { transform: translate(0, 0) scale(1); }\n                        33% { transform: translate(-5vw, -5vh) scale(1.2); }\n                        66% { transform: translate(5vw, -10vh) scale(0.8); }\n                    }\n                    .ambient-blob-1 { animation: ambientFloat1 25s ease-in-out infinite alternate; }\n                    .ambient-blob-2 { animation: ambientFloat2 30s ease-in-out infinite alternate; }\n                    \n                    /* Global tactical button squish */\n                    button:active { transform: scale(0.93) !important; transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1) !important; }\n                "), /*#__PURE__*/React.createElement("div", {
    className: "ambient-blob-1 absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-20 bg-blue-500/40"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ambient-blob-2 absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-20 bg-purple-500/40"
  })), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 w-full my-auto shrink-0 max-w-[95vw] md:max-w-4xl p-6 pb-44 sm:p-12 sm:pb-16 rounded-[3rem] transition-all duration-700 ".concat(!isCleanMode && !isZenMode ? currentTheme.card + ' border-t border-l' : 'shadow-none bg-transparent !border-transparent backdrop-blur-0', " flex flex-col items-center justify-center min-h-[50vh] ").concat(isZenMode ? 'scale-110' : '', " ").concat(isCleanMode ? 'scale-[0.85] !p-0' : '')
  }, ['timer', 'pomodoro', 'stopwatch'].includes(mode) && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center gap-2 bg-black/20 p-1.5 rounded-full border border-white/5 w-max animate-fade-in z-20 mb-8 mt-[-1rem] ".concat(isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:opacity-100'),
    style: {
      transition: 'opacity 0.3s ease'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode('pomodoro'),
    className: "px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ".concat(mode === 'pomodoro' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100')
  }, t('tabPomodoro')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode('timer'),
    className: "px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ".concat(mode === 'timer' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100')
  }, t('tabTimer')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode('stopwatch'),
    className: "px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ".concat(mode === 'stopwatch' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100')
  }, t('tabStopwatch'))), ['calendar', 'anniversary', 'memento'].includes(mode) && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center gap-2 bg-black/20 p-1.5 rounded-full border border-white/5 w-max animate-fade-in z-20 mb-8 mt-[-1rem] ".concat(isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:opacity-100'),
    style: {
      transition: 'opacity 0.3s ease'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode('calendar'),
    className: "px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ".concat(mode === 'calendar' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100')
  }, t('tabMonthly')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode('anniversary'),
    className: "px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ".concat(mode === 'anniversary' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100')
  }, t('tabEvents')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode('memento'),
    className: "px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ".concat(mode === 'memento' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100')
  }, t('tabLife'))), mode === 'clock' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center select-none"
  }, /*#__PURE__*/React.createElement(WeatherWidget, {
    weather: weather,
    accent: currentTheme.accent
  }), /*#__PURE__*/React.createElement(ClockDisplay, {
    h: h,
    m: m,
    s: s,
    ms: ms,
    showMillis: showMillis,
    accent: currentTheme.accent,
    dateLabel: formatDate(time)
  })), mode === 'world' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center select-none w-full"
  }, enableMeetingPlanner && /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-lg mb-8 px-6 py-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4 animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm opacity-80 font-medium"
  }, /*#__PURE__*/React.createElement("span", null, "-12h"), /*#__PURE__*/React.createElement("span", {
    className: currentTheme.accent
  }, meetingOffset > 0 ? "+".concat(meetingOffset, "h") : meetingOffset < 0 ? "".concat(meetingOffset, "h") : t('today')), /*#__PURE__*/React.createElement("span", null, "+12h")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "-12",
    max: "12",
    step: "1",
    value: meetingOffset,
    onDoubleClick: () => setMeetingOffset(0),
    onChange: e => setMeetingOffset(Number(e.target.value)),
    className: "w-full cursor-pointer opacity-80 hover:opacity-100 transition-opacity",
    style: {
      accentColor: '#3b82f6'
    },
    title: "Double click to reset"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-h-[50vh] overflow-y-auto custom-scrollbar p-4"
  }, selectedZones.map(zone => {
    const tWorld = getWorldTime(zone.id);
    return /*#__PURE__*/React.createElement("div", {
      key: zone.id,
      className: "flex flex-col items-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-3xl font-bold tracking-tighter"
    }, tWorld.h, ":", tWorld.m), /*#__PURE__*/React.createElement("div", {
      className: "text-sm opacity-60 mt-2 text-center uppercase tracking-wider"
    }, t(zone.label)));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSettings(true),
    className: "mt-8 flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity"
  }, /*#__PURE__*/React.createElement(Settings, {
    size: 14
  }), " ", t('addEditZones'))), mode === 'timer' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center select-none w-full max-w-lg mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center mb-12 w-full"
  }, isEditingTimer ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center w-full animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[14vw] md:text-[80px] font-bold tracking-tighter tabular-nums drop-shadow-2xl flex items-baseline gap-1 md:gap-2 mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: timerInput.slice(0, 2) === '00' ? 'opacity-30' : ''
  }, timerInput.slice(0, 2), /*#__PURE__*/React.createElement("span", {
    className: "text-xl md:text-2xl opacity-50 ml-1"
  }, "h")), /*#__PURE__*/React.createElement("span", {
    className: timerInput.slice(0, 4) === '0000' ? 'opacity-30' : ''
  }, timerInput.slice(2, 4), /*#__PURE__*/React.createElement("span", {
    className: "text-xl md:text-2xl opacity-50 ml-1"
  }, "min")), /*#__PURE__*/React.createElement("span", {
    className: timerInput === '000000' ? 'opacity-30' : ''
  }, timerInput.slice(4, 6), /*#__PURE__*/React.createElement("span", {
    className: "text-xl md:text-2xl opacity-50 ml-1"
  }, "s"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[280px]"
  }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'del'].map(btn => /*#__PURE__*/React.createElement("button", {
    key: btn,
    onClick: () => handleTimerInput(btn),
    className: "h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-2xl font-medium transition-all active:scale-95"
  }, btn === 'del' ? /*#__PURE__*/React.createElement(Delete, {
    size: 24
  }) : btn))), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 flex gap-6 z-30 relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsEditingTimer(false),
    className: "p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
  }, /*#__PURE__*/React.createElement(X, {
    size: 32
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const sec = getTimerInputSeconds();
      if (sec > 0) {
        setTimerInitial(sec);
        setTimerSeconds(sec);
        setIsEditingTimer(false);
        setIsTimerRunning(true);
        if (autoZenMode && !isZenMode) setIsZenMode(true);
      } else {
        setIsEditingTimer(false);
      }
    },
    className: "p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
  }, /*#__PURE__*/React.createElement(Play, {
    size: 32,
    className: currentTheme.accent
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "relative flex justify-center items-center w-full mt-4 p-8 flex-col ".concat(ringPosition === 'left' ? 'md:flex-row' : ringPosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-col')
  }, showProgressRing && /*#__PURE__*/React.createElement(ProgressRing, {
    progress: timerInitial > 0 ? timerSeconds / timerInitial * 100 : 0,
    accent: theme === 'custom' ? 'custom-accent text-white' : currentTheme.accent,
    position: ringPosition
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-[15vw] md:text-[120px] font-bold tracking-tighter tabular-nums drop-shadow-2xl cursor-pointer hover:opacity-80 transition-opacity flex items-baseline gap-1 md:gap-2 z-10",
    onClick: () => {
      if (!isTimerRunning) {
        setIsEditingTimer(true);
        setTimerInput('000000');
      }
    }
  }, timerSeconds >= 3600 && /*#__PURE__*/React.createElement("span", null, Math.floor(timerSeconds / 3600).toString().padStart(2, '0'), /*#__PURE__*/React.createElement("span", {
    className: "text-[6vw] md:text-[40px] opacity-50 ml-1"
  }, "h")), /*#__PURE__*/React.createElement("span", null, Math.floor(timerSeconds % 3600 / 60).toString().padStart(2, '0'), /*#__PURE__*/React.createElement("span", {
    className: "text-[6vw] md:text-[40px] opacity-50 ml-1"
  }, "min")), /*#__PURE__*/React.createElement("span", null, (timerSeconds % 60).toString().padStart(2, '0'), /*#__PURE__*/React.createElement("span", {
    className: "text-[6vw] md:text-[40px] opacity-50 ml-1"
  }, "s"))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 flex gap-6 z-30 relative ".concat(isEditingTimer ? 'hidden' : '', " ").concat(isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!isTimerRunning && timerSeconds <= 0) {
        if (timerInitial > 0) {
          setTimerSeconds(timerInitial);
        } else {
          setIsEditingTimer(true);
          setTimerInput('000000');
          return;
        }
      }
      if (!isTimerRunning && autoZenMode && !isZenMode) setIsZenMode(true);
      setIsTimerRunning(!isTimerRunning);
    },
    className: "p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
  }, isTimerRunning ? /*#__PURE__*/React.createElement(Pause, {
    size: 32
  }) : /*#__PURE__*/React.createElement(Play, {
    size: 32,
    className: currentTheme.accent
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setIsTimerRunning(false);
      setTimerSeconds(timerInitial > 0 ? timerInitial : 0);
    },
    className: "p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
  }, /*#__PURE__*/React.createElement(RotateCcw, {
    size: 32
  }))), /*#__PURE__*/React.createElement("div", {
    className: "w-full max-h-[30vh] sm:max-h-[40vh] overflow-y-auto custom-scrollbar space-y-3 p-2 border-t border-white/10 pt-6"
  }, multiTimers.map(timer => {
    const mins = Math.floor(timer.remaining / 60).toString().padStart(2, '0');
    const secs = (timer.remaining % 60).toString().padStart(2, '0');
    const pct = timer.initial > 0 ? timer.remaining / timer.initial * 100 : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: timer.id,
      className: "flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-3xl font-bold tabular-nums tracking-tighter"
    }, mins, ":", secs), /*#__PURE__*/React.createElement("div", {
      className: "w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full transition-all duration-1000 ".concat(pct > 20 ? 'bg-blue-500' : 'bg-red-500'),
      style: {
        width: "".concat(pct, "%")
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => toggleMultiTimer(timer.id),
      className: "p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
    }, timer.running ? /*#__PURE__*/React.createElement(Pause, {
      size: 18
    }) : /*#__PURE__*/React.createElement(Play, {
      size: 18,
      className: currentTheme.accent
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => resetMultiTimer(timer.id),
      className: "p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
    }, /*#__PURE__*/React.createElement(RotateCcw, {
      size: 18
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => deleteMultiTimer(timer.id),
      className: "p-2.5 rounded-full bg-white/10 hover:bg-red-500/30 transition-all"
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 18
    }))));
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-center gap-3 pt-4 pb-8 ".concat(isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100')
  }, [1, 3, 5, 10, 15, 30].map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => addMultiTimer(m),
    className: "px-4 py-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 text-sm transition-all"
  }, "+", m, "min"))))), mode === 'pomodoro' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center select-none mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4 mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => resetPomo('work'),
    className: "px-4 py-1 rounded-full text-sm border transition-all ".concat(pomoMode === 'work' ? "bg-white/10 border-white/50 ".concat(currentTheme.accent) : 'border-transparent opacity-50')
  }, t('work')), /*#__PURE__*/React.createElement("button", {
    onClick: () => resetPomo('short'),
    className: "px-4 py-1 rounded-full text-sm border transition-all ".concat(pomoMode === 'short' ? "bg-white/10 border-white/50 ".concat(currentTheme.accent) : 'border-transparent opacity-50')
  }, t('break')), /*#__PURE__*/React.createElement("button", {
    onClick: () => resetPomo('long'),
    className: "px-4 py-1 rounded-full text-sm border transition-all ".concat(pomoMode === 'long' ? "bg-white/10 border-white/50 ".concat(currentTheme.accent) : 'border-transparent opacity-50')
  }, t('long'))), /*#__PURE__*/React.createElement("div", {
    className: "relative flex justify-center items-center w-full mt-4 p-8 flex-col ".concat(ringPosition === 'left' ? 'md:flex-row' : ringPosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-col')
  }, showProgressRing && /*#__PURE__*/React.createElement(ProgressRing, {
    progress: pomoSeconds / (pomoMode === 'work' ? 25 * 60 : pomoMode === 'short' ? 5 * 60 : 15 * 60) * 100,
    accent: theme === 'custom' ? 'custom-accent text-white' : currentTheme.accent,
    position: ringPosition
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-[15vw] md:text-[120px] font-bold tracking-tighter tabular-nums drop-shadow-2xl z-10 flex items-baseline gap-1 md:gap-2"
  }, /*#__PURE__*/React.createElement("span", null, Math.floor(pomoSeconds / 60).toString().padStart(2, '0'), /*#__PURE__*/React.createElement("span", {
    className: "text-[6vw] md:text-[40px] opacity-50 ml-1"
  }, "min")), /*#__PURE__*/React.createElement("span", null, (pomoSeconds % 60).toString().padStart(2, '0'), /*#__PURE__*/React.createElement("span", {
    className: "text-[6vw] md:text-[40px] opacity-50 ml-1"
  }, "s")))), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 flex gap-6 z-30 relative ".concat(isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!isPomoRunning && pomoSeconds <= 0) resetPomo(pomoMode);
      if (!isPomoRunning && autoZenMode && !isZenMode) setIsZenMode(true);
      setIsPomoRunning(!isPomoRunning);
    },
    className: "p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
  }, isPomoRunning ? /*#__PURE__*/React.createElement(Pause, {
    size: 32
  }) : /*#__PURE__*/React.createElement(Play, {
    size: 32,
    className: currentTheme.accent
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => resetPomo(pomoMode),
    className: "p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
  }, /*#__PURE__*/React.createElement(RotateCcw, {
    size: 32
  }))), enableMiniTask && /*#__PURE__*/React.createElement("div", {
    className: "mt-8 flex items-center justify-center w-[80vw] max-w-sm transition-opacity duration-500 relative ".concat(isZenMode ? 'opacity-0' : 'opacity-100')
  }, /*#__PURE__*/React.createElement(Target, {
    size: 18,
    className: "absolute left-2 opacity-30 pointer-events-none"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: t('focusGoal'),
    value: focusGoal,
    onChange: e => setFocusGoal(e.target.value),
    className: "w-full text-center bg-transparent border-b border-white/20 focus:border-white/60 py-2 outline-none text-base transition-colors placeholder:text-white/20 text-inherit",
    style: {
      color: 'inherit'
    }
  })), enableFocusAnalytics && /*#__PURE__*/React.createElement("div", {
    className: "mt-6 w-[80vw] max-w-sm p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-2 transition-opacity duration-500 ".concat(isZenMode ? 'opacity-0' : 'opacity-100')
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-medium opacity-80 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(BarChart2, {
    size: 14
  }), " ", t('focusStats')), /*#__PURE__*/React.createElement("div", {
    className: "opacity-50"
  }, Object.keys(focusStats).slice(-7).length, " Days")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, Math.floor(Object.values(focusStats).reduce((a, b) => a + b, 0) / 60), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-xs opacity-50 font-normal"
  }, "mins (total)")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end gap-1.5 h-12 mt-1 w-full mx-auto justify-between px-1"
  }, [...Array(7)].map((_, i) => {
    const dateStrs = Object.keys(focusStats).sort();
    const ds = dateStrs.slice(-7)[i];
    const max = Math.max(...Object.values(focusStats), 1);
    const val = ds ? focusStats[ds] : 0;
    const pct = ds ? val / max * 100 : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "flex-1 rounded-sm opacity-60 hover:opacity-100 transition-all ".concat(pct === 0 ? 'bg-white/10' : ''),
      style: {
        height: pct > 0 ? "max(4px, ".concat(pct, "%)") : '4px',
        background: pct > 0 ? theme === 'custom' ? customColors.accent : currentTheme.bg.includes('50') ? '#3b82f6' : '#60a5fa' : ''
      },
      title: ds ? "".concat(ds, ": ").concat(Math.floor(val / 60), "m") : ''
    });
  })))), mode === 'stopwatch' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center select-none w-full min-w-[300px] mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[15vw] md:text-[120px] font-bold tracking-tighter tabular-nums flex items-baseline"
  }, /*#__PURE__*/React.createElement("span", null, stopwatch.m), /*#__PURE__*/React.createElement("span", {
    className: "opacity-50 mx-1"
  }, ":"), /*#__PURE__*/React.createElement("span", null, stopwatch.s), /*#__PURE__*/React.createElement("span", {
    className: "text-[8vw] md:text-[60px] ml-1 md:ml-2 ".concat(currentTheme.accent)
  }, ".", stopwatch.cs)), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 flex gap-6 z-30 relative ".concat(isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsStopwatchRunning(!isStopwatchRunning),
    className: "p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
  }, isStopwatchRunning ? /*#__PURE__*/React.createElement(Pause, {
    size: 32
  }) : /*#__PURE__*/React.createElement(Play, {
    size: 32,
    className: currentTheme.accent
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (isStopwatchRunning) setLaps([stopwatchTime, ...laps]);else {
        setStopwatchTime(0);
        setLaps([]);
      }
    },
    className: "p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
  }, isStopwatchRunning ? /*#__PURE__*/React.createElement(Plus, {
    size: 32
  }) : /*#__PURE__*/React.createElement(RotateCcw, {
    size: 32
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 w-full max-h-32 overflow-y-auto custom-scrollbar"
  }, laps.map((lap, i) => {
    const d = formatDuration(lap);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "flex justify-between px-6 py-2 border-b border-white/5 opacity-80"
    }, /*#__PURE__*/React.createElement("span", null, t('lap'), " ", laps.length - i), /*#__PURE__*/React.createElement("span", null, d.m, ":", d.s, ".", d.cs));
  }))), mode === 'calendar' && calendarView, mode === 'anniversary' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center select-none w-full max-w-lg mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-h-[50vh] overflow-y-auto custom-scrollbar space-y-4 p-2"
  }, anniversaries.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-center opacity-40 py-12"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 48,
    className: "mx-auto mb-4 opacity-20"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-lg"
  }, t('addEvent'))), anniversaries.map(ev => {
    const target = new Date(ev.date);
    const diff = target - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const isFuture = days >= 0;
    return /*#__PURE__*/React.createElement("div", {
      key: ev.id,
      className: "flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10 group hover:bg-white/10 transition-all"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-bold"
    }, ev.label), /*#__PURE__*/React.createElement("div", {
      className: "text-xs opacity-40 mt-1 uppercase tracking-widest"
    }, ev.date)), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-3xl font-black ".concat(isFuture ? currentTheme.accent : 'opacity-40')
    }, Math.abs(days)), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] opacity-40 uppercase tracking-tighter"
    }, isFuture ? t('daysLeft') : t('daysAgo'))), /*#__PURE__*/React.createElement("button", {
      onClick: () => setAnniversaries(prev => prev.filter(a => a.id !== ev.id)),
      className: "p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 16
    }))));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const label = prompt(t('eventName'));
      const date = prompt(t('date'), '2026-01-01');
      if (label && date) setAnniversaries([...anniversaries, {
        id: Date.now(),
        label,
        date
      }]);
    },
    className: "mt-8 px-8 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center gap-2 transition-all"
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 20
  }), " ", t('addEvent'))), mode === 'memento' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center select-none w-full max-w-2xl animate-fade-in relative mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col mb-8 text-center bg-black/40 backdrop-blur-md px-12 py-6 rounded-[2rem] border border-white/10 w-full pb-8"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl font-black tracking-widest uppercase mb-6 mt-2"
  }, t('memento')), /*#__PURE__*/React.createElement("label", {
    className: "text-sm opacity-80 flex flex-col items-center gap-3 w-full"
  }, /*#__PURE__*/React.createElement("span", {
    className: "uppercase tracking-widest text-white/50"
  }, t('birthDate')), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: birthDate,
    onChange: e => setBirthDate(e.target.value),
    className: "bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none text-white text-lg w-full max-w-xs transition-all hover:bg-white/20 focus:bg-white/20 focus:border-white/40 font-mono tracking-widest",
    style: {
      colorScheme: 'dark'
    }
  })), mementoView))), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-40 shrink-0"
  }), /*#__PURE__*/React.createElement(NavigationBar, {
    mode: mode,
    setMode: setMode,
    isZenMode: isZenMode,
    accent: currentTheme.accent,
    showControls: showControls,
    toggleFullscreen: toggleFullscreen,
    setShowSettings: setShowSettings,
    setIsZenMode: setIsZenMode,
    isCleanMode: isCleanMode,
    t: t
  }));
}
createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
