// playlist-list.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getUserPlaylists } = require("../../utilities/playlistUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlistlist")
    .setDescription("Lists all your playlists."),
  async execute(interaction) {
    const userId = interaction.user.id;

    // Fetch user playlists from the database
    const playlists = await getUserPlaylists(userId);

    if (playlists.length === 0) {
      await interaction.reply("You have no playlists.");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Your Playlists")
      .setDescription(playlists.map((playlist) => playlist.name).join("\n"))
      .setColor(0x0099ff);

    await interaction.reply({ embeds: [embed] });
  },
};
