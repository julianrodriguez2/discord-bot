const { SlashCommandBuilder } = require("discord.js");
const { queueSong } = require("./musicUtils");
const ytdl = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song from YouTube.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The YouTube URL of the song to play")
        .setRequired(true)
    ),
  async execute(interaction) {
    const url = interaction.options.getString("url");

    if (!ytdl.validateURL(url)) {
      await interaction.reply("Please provide a valid YouTube URL.");
      return;
    }

    let title = "";
    try {
      const videoInfo = await ytdl.getInfo(url);
      title = videoInfo.videoDetails.title;
    } catch (error) {
      console.error("Error fetching video info: ", error);
      await interaction.reply("There was an error fetching the video details.");
      return;
    }

    const song = {
      title: title,
      url,
    };

    await queueSong(interaction, song);
  },
};
