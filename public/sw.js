self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const title = data.title || 'SajiloKheti Alert';
    const options = {
      body: data.body,
      icon: '/nepali_heropic.png',
      badge: '/badge.png', // Optional
      data: data.url // URL to open
    };

    event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
