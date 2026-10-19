/* 离线缓存：旅途中信号差也能打开。
 * 策略：网络优先，3 秒超时或离线时回落缓存。
 * 改了任何静态文件后，把 VERSION 加 1，旧缓存会在 activate 时清掉。 */
const VERSION = 'lisbon-v2-10';
const FILES = [
  './', 'index.html', 'style.css', 'data.js', 'app.js',
  'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => Promise.allSettled(FILES.map((f) => c.add(f))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  // 去掉 ?now= / ?day= 等查询参数，保证读写命中同一份静态缓存，不产生重复条目
  const cacheKey = url.origin + url.pathname;
  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const net = fetch(req).then((res) => {
        if (res.ok) cache.put(cacheKey, res.clone());
        return res;
      });
      const timeout = new Promise((_, rej) => setTimeout(rej, 3000));
      try {
        return await Promise.race([net, timeout]);
      } catch {
        net.catch(() => {});
        return (await cache.match(cacheKey)) || net;
      }
    })
  );
});
