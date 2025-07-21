const puppeteer = require("puppeteer");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteerExtra = require("puppeteer-extra");

puppeteerExtra.use(StealthPlugin());

module.exports = async function getEpisodeMeta(url) {
  const browser = await puppeteerExtra.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    // OPTIONAL: Take screenshot to verify page loaded
    await page.screenshot({ path: "debug.png" });

    // Wait for title if it exists (fallback if not found)
    let title = "Unknown Anime";
    try {
      await page.waitForSelector("h2.anime-title", { timeout: 10000 });
      title = await page.$eval("h2.anime-title", (el) => el.textContent.trim());
    } catch (e) {
      console.warn("⚠️ Warning: Anime title not found, using default.");
    }

    // Wait for episode name if available
    let episodeName = "Episode";
    try {
      await page.waitForSelector("div.anime-info h3", { timeout: 10000 });
      episodeName = await page.$eval("div.anime-info h3", (el) => el.textContent.trim());
    } catch (e) {
      console.warn("⚠️ Warning: Episode name not found, using default.");
    }

    const m3u8Url = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script"));
      for (let script of scripts) {
        if (script.textContent.includes(".m3u8")) {
          const match = script.textContent.match(/(https:\/\/[^\s"]+\.m3u8[^\s"]*)/);
          if (match) return match[1];
        }
      }
      return null;
    });

    await browser.close();

    if (!m3u8Url) throw new Error("❌ No .m3u8 URL found on page.");

    return {
      title: title.replace(/[/\\?%*:|"<>]/g, "-"),
      episodeName: episodeName.replace(/[/\\?%*:|"<>]/g, "-"),
      m3u8Url,
    };
  } catch (err) {
    await browser.close();
    throw err;
  }
};
