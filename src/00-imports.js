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
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
        disableForReducedMotion: true
    });
};
import {
    Maximize2, Minimize2, Timer, Clock, Monitor,
    Play, Pause, RotateCcw, AlertCircle, Globe,
    StopCircle, Settings, X, Check, Plus, Search,
    Type, Upload, Palette, ArrowLeft, Coffee, Brain,
    CalendarDays, Languages, Trash2, ChevronLeft, ChevronRight,
    Calendar, CloudSun, Share2, Download, LayoutTemplate, Sparkles, Delete,
    Camera, CheckSquare, BarChart2, Sliders, Target, Edit3,
    Sunrise, Sunset, LayoutGrid, LayoutPanelTop, RefreshCw, Layers, ExternalLink
} from 'lucide-react';

const APP_VERSION = '1.3.0';

