const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

module.exports = async function downloadVideo(m3u8Url, meta) {
  const dir = path.join(
    __dirname,
    "..",
    "downloads",
    meta.title,
    "Season 1"
  );
  fs.mkdirSync(dir, { recursive: true });

  const outPath = path.join(dir, `${meta.episodeName}.mp4`);

  console.log(chalk.green("\n⬇️  Downloading to:"), outPath);

  const ffmpeg = spawn("ffmpeg", [
    "-i",
    m3u8Url,
    "-c",
    "copy",
    "-bsf:a",
    "aac_adtstoasc",
    outPath,
  ]);

  ffmpeg.stderr.on("data", (data) => {
    process.stdout.write(data.toString());
  });

  ffmpeg.on("close", (code) => {
    if (code === 0) {
      console.log(chalk.greenBright("\n✅ Download complete!\n"));
    } else {
      console.error(chalk.red(`❌ ffmpeg exited with code ${code}`));
    }
  });
};
