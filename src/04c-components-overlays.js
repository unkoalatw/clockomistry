
const SplashOverlay = React.memo(({ hasAgreed, setHasAgreed, lang, setLang, I18N, t }) => {
    if (hasAgreed) return null;
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none" style={{ background: 'linear-gradient(160deg, #020420 0%, #0a1628 30%, #111d3a 50%, #0d1a2f 70%, #040812 100%)' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[80vw] h-[80vw] rounded-full bg-blue-600/8 blur-[120px] -top-[20%] -left-[20%] animate-pulse" />
                <div className="absolute w-[60vw] h-[60vw] rounded-full bg-indigo-500/8 blur-[100px] -bottom-[10%] -right-[10%] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute w-[40vw] h-[40vw] rounded-full bg-cyan-500/5 blur-[80px] top-[40%] left-[50%] -translate-x-1/2 animate-pulse" style={{ animationDelay: '4s' }} />
            </div>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="relative flex flex-col items-center text-center px-8 max-w-xl space-y-10">
                <div className="relative mb-2">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-blue-500/10">
                        <Clock size={36} className="text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.4)]" />
                    </div>
                </div>
                <div className="space-y-4">
                    <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[0.9]">
                        Clock<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">omistry</span>
                    </h1>
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
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        { label: t('privacy'), href: 'privacy.html' },
                        { label: t('terms'), href: 'terms.html' },
                        { label: t('cookies'), href: 'cookies.html' },
                        { label: t('disclaimer'), href: 'disclaimer.html' }
                    ].map((item, i) => (
                        <a key={i} href={item.href} className="px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.15] text-xs font-medium text-slate-500 hover:text-slate-300 transition-all duration-300">{item.label}</a>
                    ))}
                </div>
                <button
                    onClick={() => setHasAgreed(true)}
                    className="group relative px-12 py-5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-base tracking-wide transition-all duration-300 hover:shadow-[0_0_60px_-12px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95"
                >
                    <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                    <span className="relative">{t('agree')}</span>
                </button>
            </div>
            <div className="absolute bottom-8 text-[10px] text-slate-600 tracking-[0.3em] uppercase">{t('splashBottom')}</div>
        </div>
    );
});

const ScreenSaverOverlay = React.memo(({ isScreenSaverActive, ssPos, h, m, t }) => {
    if (!isScreenSaverActive) return null;
    return (
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
    );
});