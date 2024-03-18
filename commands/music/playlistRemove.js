const { SlashCommandBuilder } = require("discord.js");
const { removeSongFromPlaylist } = require("../../utilities/playlistUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlist-remove")
    .setDescription("Removes a song from a specified playlist.")
    .addStringOption((option) =>
      option
        .setName("playlist")
        .setDescription("The name of the playlist.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The name or URL of the song to remove.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString("playlist");
    const songName = interaction.options.getString("song");
    const userId = interaction.user.id;

    // Placeholder for removing a song from the playlist in your database
    const result = await removeSongFromPlaylist(userId, playlistName, songName);

    if (result.success) {
      await interaction.reply(
        `Song removed from playlist '${playlistName}' successfully.`
      );
    } else {
      await interaction.reply(
        `Failed to remove the song from the playlist. Please check the playlist and song name.`
      );
    }
  },
};
