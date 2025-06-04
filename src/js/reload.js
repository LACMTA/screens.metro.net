let currentVersion = null;

async function checkForUpdates() {
  try {
    const res = await fetch("/version.txt", { cache: "no-store" });
    const newVersion = await res.text();

    if (!currentVersion) {
      currentVersion = newVersion.trim();
    } else if (newVersion.trim() !== currentVersion) {
      location.reload(true); // force full reload
    }
  } catch (e) {
    console.error("Update check failed:", e);
  }
}

// Check every 60 seconds
setInterval(checkForUpdates, 60000);

// Optional: Daily refresh to prevent memory buildup
setTimeout(() => {
  location.reload(true);
}, 86400000); // 24 hrs