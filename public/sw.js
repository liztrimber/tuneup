self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || "Tuneup";
  const options = {
    body: data.body || "Time for your weekly tuneup!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: "tuneup-reminder",
    data: { url: data.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
