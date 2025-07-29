chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.download) {
    chrome.downloads.download({
      url: request.url,
      filename: `${request.filename || "video"}.m3u8`
    });
  }
});
