// Service Worker pour gérer les notifications push
self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Invite Moi', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://invitemoiasortir.com')
  );
});