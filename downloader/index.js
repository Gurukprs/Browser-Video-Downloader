const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const getEpisodeMeta = require("./utils/getEpisodeMeta");
const parseM3U8 = require("./utils/parseM3U8");
const downloadVideo = require("./utils/downloadVideo");

(async () => {
  console.clear();
  console.log(chalk.cyanBright("🎥 HiAnime.to CLI Downloader\n"));

  const { url } = await inquirer.prompt([
    {
      name: "url",
      type: "input",
      message: "Enter HiAnime.to episode URL:",
      validate: (val) =>
        val.includes("hianime.to") ? true : "Enter a valid HiAnime URL",
    },
  ]);

  const meta = await getEpisodeMeta(url);
  console.log(chalk.yellow("📺 Anime:"), meta.title);
  console.log(chalk.yellow("📦 Episode:"), meta.episodeName);

  const qualityList = await parseM3U8(meta.m3u8Url);

  const { selectedUrl } = await inquirer.prompt([
    {
      name: "selectedUrl",
      type: "list",
      message: "Select download quality:",
      choices: qualityList.map((q) => ({
        name: q.quality,
        value: q.url,
      })),
    },
  ]);

  await downloadVideo(selectedUrl, meta);
})();
