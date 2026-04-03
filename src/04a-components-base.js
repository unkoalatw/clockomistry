// --- Memoized Components ---
const ProgressRing = React.memo(({ progress, accent, position }) => {
    const clampedProgress = Math.min(100, Math.max(0, progress || 0));
    const radius = 46;
    const stroke = position === 'background' ? 1.5 : 4;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = Math.max(0, circumference - ((clampedProgress / 100) * circumference));

    const baseClass = position === 'background'
        ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50 z-0 flex justify-center items-center w-[90vw] h-[90vw] max-w-[500px] max-h-[500px] will-change-transform"
        : "pointer-events-none opacity-80 flex flex-shrink-0 justify-center items-center w-[12vw] h-[12vw] min-w-[50px] min-h-[50px] max-w-[100px] max-h-[100px] mx-4 will-change-transform";

    return (
        <div className={baseClass}>
            <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet">
                <circle stroke="currentColor" fill="transparent" strokeWidth={stroke} className="opacity-[0.1]" r={radius} cx="50" cy="50" />
                <circle 
                    stroke="currentColor" 
                    fill="transparent" 
                    strokeWidth={stroke} 
                    strokeDasharray={circumference + ' ' + circumference} 
                    style={{ 
                        strokeDashoffset, 
                        transition: 'stroke-dashoffset 1s linear',
                        filter: 'drop-shadow(0 0 8px currentColor)' 
                    }} 
                    className={`opacity-100 ${accent}`} 
                    strokeLinecap="round" 
                    r={radius} 
                    cx="50" 
                    cy="50" 
                    transform="rotate(-90 50 50)" 
                />
            </svg>
        </div>
    );
});


const WeatherWidget = React.memo(({ weather, accent }) => (
    <div className="mb-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-5 py-2.5 rounded-full glass opacity-60 hover:opacity-100 transition-opacity cursor-default">
            <div className="flex items-center gap-2">
                <CloudSun size={16} className={accent} />
                <span className="text-xs sm:text-sm font-medium tracking-wide">{weather.city} · {weather.temp}°C · {weather.condition}</span>
            </div>
            {(weather.sunrise || weather.sunset) && (
                <div className="flex items-center gap-3 text-xs opacity-70 border-l border-white/15 pl-3">
                    <span className="flex items-center gap-1"><Sunrise size={12} className="text-orange-400" />{weather.sunrise}</span>
                    <span className="flex items-center gap-1"><Sunset size={12} className="text-purple-400" />{weather.sunset}</span>
                </div>
            )}
        </div>
    </div>
));

