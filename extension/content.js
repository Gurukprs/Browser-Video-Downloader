chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "findM3U8") {
    const scripts = Array.from(document.querySelectorAll("script"));
    for (const script of scripts) {
      const match = script.textContent.match(/(https:\/\/[^"]+\.m3u8[^"]*)/);
      if (match) {
        sendResponse({ m3u8Url: match[1] });
        return true; // Async response
      }
    }
    sendResponse({ m3u8Url: null });
  }
});
