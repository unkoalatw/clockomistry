// --- Custom Hooks for Local Storage ---
function useLocalString(key, initialValue) {
    const [value, setValue] = useState(() => {
        const item = window.localStorage.getItem(key);
        if (item !== null) return item;
        return typeof initialValue === 'function' ? initialValue() : initialValue;
    });
    useEffect(() => { window.localStorage.setItem(key, value); }, [key, value]);
    return [value, setValue];
}

function useLocalBoolean(key, initialValue) {
    const [value, setValue] = useState(() => {
        const item = window.localStorage.getItem(key);
        return item !== null ? item === 'true' : initialValue;
    });
    useEffect(() => { window.localStorage.setItem(key, value); }, [key, value]);
    return [value, setValue];
}

function useLocalJSON(key, initialValue, parser) {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return typeof initialValue === 'function' ? initialValue() : initialValue;
            const parsed = JSON.parse(item);
            return parser ? parser(parsed) : parsed;
        } catch (e) { return typeof initialValue === 'function' ? initialValue() : initialValue; }
    });
    useEffect(() => { window.localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
    return [value, setValue];
}

const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    const ms = Math.floor(date.getMilliseconds() / 10).toString().padStart(2, '0');
    return { h, m, s, ms };
};

const formatDuration = (ms) => {
    const m = Math.floor(ms / 60000).toString().padStart(2, '0');
    const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return { m, s, cs };
};

