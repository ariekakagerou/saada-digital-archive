// Self-destroying Service Worker
// In development, Service Workers aggressively cache Next.js router files.
// When you restart the server the next day, the build chunks change,
// causing the Service Worker to fetch dead chunks, resulting in a persistent 404.

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.registration.unregister()
    .then(function() {
      return self.clients.matchAll();
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url));
    });
});
