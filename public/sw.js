const APP_NAME = "La librairie des auteurs";

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: APP_NAME, body: event.data?.text() };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || APP_NAME, {
      body: data.body || "",
      icon: "/icons/192",
      badge: "/icons/192",
      data: { url: data.url || "/nouveautes" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/nouveautes";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