const ClockDisplay = React.memo(({ h, m, s, ms: initialMs, showMillis, accent, dateLabel, isZenMode, clockLayout, showSeconds = true, ampm = '' }) => {
    const layout = clockLayout || 'classic';
    const [localMs, setLocalMs] = useState(initialMs);
    const requestRef = useRef();

    useEffect(() => {
        if (showMillis) {
            let lastUpdate = 0;
            const update = (timestamp) => {
                if (timestamp - lastUpdate >= 33) {
                    lastUpdate = timestamp;
                    setLocalMs(Math.floor(new Date().getMilliseconds() / 10).toString().padStart(2, '0'));
                }
                requestRef.current = requestAnimationFrame(update);
            };
            requestRef.current = requestAnimationFrame(update);
            return () => cancelAnimationFrame(requestRef.current);
        }
    }, [showMillis]);

    const displayMs = showMillis ? localMs : initialMs;

    // --- Layout: Classic (原始水平排列) ---
    if (layout === 'classic') return (
        <div className="flex flex-col items-center select-none">
            <div className="flex items-baseline font-bold tracking-tighter tabular-nums drop-shadow-2xl transition-all">
                <span className={`leading-none text-[25vw] md:text-[200px]`}>{h}</span>
                <span className={`leading-none animate-pulse ${accent} text-[25vw] md:text-[200px]`}>:</span>
                <span className={`leading-none text-[25vw] md:text-[200px]`}>{m}</span>
                {showSeconds && (
                    <div className={`flex flex-col ml-2 md:ml-4 justify-end pb-[2vw] md:pb-12`}>
                        <span className={`opacity-50 font-medium text-[10vw] md:text-[60px]`}>{s}</span>
                        {showMillis && <span className={`${accent} opacity-80 text-[5vw] md:text-[30px]`}>{displayMs}</span>}
                    </div>
                )}
            </div>
            {ampm && <div className={`text-[5vw] md:text-[32px] font-light tracking-[0.3em] opacity-50 mt-1 ${accent}`}>{ampm}</div>}
            {dateLabel && <div className={`mt-2 md:mt-4 font-light tracking-[0.3em] opacity-80 uppercase text-center transition-all text-lg md:text-3xl`}>{dateLabel}</div>}
        </div>
    );

    // --- Layout: Stacked (垂直堆疊式) ---
    if (layout === 'stacked') return (
        <div className="flex flex-col items-center select-none">
            <div className="flex flex-col items-center font-bold tracking-tighter tabular-nums drop-shadow-2xl transition-all leading-[0.85]">
                <span className="text-[30vw] md:text-[220px]">{h}</span>
                <span className={`text-[30vw] md:text-[220px] ${accent}`}>{m}</span>
            </div>
            {showSeconds && (
                <div className="flex items-center gap-3 mt-2 md:mt-4">
                    <span className="opacity-40 font-medium text-[8vw] md:text-[48px] tabular-nums">{s}</span>
                    {showMillis && <span className={`${accent} opacity-60 text-[5vw] md:text-[30px] tabular-nums`}>.{displayMs}</span>}
                </div>
            )}
            {ampm && <div className={`text-[4vw] md:text-[28px] font-light tracking-[0.3em] opacity-50 mt-2 ${accent}`}>{ampm}</div>}
            {dateLabel && <div className={`mt-4 md:mt-6 font-light tracking-[0.3em] opacity-80 uppercase text-center text-lg md:text-3xl`}>{dateLabel}</div>}
        </div>
    );

    // --- Layout: Minimal (極簡式) ---
    if (layout === 'minimal') return (
        <div className="flex flex-col items-center select-none">
            <div className="font-extralight tracking-[-0.04em] tabular-nums drop-shadow-2xl transition-all text-[28vw] md:text-[240px] leading-none">
                <span>{h}</span>
                <span className={`${accent} animate-pulse`}>:</span>
                <span>{m}</span>
            </div>
            {ampm && <div className={`text-[4vw] md:text-[24px] font-light tracking-[0.5em] opacity-40 mt-2 ${accent}`}>{ampm}</div>}
            {dateLabel && <div className={`mt-6 md:mt-10 font-light tracking-[0.5em] opacity-60 uppercase text-center text-sm md:text-xl`}>{dateLabel}</div>}
        </div>
    );

    // --- Layout: Split (左右分離式) ---
    if (layout === 'split') return (
        <div className="flex flex-col items-center select-none">
            <div className="flex items-center gap-[4vw] md:gap-12 font-bold tabular-nums drop-shadow-2xl transition-all">
                <div className="flex flex-col items-center">
                    <span className="text-[28vw] md:text-[200px] leading-none tracking-tighter">{h}</span>
                    <span className="text-[3vw] md:text-base opacity-30 tracking-[0.4em] uppercase font-light mt-1">{ampm || 'hr'}</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-30">
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${accent} bg-current animate-pulse`}></div>
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${accent} bg-current animate-pulse`}></div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[28vw] md:text-[200px] leading-none tracking-tighter">{m}</span>
                    <span className="text-[3vw] md:text-base opacity-30 tracking-[0.4em] uppercase font-light mt-1">min</span>
                </div>
                {showSeconds && (
                    <div className="flex flex-col items-center">
                        <span className={`text-[10vw] md:text-[72px] leading-none tracking-tighter opacity-40`}>{s}</span>
                        {showMillis && <span className={`${accent} opacity-60 text-[4vw] md:text-[28px] mt-1`}>{displayMs}</span>}
                    </div>
                )}
            </div>
            {dateLabel && <div className={`mt-6 md:mt-8 font-light tracking-[0.3em] opacity-80 uppercase text-center text-lg md:text-3xl`}>{dateLabel}</div>}
        </div>
    );

    // --- Layout: Digital (數位儀表板式) ---
    if (layout === 'digital') return (
        <div className="flex flex-col items-center select-none">
            <div className="flex items-center gap-[2vw] md:gap-4 tabular-nums drop-shadow-2xl transition-all">
                {[h[0], h[1]].map((d, i) => (
                    <div key={`h${i}`} className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl px-[3vw] py-[2vw] md:px-8 md:py-4 backdrop-blur-sm">
                        <span className="text-[18vw] md:text-[140px] font-bold leading-none block">{d}</span>
                    </div>
                ))}
                <div className="flex flex-col gap-[2vw] md:gap-4 mx-1 md:mx-2">
                    <div className={`w-[2vw] h-[2vw] md:w-3 md:h-3 rounded-full ${accent} bg-current animate-pulse`}></div>
                    <div className={`w-[2vw] h-[2vw] md:w-3 md:h-3 rounded-full ${accent} bg-current animate-pulse`}></div>
                </div>
                {[m[0], m[1]].map((d, i) => (
                    <div key={`m${i}`} className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl px-[3vw] py-[2vw] md:px-8 md:py-4 backdrop-blur-sm">
                        <span className="text-[18vw] md:text-[140px] font-bold leading-none block">{d}</span>
                    </div>
                ))}
            </div>
            {(showSeconds || ampm) && (
                <div className="flex items-center gap-3 mt-4 md:mt-6">
                    {showSeconds && (
                        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-sm min-w-[16vw] md:min-w-[80px] flex justify-center items-center">
                            <span className="text-[6vw] md:text-[36px] font-bold tabular-nums opacity-60 leading-none">{s}</span>
                        </div>
                    )}
                    {showSeconds && showMillis && (
                        <div className={`bg-white/5 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-sm min-w-[14vw] md:min-w-[64px] flex justify-center items-center`}>
                            <span className={`text-[4vw] md:text-[24px] font-bold tabular-nums ${accent} opacity-80 leading-none`}>{displayMs}</span>
                        </div>
                    )}
                    {ampm && (
                        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-sm min-w-[14vw] md:min-w-[64px] flex justify-center items-center">
                            <span className={`text-[4vw] md:text-[24px] font-bold ${accent} opacity-80 leading-none`}>{ampm}</span>
                        </div>
                    )}
                </div>
            )}
            {dateLabel && <div className={`mt-4 md:mt-6 font-light tracking-[0.3em] opacity-80 uppercase text-center text-lg md:text-3xl`}>{dateLabel}</div>}
        </div>
    );

    // fallback
    return null;
});


