// lyrics.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getLyrics } = require("../../utilities/lyricsUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription(
      "Fetches and displays the lyrics for the currently playing song or a specified song."
    )
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription(
          "The name of the song to get lyrics for. Leave empty for the current song."
        )
    ),
  async execute(interaction) {
    const songName = interaction.options.getString("song");
    const lyrics = await getLyrics(songName);

    if (!lyrics) {
      await interaction.reply("Lyrics not found.");
      return;
    }

    // Due to message length limits, consider sending lyrics in chunks or using an embed
    const embed = new EmbedBuilder()
      .setTitle(`Lyrics for ${songName}`)
      .setDescription(lyrics.slice(0, 4096));

    await interaction.reply({ embeds: [embed] });
  },
};
