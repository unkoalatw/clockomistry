// --- IndexedDB 管理 (用於儲存大體積字型) ---
const DB_NAME = 'ClockomistryDB';
const STORE_NAME = 'fonts';
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};
const saveFontToDB = async (data) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, 'customFont');
    return new Promise((resolve) => tx.oncomplete = resolve);
};
const getFontFromDB = async () => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get('customFont');
};

// --- ICS Export Tool ---
window.exportToICS = (eventTitle, eventDateStr) => {
    const pad = n => n < 10 ? '0' + n : n;
    const now = new Date();
    const dtStamp = '' + now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate()) + 'T' + 
                    pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + 'Z';
    
    const targetDate = new Date(eventDateStr);
    const dtStart = '' + targetDate.getFullYear() + pad(targetDate.getMonth() + 1) + pad(targetDate.getDate());

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `DTSTART;VALUE=DATE:${dtStart}`,
        `DTSTAMP:${dtStamp}`,
        `UID:${Date.now()}@clockomistry`,
        `SUMMARY:${eventTitle}`,
        `DESCRIPTION:Event exported from Clockomistry`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${eventTitle}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// --- Local Settings Backup Tool ---
window.exportSettingsToFile = () => {
    const backupData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('clock_')) {
            backupData[key] = localStorage.getItem(key);
        }
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.href = URL.createObjectURL(blob);
    link.download = `clockomistry-backup-${date}.json`;
    link.click();
};

window.importSettingsFromFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                Object.entries(data).forEach(([k, v]) => {
                    if (k.startsWith('clock_')) localStorage.setItem(k, v);
                });
                resolve();
            } catch (err) {
                reject(new Error('Invalid backup file'));
            }
        };
        reader.onerror = () => reject(new Error('File reading failed'));
        reader.readAsText(file);
    });
};

