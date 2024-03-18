// playlist-create.js
const { SlashCommandBuilder } = require("discord.js");
const { savePlaylist } = require("../../utilities/playlistUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlistcreate")
    .setDescription("Creates a new playlist.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the playlist.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString("name");
    const userId = interaction.user.id;

    const result = await savePlaylist(userId, name);

    if (result.success) {
      await interaction.reply(`Playlist '${name}' created successfully.`);
    } else {
      await interaction.reply(
        "Failed to create the playlist. It might already exist."
      );
    }
  },
};
