// playlist-delete.js
const { SlashCommandBuilder } = require("discord.js");
const { deletePlaylist } = require("../../utilities/playlistUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlistdelete")
    .setDescription("Deletes a specific playlist.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the playlist to delete.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString("name");
    const userId = interaction.user.id;

    const result = await deletePlaylist(userId, name);

    if (result.success) {
      await interaction.reply(`Playlist '${name}' deleted successfully.`);
    } else {
      await interaction.reply(
        "Failed to delete the playlist. It might not exist."
      );
    }
  },
};
