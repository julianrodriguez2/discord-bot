// playlist-add.js
const { SlashCommandBuilder } = require("discord.js");
const { addSongToPlaylist } = require("../../utilities/playlistUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlistadd")
    .setDescription("Adds a song to a specified playlist.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the playlist.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The URL of the song to add.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString("name");
    const songUrl = interaction.options.getString("song");
    const userId = interaction.user.id;

    const result = await addSongToPlaylist(userId, name, songUrl);

    if (result.success) {
      await interaction.reply(`Song added to playlist '${name}' successfully.`);
    } else {
      await interaction.reply(
        "Failed to add the song to the playlist. Please check the playlist name and try again."
      );
    }
  },
};
