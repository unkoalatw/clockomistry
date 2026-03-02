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