const NavigationBar = React.memo(({ mode, setMode, isZenMode, accent, showControls, toggleFullscreen, setShowSettings, setIsZenMode, isCleanMode, t }) => {
    const APP_NAMES = {
        'clock':       'Clock',
        'apps':        'Apps',
        'timer':       t('tabTimer')       || 'Timer',
        'pomodoro':    t('tabPomodoro')    || 'Pomodoro',
        'stopwatch':   t('tabStopwatch')   || 'Stopwatch',
        'calendar':    t('tabMonthly')     || 'Calendar',
        'anniversary': t('tabEvents')      || 'Events',
        'memento':     t('tabLife')        || 'Life',
        'world':       t('worldClock')     || 'World Clock',
    };

    const isInSubView = mode !== 'clock' && mode !== 'apps';

    return (
        <div className={`hide-on-export fixed bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 p-2 rounded-full nav-dock transition-all duration-500 z-40 w-max max-w-[96vw] ${showControls && !isCleanMode ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}`}>

            {/* Context-aware left section */}
            {isInSubView ? (
                // Sub-view: show back button + current app name
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setMode('apps')}
                        className={`nav-btn flex items-center gap-1.5 pl-3 pr-4 py-2.5 rounded-full hover:bg-white/10 transition-all`}
                        title={t('back') || 'Back to Apps'}
                    >
                        <ChevronLeft size={16} className="opacity-70" />
                        <span className="text-xs font-semibold tracking-wider opacity-60">Apps</span>
                    </button>
                    <div className="w-px h-5 bg-white/10"></div>
                    <span className={`px-3 py-2 text-xs font-bold tracking-[0.15em] uppercase ${accent}`}>
                        {APP_NAMES[mode] || mode}
                    </span>
                </div>
            ) : (
                // Root view: Clock / Apps toggle pill
                <div className="flex bg-white/5 rounded-full p-1 gap-0.5">
                    <button
                        onClick={() => setMode('clock')}
                        className={`nav-btn px-4 sm:px-5 py-2.5 rounded-full flex items-center gap-2 ${mode === 'clock' ? 'bg-white/15 shadow-sm' : 'opacity-50 hover:opacity-90 hover:bg-white/8'}`}
                    >
                        <Clock size={16} className={mode === 'clock' ? accent : ''} />
                        <span className="text-xs font-semibold tracking-widest uppercase hidden sm:block">Clock</span>
                    </button>
                    <button
                        onClick={() => setMode('apps')}
                        className={`nav-btn px-4 sm:px-5 py-2.5 rounded-full flex items-center gap-2 ${mode === 'apps' ? 'bg-white/15 shadow-sm' : 'opacity-50 hover:opacity-90 hover:bg-white/8'}`}
                    >
                        <LayoutGrid size={16} className={mode === 'apps' ? accent : ''} />
                        <span className="text-xs font-semibold tracking-widest uppercase hidden sm:block">Apps</span>
                    </button>
                </div>
            )}

            <div className="w-px h-6 bg-white/10"></div>

            {/* Right utility buttons */}
            <div className="flex gap-0.5 pr-1">
                <button
                    onClick={() => setIsZenMode(!isZenMode)}
                    className={`w-10 h-10 flex justify-center items-center rounded-full transition-all nav-btn ${isZenMode ? accent + ' bg-white/10' : 'opacity-50 hover:opacity-90 hover:bg-white/8'}`}
                    title="Zen Mode"
                >
                    <Monitor size={16} />
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 justify-center items-center rounded-full opacity-50 hover:opacity-90 hover:bg-white/8 transition-all nav-btn hidden sm:flex"
                    title="Fullscreen"
                >
                    <Maximize2 size={16} />
                </button>
                <button
                    onClick={() => setShowSettings(true)}
                    className="w-10 h-10 flex justify-center items-center rounded-full opacity-50 hover:opacity-90 hover:bg-white/8 transition-all nav-btn"
                    title="Settings"
                >
                    <Settings size={16} />
                </button>
            </div>
        </div>
    );
});

