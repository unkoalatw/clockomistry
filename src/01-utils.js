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
    return new Promise((resolve) => request.onsuccess = () => resolve(request.result));
};

