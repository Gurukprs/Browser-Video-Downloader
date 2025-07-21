const axios = require("axios");

module.exports = async function parseM3U8(masterUrl) {
  const { data } = await axios.get(masterUrl);
  const lines = data.split("\n");

  const results = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("RESOLUTION=")) {
      const resMatch = lines[i].match(/RESOLUTION=\d+x(\d+)/);
      if (resMatch) {
        results.push({
          quality: resMatch[1] + "p",
          url: new URL(lines[i + 1], masterUrl).href,
        });
      }
    }
  }

  if (results.length === 0) throw new Error("❌ No quality variants found.");
  return results.reverse(); // show highest first
};
