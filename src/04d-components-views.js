
const WorldClockView = React.memo(({ enableMeetingPlanner, meetingOffset, setMeetingOffset, currentTheme, selectedZones, getWorldTime, t, setShowSettings }) => (
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
));

const AnniversaryView = React.memo(({ anniversaries, setAnniversaries, t, currentTheme, isAddingEvent, setIsAddingEvent, newEventName, setNewEventName, newEventDate, setNewEventDate }) => (
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
            <button onClick={() => setIsAddingEvent(true)} className="mt-8 px-8 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center gap-2 transition-all">
                <Plus size={20} /> {t('addEvent')}
            </button>
        )}
    </div>
));

const TimerView = React.memo(({
    isEditingTimer, timerInput, handleTimerInput, getTimerInputSeconds,
    setTimerInitial, setTimerSeconds, setIsEditingTimer, setIsTimerRunning, autoZenMode, isZenMode, setIsZenMode,
    timerSeconds, timerInitial, showProgressRing, theme, currentTheme, ringPosition, isTimerRunning, t,
    showControls, isCleanMode, multiTimers, toggleMultiTimer, resetMultiTimer, deleteMultiTimer, addMultiTimer,
    setTimerInput
}) => (
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
                        <button onClick={() => setIsEditingTimer(false)} className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"><X size={32} /></button>
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
                    <div className={`font-bold tracking-tighter tabular-nums drop-shadow-2xl cursor-pointer hover:opacity-80 transition-all flex items-baseline gap-1 md:gap-2 z-10 text-[12vw] md:text-[100px]`} onClick={() => { if (!isTimerRunning) { setIsEditingTimer(true); setTimerInput('000000'); } }}>
                        {timerSeconds >= 3600 && <span>{Math.floor(timerSeconds / 3600).toString().padStart(2, '0')}<span className={`font-light opacity-50 ml-1 ${isZenMode ? 'text-[4vw] md:text-[32px]' : 'text-[3vw] md:text-[24px]'}`}>h</span></span>}
                        <span>{Math.floor((timerSeconds % 3600) / 60).toString().padStart(2, '0')}<span className={`font-light opacity-50 ml-1 ${isZenMode ? 'text-[4vw] md:text-[32px]' : 'text-[3vw] md:text-[24px]'}`}>min</span></span>
                        <span>{(timerSeconds % 60).toString().padStart(2, '0')}<span className={`font-light opacity-50 ml-1 ${isZenMode ? 'text-[4vw] md:text-[32px]' : 'text-[3vw] md:text-[24px]'}`}>s</span></span>
                    </div>
                    {!isTimerRunning && (
                        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-3 transition-opacity z-20">
                            <div className="flex items-center gap-2 text-sm opacity-50 pointer-events-none">
                                <Edit3 size={14} /> <span>{t('clickToEdit') || 'Click to edit'}</span>
                            </div>
                            <div className="flex gap-2">
                                {[1, 5, 10, 25].map(m => (
                                    <button key={m} onClick={(e) => { e.stopPropagation(); setTimerInitial(timerInitial + m * 60); setTimerSeconds(timerSeconds + m * 60); }} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-bold transition-all backdrop-blur-md">+{m}m</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        <div className={`mt-8 flex gap-6 z-30 relative ${isEditingTimer ? 'hidden' : ''} ${!showControls && !isCleanMode ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500'}`}>
            <button onClick={() => {
                if (!isTimerRunning && timerSeconds <= 0) { if (timerInitial > 0) setTimerSeconds(timerInitial); else { setIsEditingTimer(true); setTimerInput('000000'); return; } }
                if (!isTimerRunning && autoZenMode && !isZenMode) setIsZenMode(true);
                setIsTimerRunning(!isTimerRunning);
            }} className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all`}>
                {isTimerRunning ? <Pause size={32} /> : <Play size={32} className={currentTheme.accent} />}
            </button>
            <button onClick={() => { setIsTimerRunning(false); setTimerSeconds(timerInitial > 0 ? timerInitial : 0); }} className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"><RotateCcw size={32} /></button>
        </div>

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
                            <button onClick={() => toggleMultiTimer(timer.id)} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all">{timer.running ? <Pause size={18} /> : <Play size={18} className={currentTheme.accent} />}</button>
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
));

const PomodoroView = React.memo(({
    ringPosition, showProgressRing, pomoSeconds, pomoMode, theme, currentTheme, isPomoRunning,
    autoZenMode, isZenMode, setIsZenMode, setIsPomoRunning, resetPomo, t, showControls, isCleanMode,
    enableMiniTask, focusGoal, setFocusGoal, enableFocusAnalytics, focusStats, customColors
}) => (
    <div className="flex flex-col items-center select-none mt-2 sm:mt-4">
        <div className="w-full flex justify-center mb-4 shrink-0 z-40">
            <div className="flex gap-2 sm:gap-4 transition-opacity duration-300">
                <button onClick={() => resetPomo('work')} className={`px-4 py-1.5 rounded-full text-xs sm:text-sm border transition-all ${pomoMode === 'work' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50 hover:bg-white/5'}`}>{t('work')}</button>
                <button onClick={() => resetPomo('short')} className={`px-4 py-1.5 rounded-full text-xs sm:text-sm border transition-all ${pomoMode === 'short' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50 hover:bg-white/5'}`}>{t('break')}</button>
                <button onClick={() => resetPomo('long')} className={`px-4 py-1.5 rounded-full text-xs sm:text-sm border transition-all ${pomoMode === 'long' ? `bg-white/10 border-white/50 ${currentTheme.accent}` : 'border-transparent opacity-50 hover:bg-white/5'}`}>{t('long')}</button>
            </div>
        </div>
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
            <button onClick={() => resetPomo(pomoMode)} className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"><RotateCcw size={32} /></button>
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
));

const StopwatchView = React.memo(({ stopwatch: masterStopwatch, setIsStopwatchRunning, isStopwatchRunning, currentTheme, setLaps, laps, stopwatchTime, setStopwatchTime, t, showControls, isCleanMode }) => {
    const [localMs, setLocalMs] = useState(0);
    const requestRef = useRef();
    const lastTimeRef = useRef(Date.now());

    // 碼錶本地補間動畫：提供流暢感，但不影響全域狀態
    useEffect(() => {
        if (isStopwatchRunning) {
            lastTimeRef.current = Date.now();
            const update = () => {
                const now = Date.now();
                setLocalMs(prev => prev + (now - lastTimeRef.current));
                lastTimeRef.current = now;
                requestRef.current = requestAnimationFrame(update);
            };
            requestRef.current = requestAnimationFrame(update);
            return () => cancelAnimationFrame(requestRef.current);
        }
    }, [isStopwatchRunning]);

    // 當 App 的節流狀態更新時，同步本地顯示
    useEffect(() => {
        setLocalMs(stopwatchTime);
    }, [stopwatchTime]);

    const display = formatDuration(localMs);

    return (
        <div className="flex flex-col items-center select-none w-full min-w-[300px] mt-2 sm:mt-12">
            <div className="text-[15vw] md:text-[120px] font-bold tracking-tighter tabular-nums flex items-baseline">
                <span>{display.m}</span><span className="opacity-50 mx-1">:</span><span>{display.s}</span>
                <span className={`text-[8vw] md:text-[60px] ml-1 md:ml-2 ${currentTheme.accent}`}>.{display.cs}</span>
            </div>
        <div className={`mt-8 flex gap-6 z-30 relative ${!showControls && !isCleanMode ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500'}`}>
            <button onClick={() => setIsStopwatchRunning(!isStopwatchRunning)} className="p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all">{isStopwatchRunning ? <Pause size={32} /> : <Play size={32} className={currentTheme.accent} />}</button>
            <button onClick={() => { if (isStopwatchRunning) setLaps([stopwatchTime, ...laps]); else { setStopwatchTime(0); setLaps([]); } }} className="p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all">{isStopwatchRunning ? <Plus size={32} /> : <RotateCcw size={32} />}</button>
        </div>
        <div className="mt-6 w-full max-h-32 overflow-y-auto custom-scrollbar">
            {laps.map((lap, i) => {
                const d = formatDuration(lap);
                return <div key={i} className="flex justify-between px-6 py-2 border-b border-white/5 opacity-80"><span>{t('lap')} {laps.length - i}</span><span>{d.m}:{d.s}.{d.cs}</span></div>
            })}
        </div>
    </div>
    );
});

const MementoView = React.memo(({ birthDate, setBirthDate, t }) => {
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
        <div className="flex flex-col items-center select-none w-full animate-fade-in relative mt-4 sm:mt-8 px-2">
            <div className="flex flex-col items-center mb-8 text-center bg-black/40 backdrop-blur-md px-6 sm:px-10 py-6 sm:py-8 rounded-[2rem] sm:rounded-[3rem] border border-white/10 w-full" style={{ maxWidth: 'calc(max(320px, (100dvh - 200px) * 0.65) * 1.5)' }}>
                <h2 className="text-2xl sm:text-3xl font-black tracking-widest uppercase mb-6 mt-2">{t('memento')}</h2>
                <div className="text-xs sm:text-sm opacity-80 flex items-center justify-center gap-4 w-full mb-8">
                    <span className="uppercase tracking-widest text-white/50">{t('birthDate')}</span>
                    <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 outline-none text-white text-base max-w-[180px] transition-all hover:bg-white/20 focus:bg-white/20 focus:border-white/40 font-mono tracking-widest" style={{ colorScheme: 'dark' }} />
                </div>
                <div className="w-full flex flex-col items-center">
                    <div className="flex justify-between w-full text-[10px] sm:text-xs opacity-60 mb-3 px-1 font-mono uppercase tracking-[0.2em]" style={{ maxWidth: 'calc(max(280px, (100dvh - 350px) * 0.65))' }}>
                        <span>{t('livedWeeks')} : {livedWeeksCount}</span>
                        <span>{pct}% - {t('totalWeeks')}</span>
                    </div>
                    <div className="relative w-full rounded-2xl overflow-hidden bg-black/50 border border-white/5 p-3 sm:p-5" style={{ display: 'grid', gridTemplateColumns: `repeat(${weeksPerYear}, 1fr)`, gap: '1px', alignContent: 'start', maxWidth: 'calc(max(280px, (100dvh - 350px) * 0.65))' }}>
                        {Array.from({ length: totalWeeksCount }).map((_, i) => {
                            const isLived = i < livedWeeksCount;
                            return <div key={i} className={`w-full aspect-square rounded-[1px] ${isLived ? 'bg-indigo-400' : 'bg-white/10'}`} style={{ opacity: isLived ? 0.9 : 0.2 }} title={`Week ${i + 1}`} />;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
});

const dashboardDateFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

const DashboardView = React.memo(({
    time, h, m, s, ms, ampm, dateLabel, showSeconds, clockLayout, showMillis,
    weather, t, currentTheme, nextEvent, selectedZones, getWorldTime,
    timerSeconds, timerInitial, isTimerRunning, stopwatch,
    focusGoal, activeTab, isZenMode
}) => {
    const formattedDate = useMemo(() => dashboardDateFormatter.format(time), [Math.floor(time.getTime() / 60000)]);
    
    return (
        <div className="w-full h-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-6 py-6 animate-fade-in select-none">
            {/* Left Column: Big Clock + Focus/Session */}
            <div className="flex-[1.8] flex flex-col gap-8">
                <div className={`flex-1 p-8 rounded-[3rem] ${currentTheme.card} border-t border-l border-white/10 flex flex-col items-center justify-center relative overflow-hidden group`}>
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <ClockDisplay h={h} m={m} s={s} ms={ms} ampm={ampm} dateLabel={dateLabel} showSeconds={showSeconds} clockLayout={clockLayout} showMillis={showMillis} />
                    {dateLabel && <div className="mt-4 text-sm opacity-40 tracking-[0.3em] uppercase">{dateLabel}</div>}
                </div>

                {/* Session Card (Timer or Stopwatch depending on what is active) */}
                <div className={`p-8 rounded-[2.5rem] ${currentTheme.card} border-white/5 flex items-center justify-between`}>
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-3xl bg-white/5 ${currentTheme.accent}`}>
                            {timerSeconds > 0 ? <Timer size={32} /> : <Target size={32} />}
                        </div>
                        <div>
                            <div className="text-xl font-bold">{timerSeconds > 0 ? t('work') : focusGoal || t('focusStats')}</div>
                            <div className="text-sm opacity-40 uppercase tracking-widest">{timerSeconds > 0 ? 'Current Session' : 'No Active Task'}</div>
                        </div>
                    </div>
                    <div className="text-4xl font-black tabular-nums tracking-tighter">
                        {timerSeconds > 0 ? `${formatDuration(timerSeconds * 1000).m}:${formatDuration(timerSeconds * 1000).s}` : `${stopwatch.m}:${stopwatch.s}`}
                    </div>
                </div>
            </div>

            {/* Right Column: Widgets */}
            <div className="flex-1 flex flex-col gap-8">
                {/* Weather & Date Pill */}
                <div className={`p-8 rounded-[2.5rem] ${currentTheme.card} border-white/5 flex flex-col gap-2`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CloudSun size={24} className={currentTheme.accent} />
                            <span className="text-2xl font-bold">{weather.city || 'Taipei'}</span>
                        </div>
                        <span className="text-3xl font-black">{weather.temp}°C</span>
                    </div>
                    <div className="text-sm opacity-40 uppercase tracking-[0.2em] mt-2">{formattedDate}</div>
                </div>

                {/* Next Event Widget */}
                {nextEvent && (
                    <div className={`p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 relative overflow-hidden`}>
                        <Sparkles size={120} className="absolute -right-8 -bottom-8 opacity-5 text-white" />
                        <div className="relative z-10">
                            <div className="text-xs uppercase tracking-[0.3em] opacity-60 mb-2">{t('anniversary')}</div>
                            <div className="text-2xl font-bold truncate mb-1">{nextEvent.label}</div>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-4xl font-black ${currentTheme.accent}`}>{nextEvent.days}</span>
                                <span className="text-sm opacity-60 uppercase">{t('daysLeft')}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mini World Clock */}
                <div className={`flex-1 p-8 rounded-[2.5rem] ${currentTheme.card} border-white/5 flex flex-col`}>
                    <div className="text-xs uppercase tracking-[0.3em] opacity-40 mb-6 flex items-center gap-2">
                        <Globe size={14} /> {t('worldClock')}
                    </div>
                    <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">
                        {selectedZones.slice(0, 3).map(zone => {
                            const tz = getWorldTime(zone.id);
                            return (
                                <div key={zone.id} className="flex justify-between items-center">
                                    <span className="opacity-60 font-medium">{t(zone.label)}</span>
                                    <span className="font-bold tabular-nums">{tz.h}:{tz.m}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
});


const CalendarView = React.memo(({ calendarDate, setCalendarDate, t, currentTheme, lang, I18N, setIsAddingEvent, setNewEventName, setNewEventDate, setMode }) => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, type: 'prev' });
    for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, type: 'current', isToday: i === today.getDate() && isCurrentMonth });
    let nextDay = 1;
    while (cells.length < 42) cells.push({ day: nextDay++, type: 'next' });

    const dayLabels = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
    const monthNames = (I18N[lang] || I18N['zh-TW']).months;
    const grid7 = { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' };

    return (
        <div className="flex flex-col w-full max-w-[540px] select-none mt-12">
            <div className="flex items-center gap-3 mb-5">
                <button onClick={() => setCalendarDate(new Date())} className="px-5 py-2 rounded-full border border-white/20 text-sm font-medium bg-transparent hover:bg-white/10 transition-colors">{t('today')}</button>
                <div className="flex items-center gap-0.5">
                    <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="p-1.5 rounded-full hover:bg-white/10 transition-colors"><ChevronLeft size={22} /></button>
                    <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="p-1.5 rounded-full hover:bg-white/10 transition-colors"><ChevronRight size={22} /></button>
                </div>
            </div>
            <div className="text-2xl mb-6">
                <span className={`font-semibold mr-2 ${currentTheme.accent}`}>{year}</span>
                <span className="opacity-90">{monthNames[month]}</span>
            </div>
            <div style={grid7}>
                {dayLabels.map((lbl, i) => (
                    <div key={i} className="text-center text-[11px] font-semibold uppercase tracking-wider pb-3 opacity-40">{lbl}</div>
                ))}
                <div className="grid grid-cols-7 col-span-full border-t border-white/10">
                    {cells.map((cell, i) => {
                        const isToday = cell.type === 'current' && cell.isToday;
                        const colIndex = i % 7;
                        return (
                            <div key={i} onClick={() => { if (cell.type === 'current') { setNewEventDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`); setNewEventName(''); setIsAddingEvent(true); setMode('anniversary'); } }} className={`relative min-h-[56px] border-b border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${colIndex === 0 ? 'border-l' : ''}`}>
                                <div className={`absolute top-1.5 left-1/2 -translate-x-1/2 w-7 h-7 flex items-center justify-center text-xs rounded-full transition-all ${isToday ? 'bg-blue-500 font-bold text-white' : cell.type !== 'current' ? 'opacity-20' : colIndex === 0 ? 'text-red-400' : colIndex === 6 ? 'text-blue-400' : ''}`}>
                                    {cell.day}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

const LauncherView = React.memo(({ setMode, t }) => {
    const apps = [
        { id: 'pomodoro', icon: Target, label: t('tabPomodoro'), color: 'text-rose-400', bg: 'bg-rose-500/10' },
        { id: 'timer', icon: Timer, label: t('tabTimer'), color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { id: 'stopwatch', icon: Play, label: t('tabStopwatch'), color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { id: 'calendar', icon: CalendarDays, label: t('tabMonthly'), color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { id: 'anniversary', icon: Sparkles, label: t('tabEvents'), color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { id: 'memento', icon: LayoutPanelTop, label: t('tabLife'), color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { id: 'world', icon: Globe, label: t('worldClock'), color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 flex flex-col items-center animate-fade-in mt-6 sm:mt-12 select-none">
            <h2 className="text-sm font-bold mb-8 tracking-[0.3em] uppercase opacity-40">Workspace Tools</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 w-full">
                {apps.map(app => (
                    <button
                        key={app.id}
                        onClick={() => setMode(app.id)}
                        className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all group"
                    >
                        <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] ${app.bg} mb-4 group-hover:scale-110 transition-transform`}>
                            <app.icon size={32} className={`${app.color}`} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium tracking-wider text-center opacity-80 group-hover:opacity-100">{app.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
});
