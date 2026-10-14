/* 离线缓存：旅途中信号差也能打开。
 * 策略：网络优先，3 秒超时或离线时回落缓存。
 * 改了任何静态文件后，把 VERSION 加 1，旧缓存会在 activate 时清掉。 */
const VERSION = 'lisbon-v2-2';
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
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // 网络优先（3 秒超时回落缓存）：保证 index/app/data/style 总是同一代版本，避免新旧文件混用导致白屏；
  // 信号差或离线时用缓存。
  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      // ignoreSearch：?now= / ?day= 之类的测试参数也命中同一份缓存
      const fromCache = () => cache.match(req, { ignoreSearch: true });
      const net = fetch(req).then((res) => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      });
      const timeout = new Promise((_, rej) => setTimeout(rej, 3000));
      try { return await Promise.race([net, timeout]); }
      catch { return (await fromCache()) || net; }
    })
  );
});
