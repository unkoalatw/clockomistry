const CACHE_NAME = 'clockomistry-v3';
const ASSETS = [
    './',
    './index.html',
    './output.css',
    './script.dist.js',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './public/audio/beep.ogg',
    './public/audio/digital.ogg',
    './public/audio/bell.ogg'
];

// Install — cache core assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch — network first, fallback to cache (only http/https)
self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    e.respondWith(
        fetch(e.request)
            .then(res => {
                // allow storing opaque responses (from CDNs like esm.sh & fonts)
                if (res.status === 200 || res.type === 'opaque') {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                }
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});

// Notification click handler
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
