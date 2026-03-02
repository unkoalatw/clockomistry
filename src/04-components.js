// --- Memoized Components ---
const ProgressRing = React.memo(({ progress, accent, position }) => {
    const clampedProgress = Math.min(100, Math.max(0, progress || 0));
    const radius = 46;
    const stroke = position === 'background' ? 1.5 : 4;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = Math.max(0, circumference - ((clampedProgress / 100) * circumference));

    const baseClass = position === 'background'
        ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none drop-shadow-2xl opacity-50 z-0 flex justify-center items-center w-[90vw] h-[90vw] max-w-[500px] max-h-[500px]"
        : "pointer-events-none drop-shadow-2xl opacity-80 flex flex-shrink-0 justify-center items-center w-[12vw] h-[12vw] min-w-[50px] min-h-[50px] max-w-[100px] max-h-[100px] mx-4";

    return (
        <div className={baseClass}>
            <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <filter id="ringGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
                        <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur1" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <circle stroke="currentColor" fill="transparent" strokeWidth={stroke} className="opacity-[0.1]" r={radius} cx="50" cy="50" />
                <circle filter="url(#ringGlow)" stroke="currentColor" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }} className={`opacity-100 ${accent}`} strokeLinecap="round" r={radius} cx="50" cy="50" transform="rotate(-90 50 50)" />
            </svg>
        </div>
    );
});

const WeatherWidget = React.memo(({ weather, accent }) => (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
            <CloudSun size={18} className={accent} />
            <span className="text-sm font-medium">{weather.city} · {weather.temp}°C · {weather.condition}</span>
        </div>
        {(weather.sunrise || weather.sunset) && (
            <div className={`flex items-center gap-3 text-xs opacity-80 border-l border-white/20 pl-4`}>
                <span className="flex items-center gap-1.5"><Sunrise size={14} className="text-orange-400" />{weather.sunrise}</span>
                <span className="flex items-center gap-1.5"><Sunset size={14} className="text-purple-400" />{weather.sunset}</span>
            </div>
        )}
    </div>
));

const ClockDisplay = React.memo(({ h, m, s, ms, showMillis, accent, dateLabel, isZenMode }) => (
    <div className="flex flex-col items-center select-none">
        <div className="flex items-baseline font-bold tracking-tighter tabular-nums drop-shadow-2xl transition-all">
            <span className={`leading-none text-[25vw] md:text-[200px]`}>{h}</span>
            <span className={`leading-none animate-pulse ${accent} text-[25vw] md:text-[200px]`}>:</span>
            <span className={`leading-none text-[25vw] md:text-[200px]`}>{m}</span>
            <div className={`flex flex-col ml-2 md:ml-4 justify-end pb-[2vw] md:pb-12`}>
                <span className={`opacity-50 font-medium text-[10vw] md:text-[60px]`}>{s}</span>
                {showMillis && <span className={`${accent} opacity-80 text-[5vw] md:text-[30px]`}>{ms}</span>}
            </div>
        </div>
        <div className={`mt-2 md:mt-4 font-light tracking-[0.3em] opacity-80 uppercase text-center transition-all text-lg md:text-3xl`}>{dateLabel}</div>
    </div>
));

const NavigationBar = React.memo(({ mode, setMode, isZenMode, accent, showControls, toggleFullscreen, setShowSettings, setIsZenMode, isCleanMode, setIsMiniMode, t }) => {
    return (
        <div className={`hide-on-export fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-[2rem] sm:rounded-full backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl transition-all duration-500 z-40 w-max max-w-[96vw] sm:max-w-2xl sm:w-auto ${showControls && !isCleanMode ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}`}>
            <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
            <div className="flex bg-white/5 rounded-full p-1 gap-1 flex-none overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scroll max-w-[65vw] sm:max-w-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                {[
                    { m: 'clock', icon: Clock }, { m: 'world', icon: Globe },
                    { m: 'calendar', icon: CalendarDays }, { m: 'pomodoro', icon: Timer }
                ].map(({ m, icon: Icon }) => {
                    const isActive = (m === 'pomodoro' && ['timer', 'pomodoro', 'stopwatch'].includes(mode)) ||
                        (m === 'calendar' && ['calendar', 'anniversary', 'memento'].includes(mode)) ||
                        (mode === m);
                    return (
                        <button key={m} onClick={() => {
                            if (m === 'pomodoro' && !['timer', 'pomodoro', 'stopwatch'].includes(mode)) setMode('pomodoro');
                            else if (m === 'calendar' && !['calendar', 'anniversary', 'memento'].includes(mode)) setMode('calendar');
                            else if (m === 'clock' || m === 'world') setMode(m);
                        }} className={`p-3 lg:px-6 lg:py-3 rounded-full transition-all snap-center flex-shrink-0 ${isActive ? 'bg-white/20 scale-105 shadow-sm' : 'opacity-60 hover:bg-white/10'}`}>
                            <Icon size={20} className={isActive ? accent : ''} />
                        </button>
                    )
                })}
            </div>
            <div className="w-px h-8 bg-white/20 hidden sm:block"></div>
            <div className="flex gap-1 pr-1 sm:pr-0">
                <button onClick={() => setShowSettings(true)} className="p-3 rounded-full opacity-80 hover:opacity-100 hover:rotate-90 transition-all"><Settings size={20} /></button>
                <button onClick={() => setIsZenMode(!isZenMode)} className={`p-3 rounded-full ${isZenMode ? accent : 'opacity-80'}`}><Monitor size={20} /></button>
                <button onClick={toggleFullscreen} className="p-3 rounded-full opacity-80 hover:opacity-100 hidden sm:block"><Maximize2 size={20} /></button>
            </div>
        </div>
    )
});

