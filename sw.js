const cacheName = 'xkcd-alt';

const staticAssets = [
  'index.html',
  'css/styles.css',
  'js/script.js',
  'js/ajax_utils.js',
  'js/xkcd_utils.js',
  'js/page_utils.js',
  'js/gesture_utils.js',
  'snippets/about.html',
  'snippets/home.html',
  'fonts/xkcd-script.ttf',
  'assets/back_small_dark.png',
  'assets/back_small.png',
  'assets/next_dark.png',
  'assets/next_small.png',
  'assets/favorite_off_small.png',
  'assets/favoriteSmall.png',
  'assets/r1_small.png',
  'assets/r2_small.png',
  'assets/r3_small.png',
  'assets/r4_small.png',
  'assets/r5_small.png',
  'assets/r6_small.png',
  'assets/download_btn_dark.png',
  'assets/download_btn_colour.png'
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});


self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}