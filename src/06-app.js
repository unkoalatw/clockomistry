function App() {
    const [time, setTime] = useState(new Date());
    const [theme, setTheme] = useLocalString('clock_theme', 'modern');
    const [font, setFont] = useLocalString('clock_font', 'modern');
    const [clockLayout, setClockLayout] = useLocalString('clock_layout', 'classic');
    const [showMillis, setShowMillis] = useLocalBoolean('clock_millis', true);
    const [showProgressRing, setShowProgressRing] = useLocalBoolean('clock_progressRing', true);
    const [ringPosition, setRingPosition] = useLocalString('clock_ringPosition', 'left');
    const [enableMiniTask, setEnableMiniTask] = useLocalBoolean('clock_miniTask', true);
    const [enableFocusAnalytics, setEnableFocusAnalytics] = useLocalBoolean('clock_focusAnalytics', true);
    const [enableMeetingPlanner, setEnableMeetingPlanner] = useLocalBoolean('clock_meetingPlanner', true);

    // New practical features
    const [use12Hour, setUse12Hour] = useLocalBoolean('clock_use12Hour', false);
    const [hourlyChime, setHourlyChime] = useLocalBoolean('clock_hourlyChime', false);
    const [showSeconds, setShowSeconds] = useLocalBoolean('clock_showSeconds', true);
    const [showDate, setShowDate] = useLocalBoolean('clock_showDate', true);
    const [showNextEvent, setShowNextEvent] = useLocalBoolean('clock_showNextEvent', false);
    const [dashboardMode, setDashboardMode] = useLocalBoolean('clock_dashboardMode', false);

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
    const [ssPos, setSsPos] = useState({ x: 40, y: 40 });
    const ssVelocity = useRef({ x: 0.15, y: 0.12 });

    // i18n helper
    const t = useCallback((key) => (I18N[lang] || I18N['zh-TW'])[key] || key, [lang]);

    // Alarm & Notification 狀態 (must be before timer/pomodoro hooks)
    const [alarmSound, setAlarmSound] = useLocalString('clock_alarmSound', 'beep');
    const [notificationsEnabled, setNotificationsEnabled] = useLocalBoolean('clock_notifications', true);
    const audioRef = useRef(null);

    const playAlarm = useCallback(() => {
        if (alarmSound === 'none') return;
        if (!audioRef.current) audioRef.current = new Audio();
        const format = audioRef.current.canPlayType('audio/ogg') !== '' ? 'ogg' : 'mp3';
        audioRef.current.src = `public/audio/${alarmSound}.${format}`;
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

    const { timerSeconds, setTimerSeconds, isTimerRunning, setIsTimerRunning, timerInitial, setTimerInitial, isEditingTimer, setIsEditingTimer, timerInput, setTimerInput, handleTimerInput, getTimerInputSeconds } = useTimer({ playAlarm, showNotification, triggerSuccess });
    const { pomoMode, setPomoMode, pomoSeconds, setPomoSeconds, isPomoRunning, setIsPomoRunning, resetPomo } = usePomodoro({ playAlarm, showNotification, triggerSuccess, enableFocusAnalytics, setFocusStats, t });
    const { stopwatchTime, setStopwatchTime, isStopwatchRunning, setIsStopwatchRunning, laps, setLaps } = useStopwatch();

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



    // Calendar 狀態
    const [calendarDate, setCalendarDate] = useState(new Date());

    const containerRef = useRef(null);
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const fileInputRef = useRef(null);
    const bgImageInputRef = useRef(null);

    // --- 持久化設定 ---
    // The explicit useEffect syncing logic is now automatically managed by the custom hooks above!

    // 螢幕保護自動偵測 (Optimized: Use Ref for activity tracking to avoid re-renders)
    const lastActivityRef = useRef(Date.now());
    useEffect(() => {
        let debounceTimer = null;
        const updateActivity = () => {
            lastActivityRef.current = Date.now();
            if (isScreenSaverActive) {
                if (debounceTimer) return;
                debounceTimer = setTimeout(() => {
                    setIsScreenSaverActive(false);
                    debounceTimer = null;
                }, 100);
            }
        };
        const events = ['mousemove', 'keydown', 'touchstart', 'scroll'];
        events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));
        return () => { events.forEach(e => window.removeEventListener(e, updateActivity)); if (debounceTimer) clearTimeout(debounceTimer); };
    }, [isScreenSaverActive]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isScreenSaverActive && Date.now() - lastActivityRef.current > 5 * 60 * 1000) {
                setIsScreenSaverActive(true);
            }
        }, 30000); // 降低檢測頻率
        return () => clearInterval(interval);
    }, [isScreenSaverActive]);

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

    const weather = useWeather();
    const { multiTimers, addMultiTimer, toggleMultiTimer, resetMultiTimer, deleteMultiTimer } = useMultiTimers({ playAlarm, showNotification });

    // 整點報時 - 每小時整點播放提示音
    const lastChimeHourRef = useRef(-1);
    useEffect(() => {
        if (!hourlyChime) return;
        const currentHour = time.getHours();
        const currentMin = time.getMinutes();
        if (currentMin === 0 && currentHour !== lastChimeHourRef.current) {
            lastChimeHourRef.current = currentHour;
            playAlarm();
            if (showNotification) {
                const displayH = use12Hour ? (currentHour % 12 || 12) : currentHour;
                const ampm = use12Hour ? (currentHour < 12 ? ' AM' : ' PM') : '';
                showNotification(t('hourlyChimeTitle') || '整點報時', `${displayH}:00${ampm}`);
            }
        }
    }, [time, hourlyChime, playAlarm, showNotification, use12Hour]);

    // 下一個事件倒數
    const nextEvent = useMemo(() => {
        if (!showNextEvent || !anniversaries || anniversaries.length === 0) return null;
        const now = new Date();
        let closest = null;
        let closestDays = Infinity;
        for (const ev of anniversaries) {
            const target = new Date(ev.date);
            const diff = target - now;
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            if (days >= 0 && days < closestDays) {
                closestDays = days;
                closest = { label: ev.label, days };
            }
        }
        return closest;
    }, [showNextEvent, anniversaries, Math.floor(Date.now() / 3600000)]);


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



    const updateCustomColor = (key, value) => setCustomColors(prev => ({ ...prev, [key]: value }));


    // 核心計時 - 固定為每秒更新一次以優化效能
    // 毫秒顯示已交由 ClockDisplay 內部自行處理，以減少全域 App 的渲染頻率
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);



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

    const {
        exportTheme, importTheme, handleClearData, handleDownloadApp,
        handleCheckUpdate, handleForceUpdate, loadCustomFont, handleFontUpload,
        handleBgImageUpload, isExporting, setIsExporting, updateStatus,
        latestVersion, isDownloadingApp, hasCustomFont, setHasCustomFont
    } = useSystemSettings({ t, showError, setFont, setTheme, setCustomColors, setCustomBgImage, APP_VERSION, theme, font, customColors, customBgImage });

    // 日期格式化 - memoized 以避免每次渲染都呼叫昂貴的 toLocaleDateString
    const dateLabel = useMemo(() => time.toLocaleDateString(t('locale'), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), [Math.floor(time.getTime() / 60000), lang]);

    const getWorldTime = useCallback((timezone) => {
        try {
            const d = new Date(Date.now() + meetingOffset * 3600 * 1000);
            const s = d.toLocaleTimeString('en-US', { timeZone: timezone, hour12: false, hour: '2-digit', minute: '2-digit' });
            const [h, m] = s.split(':');
            return { h, m };
        } catch (e) { return { h: '--', m: '--' }; }
    }, [meetingOffset]);

    const filteredZones = useMemo(() => ALL_ZONES.filter(z => z.label.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery]);
    const currentTheme = useMemo(() => theme === 'custom' ? {
        name: 'themeCustom', bg: '', text: '', accent: 'custom-accent',
        card: 'custom-card backdrop-blur-3xl',
        gradient: '', button: 'hover:bg-white/20', settingsBg: 'custom-settings'
    } : (DEFAULT_THEMES[theme] || DEFAULT_THEMES.modern), [theme]);
    const { h: rawH, m, s, ms } = formatTime(time);
    // 12小時制轉換
    const ampm = useMemo(() => {
        if (!use12Hour) return '';
        return time.getHours() < 12 ? 'AM' : 'PM';
    }, [use12Hour, time.getHours() < 12]);
    const h = useMemo(() => {
        if (!use12Hour) return rawH;
        const hour12 = time.getHours() % 12 || 12;
        return hour12.toString().padStart(2, '0');
    }, [use12Hour, rawH]);
    const stopwatch = formatDuration(stopwatchTime);
    const currentFontStyle = useMemo(() => (font === 'custom' && hasCustomFont) ? { fontFamily: 'CustomFont' } : (DEFAULT_FONTS[font]?.style || {}), [font, hasCustomFont]);
    const containerStyle = useMemo(() => theme === 'custom' && !isCleanMode ? {
        ...currentFontStyle,
        background: customBgImage
            ? `linear-gradient(${customColors.bg1}cc, ${customColors.bg1}cc), url(${customBgImage}) center/cover no-repeat fixed`
            : `linear-gradient(135deg, ${customColors.bg1}, ${customColors.bg2}, ${customColors.bg3})`,
        color: customColors.text
    } : currentFontStyle, [theme, isCleanMode, currentFontStyle, customColors, customBgImage]);



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

            {/* Overlays */}
            <SettingsOverlay
                showSettings={showSettings} setShowSettings={setShowSettings}
                activeSettingsTab={activeSettingsTab} setActiveSettingsTab={setActiveSettingsTab}
                t={t} currentTheme={currentTheme} DEFAULT_THEMES={DEFAULT_THEMES} theme={theme} setTheme={setTheme}
                customColors={customColors} updateCustomColor={updateCustomColor} customBgImage={customBgImage} setCustomBgImage={setCustomBgImage}
                bgImageInputRef={bgImageInputRef} handleBgImageUpload={handleBgImageUpload}
                DEFAULT_FONTS={DEFAULT_FONTS} font={font} setFont={setFont} fileInputRef={fileInputRef} handleFontUpload={handleFontUpload} hasCustomFont={hasCustomFont}
                searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredZones={filteredZones} selectedZones={selectedZones} setSelectedZones={setSelectedZones}
                I18N={I18N} lang={lang} setLang={setLang}
                showMillis={showMillis} setShowMillis={setShowMillis} notificationsEnabled={notificationsEnabled} handleToggleNotifications={handleToggleNotifications}
                autoZenMode={autoZenMode} setAutoZenMode={setAutoZenMode} showProgressRing={showProgressRing} setShowProgressRing={setShowProgressRing}
                enableMiniTask={enableMiniTask} setEnableMiniTask={setEnableMiniTask} enableFocusAnalytics={enableFocusAnalytics} setEnableFocusAnalytics={setEnableFocusAnalytics}
                enableMeetingPlanner={enableMeetingPlanner} setEnableMeetingPlanner={setEnableMeetingPlanner}
                ringPosition={ringPosition} setRingPosition={setRingPosition} alarmSound={alarmSound} setAlarmSound={setAlarmSound} playAlarm={playAlarm}
                exportTheme={exportTheme} handleExportImage={handleExportImage} isExporting={isExporting} importTheme={importTheme}
                isDownloadingApp={isDownloadingApp} handleDownloadApp={handleDownloadApp} APP_VERSION={APP_VERSION} updateStatus={updateStatus}
                handleForceUpdate={handleForceUpdate} handleCheckUpdate={handleCheckUpdate} latestVersion={latestVersion} handleClearData={handleClearData}
                clockLayout={clockLayout} setClockLayout={setClockLayout}
                use12Hour={use12Hour} setUse12Hour={setUse12Hour}
                hourlyChime={hourlyChime} setHourlyChime={setHourlyChime}
                showSeconds={showSeconds} setShowSeconds={setShowSeconds}
                showDate={showDate} setShowDate={setShowDate}
                showNextEvent={showNextEvent} setShowNextEvent={setShowNextEvent}
                dashboardMode={dashboardMode} setDashboardMode={setDashboardMode}
            />

            <SplashOverlay
                hasAgreed={hasAgreed} setHasAgreed={setHasAgreed}
                lang={lang} setLang={setLang} I18N={I18N} t={t}
            />

            <ScreenSaverOverlay
                isScreenSaverActive={isScreenSaverActive}
                ssPos={ssPos} h={h} m={m} t={t}
            />

            {/* Decor - Ambient blobs (CSS moved to input.css for performance) */}
            <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${isZenMode ? 'opacity-20' : 'opacity-100'}`}>
                <div className="ambient-blob-1 absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full blur-[40px] opacity-15 bg-blue-500/40 will-change-transform"></div>
                <div className="ambient-blob-2 absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full blur-[40px] opacity-15 bg-purple-500/40 will-change-transform"></div>
            </div>

            {/* Main Card */}
            <div className={`relative z-10 w-full my-auto shrink max-h-[calc(100dvh-80px)] overflow-hidden max-w-[95vw] ${dashboardMode && mode === 'clock' ? 'md:max-w-6xl' : 'md:max-w-4xl'} rounded-[30px] sm:rounded-[48px] transition-zen flex flex-col items-center justify-start min-h-[40vh] ${!isCleanMode && !isZenMode ? currentTheme.card + ' border-t border-l' : 'shadow-none bg-transparent !border-transparent backdrop-blur-0'} ${isZenMode ? 'scale-[1.05]' : ''} ${isCleanMode ? 'scale-[0.85]' : ''}`}>

                {/* Fixed Top Navigation Arrays REMOVED FOR CLEANER UI */}

                {/* SCROLLABLE BODY */}
                <div className={`w-full flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start ${isCleanMode || isZenMode || mode === 'clock' || mode === 'world' || mode === 'apps' ? 'p-6 sm:p-12' : 'px-6 sm:px-12 pb-12 pt-4 sm:pt-6'} relative`}>



                    {mode === 'apps' && (
                        <LauncherView setMode={setMode} t={t} />
                    )}

                    {mode === 'clock' && (
                        dashboardMode ? (
                            <DashboardView
                                time={time} h={h} m={m} s={s} ms={ms} ampm={ampm}
                                dateLabel={showDate ? dateLabel : null} showSeconds={showSeconds}
                                clockLayout={clockLayout} weather={weather}
                                t={t} currentTheme={currentTheme} nextEvent={nextEvent}
                                selectedZones={selectedZones} getWorldTime={getWorldTime}
                                timerSeconds={timerSeconds} timerInitial={timerInitial}
                                isTimerRunning={isTimerRunning} stopwatch={stopwatch}
                                focusGoal={focusGoal} activeTab={mode} isZenMode={isZenMode}
                                showMillis={showMillis}
                            />
                        ) : (
                            <div className="flex flex-col items-center select-none">
                                <WeatherWidget weather={weather} accent={currentTheme.accent} />
                                <ClockDisplay h={h} m={m} s={s} ms={ms} showMillis={showMillis} accent={currentTheme.accent} dateLabel={showDate ? dateLabel : null} isZenMode={isZenMode} clockLayout={clockLayout} showSeconds={showSeconds} ampm={ampm} />
                                {showNextEvent && nextEvent && (
                                    <div className="mt-4 md:mt-6 flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in">
                                        <Sparkles size={16} className={currentTheme.accent} />
                                        <span className="text-sm opacity-80">{nextEvent.label}</span>
                                        <span className={`text-sm font-bold ${currentTheme.accent}`}>{nextEvent.days === 0 ? (t('eventToday') || '就在今天！') : `${nextEvent.days} ${t('daysLeft')}`}</span>
                                    </div>
                                )}
                            </div>
                        )
                    )}

                    {mode === 'world' && (
                        <WorldClockView
                            enableMeetingPlanner={enableMeetingPlanner} meetingOffset={meetingOffset} setMeetingOffset={setMeetingOffset}
                            currentTheme={currentTheme} t={t} selectedZones={selectedZones} getWorldTime={getWorldTime} setShowSettings={setShowSettings}
                        />
                    )}

                    {mode === 'timer' && (
                        <TimerView
                            isEditingTimer={isEditingTimer} timerInput={timerInput} handleTimerInput={handleTimerInput}
                            getTimerInputSeconds={getTimerInputSeconds} setTimerInitial={setTimerInitial} setTimerSeconds={setTimerSeconds}
                            setIsEditingTimer={setIsEditingTimer} setIsTimerRunning={setIsTimerRunning} autoZenMode={autoZenMode}
                            isZenMode={isZenMode} setIsZenMode={setIsZenMode} timerSeconds={timerSeconds} timerInitial={timerInitial}
                            showProgressRing={showProgressRing} theme={theme} currentTheme={currentTheme} ringPosition={ringPosition}
                            isTimerRunning={isTimerRunning} t={t} showControls={showControls} isCleanMode={isCleanMode}
                            multiTimers={multiTimers} toggleMultiTimer={toggleMultiTimer} resetMultiTimer={resetMultiTimer}
                            deleteMultiTimer={deleteMultiTimer} addMultiTimer={addMultiTimer} setTimerInput={setTimerInput}
                        />
                    )}

                    {mode === 'pomodoro' && (
                        <PomodoroView
                            ringPosition={ringPosition} showProgressRing={showProgressRing} pomoSeconds={pomoSeconds} pomoMode={pomoMode}
                            theme={theme} currentTheme={currentTheme} isPomoRunning={isPomoRunning} autoZenMode={autoZenMode}
                            isZenMode={isZenMode} setIsZenMode={setIsZenMode} setIsPomoRunning={setIsPomoRunning} resetPomo={resetPomo}
                            t={t} showControls={showControls} isCleanMode={isCleanMode} enableMiniTask={enableMiniTask}
                            focusGoal={focusGoal} setFocusGoal={setFocusGoal} enableFocusAnalytics={enableFocusAnalytics}
                            focusStats={focusStats} customColors={customColors}
                        />
                    )}

                    {mode === 'stopwatch' && (
                        <StopwatchView
                            stopwatch={stopwatch} setIsStopwatchRunning={setIsStopwatchRunning} isStopwatchRunning={isStopwatchRunning}
                            currentTheme={currentTheme} setLaps={setLaps} laps={laps} stopwatchTime={stopwatchTime}
                            setStopwatchTime={setStopwatchTime} t={t} showControls={showControls} isCleanMode={isCleanMode}
                        />
                    )}

                    {mode === 'calendar' && (
                        <CalendarView
                            calendarDate={calendarDate} setCalendarDate={setCalendarDate} t={t} currentTheme={currentTheme}
                            lang={lang} I18N={I18N}
                            setIsAddingEvent={setIsAddingEvent} setNewEventName={setNewEventName} setNewEventDate={setNewEventDate} setMode={setMode}
                        />
                    )}

                    {mode === 'anniversary' && (
                        <AnniversaryView
                            anniversaries={anniversaries} setAnniversaries={setAnniversaries} isAddingEvent={isAddingEvent}
                            setIsAddingEvent={setIsAddingEvent} newEventName={newEventName} setNewEventName={setNewEventName}
                            newEventDate={newEventDate} setNewEventDate={setNewEventDate} currentTheme={currentTheme} t={t}
                        />
                    )}

                    {mode === 'memento' && (
                        <MementoView
                            birthDate={birthDate} setBirthDate={setBirthDate} t={t}
                        />
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