// --- Custom Hook for Weather ---
function useWeather() {
    const [weather, setWeather] = useState({ temp: '--', condition: '', city: '--', sunrise: null, sunset: null });

    const fetchWeather = async () => {
        try {
            const locRes = await fetch('https://ipapi.co/json/');
            if (!locRes.ok) return;
            const loc = await locRes.json();
            const { latitude, longitude, city } = loc;

            const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=sunrise,sunset&timezone=auto`);
            if (!wRes.ok) return;
            const wData = await wRes.json();
            const code = wData.current_weather.weathercode;
            const sunriseStr = wData.daily?.sunrise?.[0];
            const sunsetStr = wData.daily?.sunset?.[0];

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
        const interval = setInterval(fetchWeather, 30 * 60 * 1000); // 30 minutes
        return () => clearInterval(interval);
    }, []);

    return weather;
}

// --- Custom Hook for Multi-Timers ---
function useMultiTimers({ playAlarm, showNotification }) {
    const [multiTimers, setMultiTimers] = useState([]);
    const multiTimerIdRef = useRef(0);

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

    const addMultiTimer = useCallback((minutes = 5) => {
        multiTimerIdRef.current += 1;
        setMultiTimers(prev => [...prev, { id: multiTimerIdRef.current, label: `${minutes}:00`, initial: minutes * 60, remaining: minutes * 60, running: false }]);
    }, []);

    const toggleMultiTimer = useCallback((id) => setMultiTimers(prev => prev.map(t => t.id === id ? { ...t, running: !t.running } : t)), []);
    const resetMultiTimer = useCallback((id) => setMultiTimers(prev => prev.map(t => t.id === id ? { ...t, remaining: t.initial, running: false } : t)), []);
    const deleteMultiTimer = useCallback((id) => setMultiTimers(prev => prev.filter(t => t.id !== id)), []);

    return { multiTimers, addMultiTimer, toggleMultiTimer, resetMultiTimer, deleteMultiTimer };
}

// --- Custom Hook for System Settings & Update ---
function useSystemSettings({ t, showError, setFont, setTheme, setCustomColors, setCustomBgImage, APP_VERSION, theme, font, customColors, customBgImage }) {
    const [isExporting, setIsExporting] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [latestVersion, setLatestVersion] = useState(null);
    const [isDownloadingApp, setIsDownloadingApp] = useState(false);
    const [hasCustomFont, setHasCustomFont] = useState(false);

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
        } catch (e) {
            showError(t('invalidThemeCode'));
        }
    };

    const handleClearData = async () => {
        if (!window.confirm(t('clearDataConfirm'))) return;
        localStorage.clear();
        document.cookie.split(';').forEach(c => {
            document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
        }
        if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map(r => r.unregister()));
        }
        showError(t('clearDataDone'));
        setTimeout(() => window.location.reload(true), 1800);
    };

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

    const handleCheckUpdate = async () => {
        setUpdateStatus('checking');
        try {
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
            setUpdateStatus('latest');
            setTimeout(() => setUpdateStatus(null), 3000);
        }
    };

    const handleForceUpdate = async () => {
        if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map(r => r.update()));
        }
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
        }
        window.location.reload(true);
    };

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
        reader.onload = (ev) => {
            setCustomBgImage(ev.target.result);
            setTheme('custom');
        };
        reader.readAsDataURL(file);
    };

    return {
        exportTheme, importTheme, handleClearData, handleDownloadApp,
        handleCheckUpdate, handleForceUpdate, loadCustomFont, handleFontUpload,
        handleBgImageUpload, isExporting, setIsExporting, updateStatus,
        latestVersion, isDownloadingApp, hasCustomFont, setHasCustomFont
    };
}

// --- Timer Hook ---
function useTimer({ playAlarm, showNotification, triggerSuccess }) {
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

    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timerSeconds > 0) {
            interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
        } else if (isTimerRunning && timerSeconds === 0) {
            playAlarm();
            showNotification('Timer Finished', 'Your timer has finished');
            setIsTimerRunning(false);
            if (triggerSuccess) triggerSuccess();
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerSeconds, playAlarm, showNotification, triggerSuccess]);

    return { timerSeconds, setTimerSeconds, isTimerRunning, setIsTimerRunning, timerInitial, setTimerInitial, isEditingTimer, setIsEditingTimer, timerInput, setTimerInput, handleTimerInput, getTimerInputSeconds };
}

// --- Pomodoro Hook ---
function usePomodoro({ playAlarm, showNotification, triggerSuccess, enableFocusAnalytics, setFocusStats, t }) {
    const [pomoMode, setPomoMode] = useState('work'); // 'work', 'short', 'long'
    const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
    const [isPomoRunning, setIsPomoRunning] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isPomoRunning && pomoSeconds > 0) {
            interval = setInterval(() => setPomoSeconds(prev => prev - 1), 1000);
        } else if (isPomoRunning && pomoSeconds === 0) {
            setIsPomoRunning(false);
            playAlarm();
            showNotification('Pomodoro Finished', `${t(pomoMode)} section is complete`);
            if (triggerSuccess) triggerSuccess();

            if (pomoMode === 'work') {
                if (enableFocusAnalytics && setFocusStats) {
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
    }, [isPomoRunning, pomoSeconds, pomoMode, playAlarm, showNotification, triggerSuccess, enableFocusAnalytics, setFocusStats, t]);

    const resetPomo = (modeType) => {
        setIsPomoRunning(false);
        setPomoMode(modeType);
        if (modeType === 'work') setPomoSeconds(25 * 60);
        else if (modeType === 'short') setPomoSeconds(5 * 60);
        else if (modeType === 'long') setPomoSeconds(15 * 60);
    };

    return { pomoMode, setPomoMode, pomoSeconds, setPomoSeconds, isPomoRunning, setIsPomoRunning, resetPomo };
}

// --- Stopwatch Hook ---
function useStopwatch() {
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    const previousTimeRef = useRef();
    const requestRef = useRef();

    useEffect(() => {
        if (isStopwatchRunning) {
            previousTimeRef.current = Date.now();
            let lastUpdate = 0;
            const animate = () => {
                const now = Date.now();
                const deltaTime = now - previousTimeRef.current;
                previousTimeRef.current = now;
                
                // 節流更新：每 100 毫秒才更新一次 App 狀態，避免 60FPS 的全域重繪
                if (now - lastUpdate >= 100) {
                    setStopwatchTime(prev => prev + (now - lastUpdate));
                    lastUpdate = now;
                }
                requestRef.current = requestAnimationFrame(animate);
            };
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isStopwatchRunning]);

    return { stopwatchTime, setStopwatchTime, isStopwatchRunning, setIsStopwatchRunning, laps, setLaps };
}
