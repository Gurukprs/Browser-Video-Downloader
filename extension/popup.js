document.getElementById("downloadBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "findM3U8" }, (response) => {
      if (response?.m3u8Url) {
        chrome.runtime.sendMessage({
          download: true,
          url: response.m3u8Url,
          filename: "episode.m3u8"
        });
        document.getElementById("status").textContent = "Download started!";
      } else {
        document.getElementById("status").textContent = "No video found.";
      }
    });
  });
});
