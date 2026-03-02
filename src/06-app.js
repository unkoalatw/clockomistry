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

    const [selectedZones, setSelectedZones] = useLocalJSON('clock_zones', () => [
        ALL_ZONES.find(z => z.id === 'Asia/Taipei'),
        ALL_ZONES.find(z => z.id === 'America/New_York'),
        ALL_ZONES.find(z => z.id === 'Europe/London'),
        ALL_ZONES.find(z => z.id === 'Asia/Tokyo')
    ].filter(Boolean), (parsed) => {
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
    const [activeSettingsTab, setActiveSettingsTab] = useState('appearance');
    const [searchQuery, setSearchQuery] = useState('');
    const [hasCustomFont, setHasCustomFont] = useState(false);
    const [hasAgreed, setHasAgreed] = useLocalBoolean('clock_agreed', false);

    const [customColors, setCustomColors] = useLocalJSON('clock_custom_colors', { bg1: '#0a0a1a', bg2: '#1a1a3e', bg3: '#0a0a1a', text: '#e2e8f0', accent: '#22d3ee' });
    const [customBgImage, setCustomBgImage] = useLocalString('clock_custom_bg', '');

    const [lang, setLang] = useLocalString('clock_lang', () => {
        const browserLang = navigator.language.split('-')[0];
        if (I18N[browserLang]) return browserLang;
        if (navigator.language === 'zh-CN' || navigator.language === 'zh-HK') return 'zh-TW';
        return 'zh-TW';
    });

    // Anniversary 狀態
    const [anniversaries, setAnniversaries] = useLocalJSON('clock_anniversaries', []);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [newEventName, setNewEventName] = useState('');
    const [newEventDate, setNewEventDate] = useState('');

    // Advance Features 狀態
    const [focusGoal, setFocusGoal] = useLocalString('clock_focusGoal', '');
    const [focusStats, setFocusStats] = useLocalJSON('clock_focusStats', {});
    const [meetingOffset, setMeetingOffset] = useState(0);

    // Weather 狀態
    const [weather, setWeather] = useState({ temp: '--', condition: '', city: '--', sunrise: null, sunset: null });

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
    const [alarmSound, setAlarmSound] = useLocalString('clock_alarmSound', 'beep');
    const [notificationsEnabled, setNotificationsEnabled] = useLocalBoolean('clock_notifications', true);
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
    // The explicit useEffect syncing logic is now automatically managed by the custom hooks above!

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

            // 使用 Open-Meteo 獲取天氣與日出日落
            const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=sunrise,sunset&timezone=auto`);
            const wData = await wRes.json();
            const code = wData.current_weather.weathercode;
            const sunriseStr = wData.daily?.sunrise?.[0];
            const sunsetStr = wData.daily?.sunset?.[0];

            // 簡易天氣代碼轉中文/英文
            const conditionMap = {
                0: 'Clear', 1: 'Cloudy', 2: 'Cloudy', 3: 'Overcast',
                45: 'Fog', 48: 'Fog', 51: 'Drizzle', 61: 'Rain',
                71: 'Snow', 95: 'Storm'
            };

            const formatHm = (isoStr) => {
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
                    ignoreElements: (el) => el.classList.contains('hide-on-export')
                });
                const link = document.createElement('a');
                link.download = `clockomistry-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (err) { }
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
            triggerSuccess();

            // 自動切換模式或播放鈴聲（這裡先簡單處理）
            if (pomoMode === 'work') {
                if (enableFocusAnalytics) {
                    const today = new Date().toISOString().split('T')[0];
                    setFocusStats(prev => ({
                        ...prev,
                        [today]: (prev[today] || 0) + (25 * 60)
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
        const handleBtnClick = (e) => {
            if (e.target.closest('button')) triggerHaptic();
        };
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.code === 'Space') {
                e.preventDefault();
                triggerHaptic();
                if (mode === 'timer') {
                    if (isTimerRunning) setIsTimerRunning(false);
                    else if (timerSeconds > 0) setIsTimerRunning(true);
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
            const res = await fetch('https://api.github.com/repos/unkoalatw/clockomistry/releases/latest');
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            const apkAsset = data.assets?.find(a => a.name.endsWith('.apk'));
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
            // Fetch package.json or use release tag from GitHub API
            const res = await fetch('https://api.github.com/repos/unkoalatw/clockomistry/releases/latest');
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            const remoteTag = data.tag_name?.replace(/^v/, '') || '';
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

    const formatDate = (date) => date.toLocaleDateString(t('locale'), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const getWorldTime = (timezone) => {
        try {
            const d = new Date(Date.now() + meetingOffset * 3600 * 1000);
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
    const containerStyle = theme === 'custom' && !isCleanMode ? {
        ...currentFontStyle,
        background: customBgImage
            ? `linear-gradient(${customColors.bg1}cc, ${customColors.bg1}cc), url(${customBgImage}) center/cover no-repeat fixed`
            : `linear-gradient(135deg, ${customColors.bg1}, ${customColors.bg2}, ${customColors.bg3})`,
        color: customColors.text
    } : currentFontStyle;

    const calendarView = useMemo(() => {
        if (mode !== 'calendar') return null;
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
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 540, userSelect: 'none', marginTop: '48px' }}>
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
                </div>

                <div style={{ fontSize: 24, fontWeight: 400, opacity: 0.9, letterSpacing: -0.5, marginBottom: 24 }}>
                    <span style={{ fontWeight: 600, marginRight: 8, color: `var(--${currentTheme.accent})` }}>{year}</span>
                    <span>{monthNames[month]}</span>
                </div>

                <div style={grid7}>
                    {dayLabels.map((lbl, i) => (
                        <div key={i} style={{ width: '100%', textAlign: 'center', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, paddingBottom: 12, color: 'rgba(255,255,255,0.4)', userSelect: 'none' }}>
                            {lbl}
                        </div>
                    ))}

                    <div style={{ ...grid7, gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        {cells.map((cell, i) => {
                            const isToday = cell.type === 'current' && isTodayDate(cell.day);
                            const colIndex = i % 7;
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
                                        borderLeft: colIndex === 0 ? borderStyle : 'none',
                                        cursor: cell.type === 'current' ? 'pointer' : 'default'
                                    }}
                                    className="hover:bg-white/5 transition-colors"
                                    onClick={() => {
                                        if (cell.type === 'current') {
                                            const selectedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
                                            setNewEventDate(selectedDateStr);
                                            setNewEventName('');
                                            setIsAddingEvent(true);
                                            setMode('anniversary');
                                        }
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
            </div>
        );
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
        const pct = birthDate ? Math.min(100, Math.floor((livedWeeksCount / totalWeeksCount) * 100)) : 0;

        return (
            <div className="w-full mt-8">
                <div className="flex justify-between text-xs opacity-60 mb-4 px-2 font-mono uppercase tracking-[0.2em]">
                    <span>{t('livedWeeks')} : {livedWeeksCount}</span>
                    <span>{pct}% - {t('totalWeeks')}</span>
                </div>
                <div className="relative w-full rounded-2xl overflow-hidden bg-black/50 border flex border-white/5 p-4 sm:p-6" style={{ display: 'grid', gridTemplateColumns: `repeat(${weeksPerYear}, 1fr)`, gap: '2px', alignContent: 'start' }}>
                    {Array.from({ length: totalWeeksCount }).map((_, i) => {
                        const isLived = i < livedWeeksCount;
                        return <div key={i} className={`w-full aspect-square rounded-[1px] ${isLived ? 'bg-indigo-400' : 'bg-white/10'}`} style={{ opacity: isLived ? 0.9 : 0.2 }} title={`Week ${i + 1}`} />;
                    })}
                </div>
            </div>
        )
    }, [birthDate, lang, currentTheme, mode]);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            style={containerStyle}
            className={`h-[100dvh] w-full flex flex-col items-center pt-4 sm:pt-8 pb-32 transition-all duration-1000 ${theme !== 'custom' && !isCleanMode ? `bg-gradient-to-br ${currentTheme.gradient} ${currentTheme.text}` : ''} ${isCleanMode ? 'bg-transparent text-white' : ''} overflow-hidden relative selection:bg-pink-500 selection:text-white`}
        >
            {theme === 'custom' && <style>{`
                .custom-accent { color: ${customColors.accent}; }
                .custom-card { background: ${customColors.bg1}33; border-color: ${customColors.text}1a; box-shadow: 0 8px 32px 0 rgba(0,0,0,0.36); }
                .custom-settings { background: ${customColors.bg1}e6; backdrop-filter: blur(64px); }
            `}</style>}
            {/* Toast */}
            <div className={`hide-on-export fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${errorMsg ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className={`px-6 py-3 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 bg-slate-800/90 text-white`}>
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">{errorMsg}</span>
                </div>
            </div>

            {/* Settings Overlay */}
            {showSettings && (
                <div className={`fixed inset-0 z-[60] ${currentTheme.settingsBg} backdrop-blur-3xl animate-in fade-in duration-300 flex flex-col md:flex-row overflow-hidden`}>
                    <div className="md:w-1/3 lg:w-1/4 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col">
                        <button onClick={() => setShowSettings(false)} className="mb-4 sm:mb-8 p-2 -ml-2 hover:bg-white/10 rounded-full flex items-center gap-2 opacity-60 hover:opacity-100 group w-max">
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            <span>{t('back')}</span>
                        </button>
                        <h2 className="text-4xl font-bold tracking-wider mb-2">{t('settings')}</h2>
                        <p className="opacity-50 text-lg mb-8">{t('settingsDesc')}</p>

                        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto hide-scroll pb-2 md:pb-0">
                            {[
                                { id: 'appearance', icon: Palette, label: t('appearance') },
                                { id: 'general', icon: Settings, label: t('general') },
                                { id: 'features', icon: Globe, label: t('features') },
                                { id: 'system', icon: Download, label: t('system') },
                                { id: 'about', icon: AlertCircle, label: t('about') }
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setActiveSettingsTab(tab.id)} className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all whitespace-nowrap text-left ${activeSettingsTab === tab.id ? 'bg-white/10 font-bold text-white shadow-lg' : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}>
                                    <tab.icon size={20} className={activeSettingsTab === tab.id ? currentTheme.accent : ''} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                        <div className="max-w-3xl mx-auto space-y-12 pb-24">
                            {activeSettingsTab === 'appearance' && (
                                <section className="space-y-6 animate-fade-in">
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
                            )}

                            {activeSettingsTab === 'features' && (
                                <section className="space-y-12 animate-fade-in">
                                    <div className="space-y-6">
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
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Languages size={24} /> {t('language')}</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {Object.entries(I18N).map(([key, val]) => (
                                                <button key={key} onClick={() => setLang(key)} className={`p-4 rounded-2xl border text-center text-sm transition-all ${lang === key ? 'bg-white/10 border-white/50 shadow-lg scale-105' : 'border-white/5 hover:bg-white/5'}`}>{val.lang}</button>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeSettingsTab === 'general' && (
                                <section className="space-y-12 animate-fade-in">
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Settings size={24} /> {t('general')}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[['showMillis', showMillis, setShowMillis],
                                            ['notifications', notificationsEnabled, handleToggleNotifications],
                                            ['autoZenMode', autoZenMode, setAutoZenMode],
                                            ['showProgressRing', showProgressRing, setShowProgressRing],
                                            ['enableMiniTask', enableMiniTask, setEnableMiniTask],
                                            ['enableFocusAnalytics', enableFocusAnalytics, setEnableFocusAnalytics],
                                            ['enableMeetingPlanner', enableMeetingPlanner, setEnableMeetingPlanner]].map(([k, val, setVal]) => (
                                                <label key={k} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                                    <span>{t(k)}</span>
                                                    <div onClick={() => k === 'notifications' ? handleToggleNotifications() : setVal(!val)} className={`w-14 h-8 rounded-full relative transition-colors ${val ? 'bg-blue-500' : 'bg-slate-600'}`}>
                                                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${val ? 'left-7' : 'left-1'}`} />
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-sm font-medium opacity-80">{t('ringPosition')}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['left', 'right', 'background'].map(sk => (
                                                    <button
                                                        key={sk}
                                                        onClick={() => setRingPosition(sk)}
                                                        className={`p-4 rounded-xl text-center text-sm transition-all border ${ringPosition === sk ? 'bg-white/10 border-white/50 shadow-lg scale-105' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                                    >
                                                        {t(`ring${sk.charAt(0).toUpperCase() + sk.slice(1)}`)}
                                                    </button>
                                                ))}
                                            </div>
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
                                    </div>
                                </section>
                            )}

                            {activeSettingsTab === 'about' && (
                                <section className="space-y-12 animate-fade-in">
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Share2 size={24} /> {t('shareTheme')}</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button onClick={exportTheme} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center gap-2 transition-all">
                                                <Download size={20} />
                                                <span>{t('export')}</span>
                                            </button>
                                            <button onClick={handleExportImage} disabled={isExporting} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center gap-2 transition-all">
                                                <Camera size={20} className={isExporting ? 'animate-pulse' : ''} />
                                                <span>{isExporting ? t('exporting') : t('exportImage')}</span>
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
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><AlertCircle size={24} /> {t('legal')}</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <a href="privacy.html" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all">{t('privacy')}</a>
                                            <a href="terms.html" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all">{t('terms')}</a>
                                            <a href="cookies.html" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all">{t('cookies')}</a>
                                            <a href="disclaimer.html" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-sm transition-all">{t('disclaimer')}</a>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeSettingsTab === 'system' && (
                                <section className="space-y-12 animate-fade-in">
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Download size={24} className="text-blue-400" /> {t('downloadApp')}</h3>
                                        <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                            <p className="text-sm opacity-80 mb-6 leading-relaxed text-blue-100">{t('appDesc')}</p>
                                            <button
                                                onClick={handleDownloadApp}
                                                disabled={isDownloadingApp}
                                                className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                            >
                                                <Download size={18} className={isDownloadingApp ? 'animate-bounce' : ''} />
                                                {isDownloadingApp ? t('downloadingApp') : t('downloadApp')}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><RefreshCw size={24} className="text-emerald-400" /> {t('updateTitle')}</h3>
                                        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-sm opacity-60">{t('currentVersion')}</span>
                                                <span className="text-sm font-mono font-bold bg-white/10 px-3 py-1 rounded-full">v{APP_VERSION}</span>
                                            </div>
                                            <p className="text-sm opacity-60 mb-6 leading-relaxed">{t('updateDesc')}</p>
                                            {updateStatus === 'new' ? (
                                                <button
                                                    onClick={handleForceUpdate}
                                                    className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                                >
                                                    <Download size={18} />
                                                    {t('updateNow')} (v{latestVersion})
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleCheckUpdate}
                                                    disabled={updateStatus === 'checking'}
                                                    className={`w-full py-4 rounded-xl border font-medium active:scale-95 transition-all flex items-center justify-center gap-2 ${updateStatus === 'latest'
                                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <RefreshCw size={18} className={updateStatus === 'checking' ? 'animate-spin' : ''} />
                                                    {updateStatus === 'checking' ? t('checking') : updateStatus === 'latest' ? t('upToDate') : t('checkUpdate')}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-xl font-medium flex items-center gap-3 border-b border-red-500/30 pb-4 text-red-400"><Trash2 size={24} /> {t('clearData')}</h3>
                                        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                                            <p className="text-sm opacity-60 mb-6 leading-relaxed">{t('clearDataDesc')}</p>
                                            <button
                                                onClick={handleClearData}
                                                className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/25 hover:border-red-500/60 active:scale-95 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Trash2 size={18} />
                                                {t('clearDataBtn')}
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div >
            )
            }

            {/* Full-Screen Welcome Splash */}
            {
                !hasAgreed && (
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
                )
            }

            {/* Screen Saver Overaly */}
            {
                isScreenSaverActive && (
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
                )
            }

            {/* Decor - Optimized blurs with Ambient Animations */}
            <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${isZenMode ? 'opacity-20' : 'opacity-100'}`}>
                <style>{`
                    /* Hide UI during clean/zen mode (smoothly) */
                    .hide-on-export { transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease; }
                    .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
                    
                    /* Custom Scrollbar */
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); }

                    /* Smooth transitions for Zen Mode scaling */
                    .transition-zen { transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
                    @keyframes ambientFloat1 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(5vw, 5vh) scale(1.1); }
                        66% { transform: translate(-5vw, 10vh) scale(0.9); }
                    }
                    @keyframes ambientFloat2 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(-5vw, -5vh) scale(1.2); }
                        66% { transform: translate(5vw, -10vh) scale(0.8); }
                    }
                    .ambient-blob-1 { animation: ambientFloat1 25s ease-in-out infinite alternate; }
                    .ambient-blob-2 { animation: ambientFloat2 30s ease-in-out infinite alternate; }
                    
                    /* Global tactical button squish */
                    button:active { transform: scale(0.93) !important; transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1) !important; }
                `}</style>
                <div className="ambient-blob-1 absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-20 bg-blue-500/40"></div>
                <div className="ambient-blob-2 absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-20 bg-purple-500/40"></div>
            </div>

            {/* Main Card */}
            <div className={`relative z-10 w-full my-auto shrink max-h-[calc(100dvh-80px)] overflow-hidden max-w-[95vw] md:max-w-4xl rounded-[30px] sm:rounded-[48px] transition-zen flex flex-col items-center justify-start min-h-[40vh] ${!isCleanMode && !isZenMode ? currentTheme.card + ' border-t border-l' : 'shadow-none bg-transparent !border-transparent backdrop-blur-0'} ${isZenMode ? 'scale-[1.05]' : ''} ${isCleanMode ? 'scale-[0.85]' : ''}`}>

                {/* Fixed Top Navigation Arrays */}
                {(!isCleanMode && !isZenMode) && (
                    <div className="w-full flex flex-col items-center pt-4 sm:pt-6 pb-2 shrink-0 z-50 transition-opacity duration-300">
                        {['timer', 'pomodoro', 'stopwatch'].includes(mode) && (
                            <div className="flex justify-center gap-2 bg-black/40 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-lg shadow-black/20" style={{ transition: 'opacity 0.3s ease' }}>
                                <button onClick={() => setMode('pomodoro')} className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${mode === 'pomodoro' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100'}`}>{t('tabPomodoro')}</button>
                                <button onClick={() => setMode('timer')} className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${mode === 'timer' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100'}`}>{t('tabTimer')}</button>
                                <button onClick={() => setMode('stopwatch')} className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${mode === 'stopwatch' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100'}`}>{t('tabStopwatch')}</button>
                            </div>
                        )}

                        {['calendar', 'anniversary', 'memento'].includes(mode) && (
                            <div className="flex justify-center gap-2 bg-black/40 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-lg shadow-black/20" style={{ transition: 'opacity 0.3s ease' }}>
                                <button onClick={() => setMode('calendar')} className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${mode === 'calendar' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100'}`}>{t('tabMonthly')}</button>
                                <button onClick={() => setMode('anniversary')} className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${mode === 'anniversary' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100'}`}>{t('tabEvents')}</button>
                                <button onClick={() => setMode('memento')} className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${mode === 'memento' ? 'bg-white/20 shadow-sm text-white' : 'opacity-60 hover:opacity-100'}`}>{t('tabLife')}</button>
                            </div>
                        )}

                        {/* Pomodoro Sub-Navigation - Also Fixed */}
                        {mode === 'pomodoro' && (
                            <div className="w-full flex justify-center mt-4 shrink-0 z-40">
                                <div className="flex gap-4 transition-opacity duration-300">
                                    <button onClick={() => resetPomo('work')} className={`px-4 py-1.5 rounded-full text-sm border transition-all ${pomoMode === 'work' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50'}`}>{t('work')}</button>
                                    <button onClick={() => resetPomo('short')} className={`px-4 py-1.5 rounded-full text-sm border transition-all ${pomoMode === 'short' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50'}`}>{t('break')}</button>
                                    <button onClick={() => resetPomo('long')} className={`px-4 py-1.5 rounded-full text-sm border transition-all ${pomoMode === 'long' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50'}`}>{t('long')}</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* SCROLLABLE BODY */}
                <div className={`w-full flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start ${isCleanMode || isZenMode || mode === 'clock' || mode === 'world' ? 'p-6 sm:p-12' : 'px-6 sm:px-12 pb-12 pt-4 sm:pt-6'}`}>
                    {mode === 'clock' && (
                        <div className="flex flex-col items-center select-none">
                            <WeatherWidget weather={weather} accent={currentTheme.accent} />
                            <ClockDisplay h={h} m={m} s={s} ms={ms} showMillis={showMillis} accent={currentTheme.accent} dateLabel={formatDate(time)} isZenMode={isZenMode} />
                        </div>
                    )}

                    {mode === 'world' && (
                        <div className="flex flex-col items-center select-none w-full">
                            {enableMeetingPlanner && (
                                <div className="w-full max-w-lg mb-8 px-6 py-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4 animate-fade-in">
                                    <div className="flex justify-between text-sm opacity-80 font-medium">
                                        <span>-12h</span>
                                        <span className={currentTheme.accent}>{meetingOffset > 0 ? `+${meetingOffset}h` : meetingOffset < 0 ? `${meetingOffset}h` : t('today')}</span>
                                        <span>+12h</span>
                                    </div>
                                    <input type="range" min="-12" max="12" step="1" value={meetingOffset} onDoubleClick={() => setMeetingOffset(0)} onChange={e => setMeetingOffset(Number(e.target.value))} className="w-full cursor-pointer opacity-80 hover:opacity-100 transition-opacity" style={{ accentColor: '#3b82f6' }} title="Double click to reset" />
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-h-[50vh] overflow-y-auto custom-scrollbar p-4">
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
                        <div className="flex flex-col items-center select-none w-full max-w-lg mt-4 sm:mt-8">
                            <div className="flex flex-col items-center mb-6 sm:mb-12 w-full">
                                {isEditingTimer ? (
                                    <div className="flex flex-col items-center w-full animate-fade-in">
                                        <div className="text-[14vw] md:text-[80px] font-bold tracking-tighter tabular-nums drop-shadow-2xl flex items-baseline gap-1 md:gap-2 mb-6">
                                            <span className={timerInput.slice(0, 2) === '00' ? 'opacity-30' : ''}>{timerInput.slice(0, 2)}<span className="text-xl md:text-2xl opacity-50 ml-1">h</span></span>
                                            <span className={timerInput.slice(0, 4) === '0000' ? 'opacity-30' : ''}>{timerInput.slice(2, 4)}<span className="text-xl md:text-2xl opacity-50 ml-1">min</span></span>
                                            <span className={timerInput === '000000' ? 'opacity-30' : ''}>{timerInput.slice(4, 6)}<span className="text-xl md:text-2xl opacity-50 ml-1">s</span></span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-[280px]">
                                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'del'].map(btn => (
                                                <button key={btn} onClick={() => handleTimerInput(btn)} className="h-[clamp(3.5rem,7vh,4rem)] rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-xl sm:text-2xl font-medium transition-all active:scale-95">
                                                    {btn === 'del' ? <Delete size={24} /> : btn}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-8 flex gap-6 z-30 relative">
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
                                                    if (autoZenMode && !isZenMode) setIsZenMode(true);
                                                } else {
                                                    setIsEditingTimer(false);
                                                }
                                            }} className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all`}>
                                                <Play size={32} className={currentTheme.accent} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`relative flex justify-center items-center w-full mt-2 p-2 sm:p-4 flex-col ${ringPosition === 'left' ? 'md:flex-row' : ringPosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-col'}`}>
                                        {showProgressRing && <ProgressRing progress={timerInitial > 0 ? (timerSeconds / timerInitial) * 100 : 0} accent={theme === 'custom' ? 'custom-accent text-white' : currentTheme.accent} position={ringPosition} />}
                                        <div
                                            className={`font-bold tracking-tighter tabular-nums drop-shadow-2xl cursor-pointer hover:opacity-80 transition-all flex items-baseline gap-1 md:gap-2 z-10 text-[15vw] md:text-[120px]`}
                                            onClick={() => {
                                                if (!isTimerRunning) {
                                                    setIsEditingTimer(true);
                                                    setTimerInput('000000');
                                                }
                                            }}
                                        >
                                            {timerSeconds >= 3600 && <span>{Math.floor(timerSeconds / 3600).toString().padStart(2, '0')}<span className={`font-light opacity-50 ml-1 ${isZenMode ? 'text-[4vw] md:text-[32px]' : 'text-[3vw] md:text-[24px]'}`}>h</span></span>}
                                            <span>{Math.floor((timerSeconds % 3600) / 60).toString().padStart(2, '0')}<span className={`font-light opacity-50 ml-1 ${isZenMode ? 'text-[4vw] md:text-[32px]' : 'text-[3vw] md:text-[24px]'}`}>min</span></span>
                                            <span>{(timerSeconds % 60).toString().padStart(2, '0')}<span className={`font-light opacity-50 ml-1 ${isZenMode ? 'text-[4vw] md:text-[32px]' : 'text-[3vw] md:text-[24px]'}`}>s</span></span>
                                        </div>
                                        {!isTimerRunning && (
                                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 text-sm opacity-50 transition-opacity pointer-events-none">
                                                <Edit3 size={16} /> <span>{t('clickToEdit') || 'Click to edit'}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className={`mt-8 flex gap-6 z-30 relative ${isEditingTimer ? 'hidden' : ''} ${!showControls && !isCleanMode ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500'}`}>
                                <button onClick={() => {
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
                                }} className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all`}>
                                    {isTimerRunning ? <Pause size={32} /> : <Play size={32} className={currentTheme.accent} />}
                                </button>
                                <button onClick={() => { setIsTimerRunning(false); setTimerSeconds(timerInitial > 0 ? timerInitial : 0); }} className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                                    <RotateCcw size={32} />
                                </button>
                            </div>

                            {/* Integrated Multi-Timers */}
                            <div className={`w-full max-h-[30vh] sm:max-h-[40vh] overflow-y-auto custom-scrollbar space-y-2 p-2 border-t border-white/10 transition-all ${isZenMode ? 'mt-0 pt-0 opacity-0 overflow-hidden h-0 border-none' : 'mt-4 pt-4 opacity-100 h-auto'}`}>
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
                                <div className="flex flex-wrap justify-center gap-2 pt-2 pb-2">
                                    {[1, 3, 5, 10, 15, 30].map(m => (
                                        <button key={m} onClick={() => addMultiTimer(m)} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 text-xs sm:text-sm transition-all">+{m}m</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'pomodoro' && (
                        <div className="flex flex-col items-center select-none mt-2 sm:mt-4">
                            <div className={`relative flex justify-center items-center w-full mt-2 p-2 sm:p-4 flex-col ${ringPosition === 'left' ? 'md:flex-row' : ringPosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-col'}`}>
                                {showProgressRing && <ProgressRing progress={(pomoSeconds / (pomoMode === 'work' ? 25 * 60 : pomoMode === 'short' ? 5 * 60 : 15 * 60)) * 100} accent={theme === 'custom' ? 'custom-accent text-white' : currentTheme.accent} position={ringPosition} />}
                                <div className={`font-bold tracking-tighter tabular-nums drop-shadow-2xl flex items-baseline gap-1 md:gap-2 z-10 transition-all text-[15vw] md:text-[120px]`}>
                                    <span>{Math.floor(pomoSeconds / 60).toString().padStart(2, '0')}<span className={`font-light opacity-50 ml-1 text-[4vw] md:text-[32px]`}>min</span></span>
                                    <span>{(pomoSeconds % 60).toString().padStart(2, '0')}<span className={`font-light opacity-50 ml-1 text-[4vw] md:text-[32px]`}>s</span></span>
                                </div>
                            </div>
                            <div className={`mt-4 sm:mt-8 flex gap-6 z-30 relative ${!showControls && !isCleanMode ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500'}`}>
                                <button onClick={() => {
                                    if (!isPomoRunning && pomoSeconds <= 0) resetPomo(pomoMode);
                                    if (!isPomoRunning && autoZenMode && !isZenMode) setIsZenMode(true);
                                    setIsPomoRunning(!isPomoRunning);
                                }} className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all`}>
                                    {isPomoRunning ? <Pause size={32} /> : <Play size={32} className={currentTheme.accent} />}
                                </button>
                                <button onClick={() => resetPomo(pomoMode)} className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                                    <RotateCcw size={32} />
                                </button>
                            </div>
                            {enableMiniTask && (
                                <div className={`mt-8 flex items-center justify-center w-[80vw] max-w-sm transition-opacity duration-500 relative ${isZenMode ? 'opacity-0' : 'opacity-100'}`}>
                                    <Target size={18} className="absolute left-2 opacity-30 pointer-events-none" />
                                    <input type="text" placeholder={t('focusGoal')} value={focusGoal} onChange={e => setFocusGoal(e.target.value)} className="w-full text-center bg-transparent border-b border-white/20 focus:border-white/60 py-2 outline-none text-base transition-colors placeholder:text-white/20 text-inherit" style={{ color: 'inherit' }} />
                                </div>
                            )}
                            {enableFocusAnalytics && (
                                <div className={`mt-6 w-[80vw] max-w-sm p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-2 transition-opacity duration-500 ${isZenMode ? 'opacity-0' : 'opacity-100'}`}>
                                    <div className="text-xs font-medium opacity-80 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5"><BarChart2 size={14} /> {t('focusStats')}</div>
                                        <div className="opacity-50">{Object.keys(focusStats).slice(-7).length} Days</div>
                                    </div>
                                    <div className="text-2xl font-bold">{Math.floor(Object.values(focusStats).reduce((a, b) => a + b, 0) / 60)} <span className="text-xs opacity-50 font-normal">mins (total)</span></div>
                                    <div className="flex items-end gap-1.5 h-12 mt-1 w-full mx-auto justify-between px-1">
                                        {[...Array(7)].map((_, i) => {
                                            const dateStrs = Object.keys(focusStats).sort();
                                            const ds = dateStrs.slice(-7)[i];
                                            const max = Math.max(...Object.values(focusStats), 1);
                                            const val = ds ? focusStats[ds] : 0;
                                            const pct = ds ? (val / max) * 100 : 0;
                                            return <div key={i} className={`flex-1 rounded-sm opacity-60 hover:opacity-100 transition-all ${pct === 0 ? 'bg-white/10' : ''}`} style={{ height: pct > 0 ? `max(4px, ${pct}%)` : '4px', background: pct > 0 ? (theme === 'custom' ? customColors.accent : (currentTheme.bg.includes('50') ? '#3b82f6' : '#60a5fa')) : '' }} title={ds ? `${ds}: ${Math.floor(val / 60)}m` : ''} />
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {mode === 'stopwatch' && (
                        <div className="flex flex-col items-center select-none w-full min-w-[300px] mt-2 sm:mt-12">
                            <div className="text-[15vw] md:text-[120px] font-bold tracking-tighter tabular-nums flex items-baseline">
                                <span>{stopwatch.m}</span><span className="opacity-50 mx-1">:</span><span>{stopwatch.s}</span>
                                <span className={`text-[8vw] md:text-[60px] ml-1 md:ml-2 ${currentTheme.accent}`}>.{stopwatch.cs}</span>
                            </div>
                            <div className={`mt-8 flex gap-6 z-30 relative ${!showControls && !isCleanMode ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500'}`}>
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

                    {mode === 'calendar' && calendarView}


                    {mode === 'anniversary' && (
                        <div className="flex flex-col items-center select-none w-full max-w-lg mt-12">
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
                            {isAddingEvent ? (
                                <div className="mt-8 p-6 rounded-3xl bg-white/10 border border-white/20 w-full animate-in fade-in zoom-in-95 duration-300">
                                    <input type="text" placeholder={t('eventName')} value={newEventName} onChange={e => setNewEventName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 mb-3 outline-none focus:border-white/30" />
                                    <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 mb-4 outline-none focus:border-white/30" />
                                    <div className="flex gap-3">
                                        <button onClick={() => setIsAddingEvent(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors uppercase tracking-widest text-xs font-bold">{t('cancel') || 'Cancel'}</button>
                                        <button onClick={() => { if (newEventName && newEventDate) { setAnniversaries([...anniversaries, { id: Date.now(), label: newEventName, date: newEventDate }]); setIsAddingEvent(false); setNewEventName(''); setNewEventDate(''); } }} className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors uppercase tracking-widest text-xs font-bold">{t('add') || 'Add'}</button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAddingEvent(true)}
                                    className="mt-8 px-8 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center gap-2 transition-all"
                                >
                                    <Plus size={20} /> {t('addEvent')}
                                </button>
                            )}
                        </div>
                    )}


                    {mode === 'memento' && (
                        <div className="flex flex-col items-center select-none w-full max-w-2xl animate-fade-in relative mt-12">
                            <div className="flex flex-col mb-8 text-center bg-black/40 backdrop-blur-md px-12 py-6 rounded-[2rem] border border-white/10 w-full pb-8">
                                <h2 className="text-3xl font-black tracking-widest uppercase mb-6 mt-2">{t('memento')}</h2>
                                <label className="text-sm opacity-80 flex flex-col items-center gap-3 w-full">
                                    <span className="uppercase tracking-widest text-white/50">{t('birthDate')}</span>
                                    <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none text-white text-lg w-full max-w-xs transition-all hover:bg-white/20 focus:bg-white/20 focus:border-white/40 font-mono tracking-widest" style={{ colorScheme: 'dark' }} />
                                </label>
                                {mementoView}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer for Navigation Bar offset on Mobile/Desktop */}
            <div className="w-full h-4 shrink-0"></div>

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
                isCleanMode={isCleanMode}
                t={t}
            />
        </div >
    );
}
