
const AppearanceSettings = React.memo(({ t, currentTheme, DEFAULT_THEMES, theme, setTheme, customColors, updateCustomColor, customBgImage, setCustomBgImage, bgImageInputRef, handleBgImageUpload, DEFAULT_FONTS, font, setFont, fileInputRef, handleFontUpload, hasCustomFont, clockLayout, setClockLayout, enableParticles, setEnableParticles }) => (
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
            <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-5">
                <div>
                    <span className="text-sm font-medium opacity-80 block mb-3">{t('bgGradient')}</span>
                    <div className="flex gap-4 items-center">
                        {[['bg1', t('color1')], ['bg2', t('color2')], ['bg3', t('color3')]].map(([k, l]) => (
                            <label key={k} className="flex flex-col items-center gap-1 cursor-pointer">
                                <input type="color" value={customColors[k]} onChange={(e) => updateCustomColor(k, e.target.value)} style={{ width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                                <span className="opacity-50 text-[10px]">{l}</span>
                            </label>
                        ))}
                        <div className="flex-1 rounded-lg border border-white/10 h-10" style={{ background: `linear-gradient(135deg, ${customColors.bg1}, ${customColors.bg2}, ${customColors.bg3})` }}></div>
                    </div>
                </div>
                <div>
                    <span className="text-sm font-medium opacity-80 block mb-3">{t('textAccent')}</span>
                    <div className="flex gap-4 items-center">
                        {[['text', t('text')], ['accent', t('accent')]].map(([k, l]) => (
                            <label key={k} className="flex flex-col items-center gap-1 cursor-pointer">
                                <input type="color" value={customColors[k]} onChange={(e) => updateCustomColor(k, e.target.value)} style={{ width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                                <span className="opacity-50 text-[10px]">{l}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <span className="text-sm font-medium opacity-80 block mb-3">{t('bgImage')}</span>
                    <div className="flex gap-3 items-center">
                        <button onClick={() => bgImageInputRef.current.click()} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm"><Upload size={14} /> {t('uploadImage')}</button>
                        {customBgImage && <button onClick={() => setCustomBgImage('')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm opacity-60 hover:opacity-100"><X size={14} /> {t('remove')}</button>}
                        <input type="file" ref={bgImageInputRef} className="hidden" accept="image/*" onChange={handleBgImageUpload} />
                    </div>
                    {customBgImage && <div className="w-full rounded-xl overflow-hidden border border-white/10 h-24 mt-3"><img src={customBgImage} className="w-full h-full object-cover opacity-60" /></div>}
                </div>
            </div>
        )}
        {/* --- 版面樣式選擇器 --- */}
        <div className="pt-6">
            <span className="text-lg opacity-80 block mb-4"><LayoutGrid size={20} className="inline mr-2 align-text-bottom" />{t('clockLayoutTitle')}</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    {
                        id: 'classic', icon: () => (
                            <div className="flex items-baseline gap-0.5 font-bold tabular-nums">
                                <span className="text-2xl">12</span><span className="text-lg opacity-50 animate-pulse">:</span><span className="text-2xl">30</span>
                                <span className="text-xs opacity-40 ml-0.5">45</span>
                            </div>
                        )
                    },
                    {
                        id: 'stacked', icon: () => (
                            <div className="flex flex-col items-center font-bold tabular-nums leading-[0.9]">
                                <span className="text-2xl">12</span>
                                <span className="text-2xl opacity-70">30</span>
                            </div>
                        )
                    },
                    {
                        id: 'minimal', icon: () => (
                            <div className="font-extralight tabular-nums text-2xl tracking-tight">
                                12<span className="opacity-50">:</span>30
                            </div>
                        )
                    },
                    {
                        id: 'split', icon: () => (
                            <div className="flex items-center gap-2 font-bold tabular-nums">
                                <span className="text-xl">12</span>
                                <div className="flex flex-col gap-0.5"><div className="w-1 h-1 rounded-full bg-current opacity-50"></div><div className="w-1 h-1 rounded-full bg-current opacity-50"></div></div>
                                <span className="text-xl">30</span>
                            </div>
                        )
                    },
                    {
                        id: 'digital', icon: () => (
                            <div className="flex items-center gap-1 tabular-nums">
                                <div className="bg-white/10 rounded px-1 py-0.5 text-sm font-bold">1</div>
                                <div className="bg-white/10 rounded px-1 py-0.5 text-sm font-bold">2</div>
                                <span className="text-xs opacity-40 mx-0.5">:</span>
                                <div className="bg-white/10 rounded px-1 py-0.5 text-sm font-bold">3</div>
                                <div className="bg-white/10 rounded px-1 py-0.5 text-sm font-bold">0</div>
                            </div>
                        )
                    }
                ].map(layout => (
                    <button key={layout.id} onClick={() => setClockLayout(layout.id)} className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all min-h-[90px] ${clockLayout === layout.id ? 'bg-white/10 border-white/50 scale-105 shadow-lg' : 'border-white/10 hover:bg-white/5'}`}>
                        <layout.icon />
                        <span className="text-xs opacity-60">{t('layout_' + layout.id)}</span>
                    </button>
                ))}
            </div>
        </div>
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
        <div className="pt-6 border-t border-white/10 mt-6">
            <label className="flex items-center justify-between p-6 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div>
                    <span className="block text-base">{t('particles') || 'Particle Background'}</span>
                    <span className="block text-xs opacity-50 mt-1">Add a floating particle effect to the background</span>
                </div>
                <div onClick={() => setEnableParticles(!enableParticles)} className={`w-14 h-8 rounded-full relative transition-colors ${enableParticles ? 'bg-blue-500' : 'bg-slate-600'}`}>
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${enableParticles ? 'left-7' : 'left-1'}`} />
                </div>
            </label>
        </div>
    </section>
));

const FeaturesSettings = React.memo(({ t, searchQuery, setSearchQuery, filteredZones, selectedZones, setSelectedZones, I18N, lang, setLang }) => (
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
                                if (isSelected) setSelectedZones(prev => prev.filter(z => z.id !== zone.id));
                                else setSelectedZones(prev => [...prev, zone]);
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
));

const GeneralSettings = React.memo(({
    t, showMillis, setShowMillis, notificationsEnabled, handleToggleNotifications,
    autoZenMode, setAutoZenMode, showProgressRing, setShowProgressRing,
    enableMiniTask, setEnableMiniTask, enableFocusAnalytics, setEnableFocusAnalytics,
    enableMeetingPlanner, setEnableMeetingPlanner, ringPosition, setRingPosition,
    alarmSound, setAlarmSound, playAlarm,
    use12Hour, setUse12Hour, hourlyChime, setHourlyChime, showSeconds, setShowSeconds,
    showDate, setShowDate, showNextEvent, setShowNextEvent, dashboardMode, setDashboardMode,
    autoDarkMode, setAutoDarkMode, enableEcoMode, setEnableEcoMode
}) => (
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
                ['enableMeetingPlanner', enableMeetingPlanner, setEnableMeetingPlanner],
                ['use12Hour', use12Hour, setUse12Hour],
                ['hourlyChime', hourlyChime, setHourlyChime],
                ['showSeconds', showSeconds, setShowSeconds],
                ['showDate', showDate, setShowDate],
                ['showNextEvent', showNextEvent, setShowNextEvent],
                ['dashboardMode', dashboardMode, setDashboardMode],
                ['autoDarkMode', autoDarkMode, setAutoDarkMode],
                ['enableEcoMode', enableEcoMode, setEnableEcoMode]].map(([k, val, setVal]) => (
                    <label key={k} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                        <span>{t(k) || (k === 'autoDarkMode' ? 'Auto Dark Mode (Night)' : k === 'enableEcoMode' ? 'Eco Mode (Battery)' : k)}</span>
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
                        <button key={sk} onClick={() => setRingPosition(sk)} className={`p-4 rounded-xl text-center text-sm transition-all border ${ringPosition === sk ? 'bg-white/10 border-white/50 shadow-lg scale-105' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
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
                        <button key={sk} onClick={() => setAlarmSound(sk)} className={`p-4 rounded-xl text-center text-sm transition-all border ${alarmSound === sk ? 'bg-white/10 border-white/50 scale-105' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                            {t(`sound${sk.charAt(0).toUpperCase() + sk.slice(1)}`)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </section>
));

const AboutSettings = React.memo(({ t, exportTheme, handleExportImage, isExporting, importTheme }) => (
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
                <button onClick={() => { const code = prompt(t('importPrompt')); importTheme(code); }} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center gap-2 transition-all">
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
));

const SystemSettings = React.memo(({ t, isDownloadingApp, handleDownloadApp, APP_VERSION, updateStatus, handleForceUpdate, handleCheckUpdate, latestVersion, handleClearData }) => {
    const fileRef = useRef(null);

    return (
    <section className="space-y-12 animate-fade-in">
        <div className="space-y-6">
            <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><CloudSun size={24} className="text-amber-400" /> {t('localBackup') || 'Local Backup (JSON)'}</h3>
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col gap-4">
                <p className="text-sm opacity-80 leading-relaxed">Save your themes, settings, and events as a JSON file to your device, or restore them from a previous backup.</p>
                <div className="flex gap-4 mt-2">
                    <button onClick={() => window.exportSettingsToFile()} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all font-medium flex items-center justify-center gap-2 text-sm"><Upload size={16}/> Export Config</button>
                    <button onClick={() => fileRef.current.click()} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all font-medium flex items-center justify-center gap-2 text-sm"><Download size={16}/> Import Config</button>
                    <input type="file" ref={fileRef} className="hidden" accept=".json" onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            try {
                                await window.importSettingsFromFile(file);
                                window.location.reload();
                            } catch(err) {
                                alert(err.message);
                            }
                        }
                    }} />
                </div>
            </div>
        </div>
        <div className="space-y-6">
            <h3 className="text-xl font-medium flex items-center gap-3 border-b border-white/10 pb-4"><Download size={24} className="text-blue-400" /> {t('downloadApp')}</h3>
            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm opacity-80 mb-6 leading-relaxed text-blue-100">{t('appDesc')}</p>
                <button onClick={handleDownloadApp} disabled={isDownloadingApp} className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
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
                    <button onClick={handleForceUpdate} className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                        <Download size={18} /> {t('updateNow')} (v{latestVersion})
                    </button>
                ) : (
                    <button onClick={handleCheckUpdate} disabled={updateStatus === 'checking'} className={`w-full py-4 rounded-xl border font-medium active:scale-95 transition-all flex items-center justify-center gap-2 ${updateStatus === 'latest' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}>
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
                <button onClick={handleClearData} className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/25 hover:border-red-500/60 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Trash2 size={18} /> {t('clearDataBtn')}
                </button>
            </div>
        </div>
    </section>
    );
});

const SettingsOverlay = React.memo(({
    showSettings, setShowSettings, activeSettingsTab, setActiveSettingsTab,
    t, currentTheme, DEFAULT_THEMES, theme, setTheme,
    customColors, updateCustomColor, customBgImage, setCustomBgImage,
    bgImageInputRef, handleBgImageUpload,
    DEFAULT_FONTS, font, setFont, fileInputRef, handleFontUpload, hasCustomFont,
    searchQuery, setSearchQuery, filteredZones, selectedZones, setSelectedZones,
    I18N, lang, setLang,
    showMillis, setShowMillis, notificationsEnabled, handleToggleNotifications,
    autoZenMode, setAutoZenMode, showProgressRing, setShowProgressRing,
    enableMiniTask, setEnableMiniTask, enableFocusAnalytics, setEnableFocusAnalytics,
    enableMeetingPlanner, setEnableMeetingPlanner, enableParticles, setEnableParticles,
    ringPosition, setRingPosition, alarmSound, setAlarmSound, playAlarm,
    exportTheme, handleExportImage, isExporting, importTheme,
    isDownloadingApp, handleDownloadApp, APP_VERSION, updateStatus,
    handleForceUpdate, handleCheckUpdate, latestVersion, handleClearData,
    clockLayout, setClockLayout,
    use12Hour, setUse12Hour, hourlyChime, setHourlyChime, showSeconds, setShowSeconds,
    showDate, setShowDate, showNextEvent, setShowNextEvent, dashboardMode, setDashboardMode,
    autoDarkMode, setAutoDarkMode, enableEcoMode, setEnableEcoMode
}) => {
    if (!showSettings) return null;
    return (
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
                        <AppearanceSettings t={t} currentTheme={currentTheme} DEFAULT_THEMES={DEFAULT_THEMES} theme={theme} setTheme={setTheme} customColors={customColors} updateCustomColor={updateCustomColor} customBgImage={customBgImage} setCustomBgImage={setCustomBgImage} bgImageInputRef={bgImageInputRef} handleBgImageUpload={handleBgImageUpload} DEFAULT_FONTS={DEFAULT_FONTS} font={font} setFont={setFont} fileInputRef={fileInputRef} handleFontUpload={handleFontUpload} hasCustomFont={hasCustomFont} clockLayout={clockLayout} setClockLayout={setClockLayout} enableParticles={enableParticles} setEnableParticles={setEnableParticles} />
                    )}

                    {activeSettingsTab === 'features' && (
                        <FeaturesSettings t={t} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredZones={filteredZones} selectedZones={selectedZones} setSelectedZones={setSelectedZones} I18N={I18N} lang={lang} setLang={setLang} />
                    )}

                    {activeSettingsTab === 'general' && (
                        <GeneralSettings
                            t={t} showMillis={showMillis} setShowMillis={setShowMillis}
                            notificationsEnabled={notificationsEnabled} handleToggleNotifications={handleToggleNotifications}
                            autoZenMode={autoZenMode} setAutoZenMode={setAutoZenMode}
                            showProgressRing={showProgressRing} setShowProgressRing={setShowProgressRing}
                            enableMiniTask={enableMiniTask} setEnableMiniTask={setEnableMiniTask}
                            enableFocusAnalytics={enableFocusAnalytics} setEnableFocusAnalytics={setEnableFocusAnalytics}
                            enableMeetingPlanner={enableMeetingPlanner} setEnableMeetingPlanner={setEnableMeetingPlanner}
                            ringPosition={ringPosition} setRingPosition={setRingPosition}
                            alarmSound={alarmSound} setAlarmSound={setAlarmSound} playAlarm={playAlarm}
                            use12Hour={use12Hour} setUse12Hour={setUse12Hour}
                            hourlyChime={hourlyChime} setHourlyChime={setHourlyChime}
                            showSeconds={showSeconds} setShowSeconds={setShowSeconds}
                            showDate={showDate} setShowDate={setShowDate}
                            showNextEvent={showNextEvent} setShowNextEvent={setShowNextEvent}
                            dashboardMode={dashboardMode} setDashboardMode={setDashboardMode}
                            autoDarkMode={autoDarkMode} setAutoDarkMode={setAutoDarkMode}
                            enableEcoMode={enableEcoMode} setEnableEcoMode={setEnableEcoMode}
                        />
                    )}

                    {activeSettingsTab === 'about' && (
                        <AboutSettings t={t} exportTheme={exportTheme} handleExportImage={handleExportImage} isExporting={isExporting} importTheme={importTheme} />
                    )}

                    {activeSettingsTab === 'system' && (
                        <SystemSettings t={t} isDownloadingApp={isDownloadingApp} handleDownloadApp={handleDownloadApp} APP_VERSION={APP_VERSION} updateStatus={updateStatus} handleForceUpdate={handleForceUpdate} handleCheckUpdate={handleCheckUpdate} latestVersion={latestVersion} handleClearData={handleClearData} />
                    )}
                </div>
            </div>
        </div >
    );
});
