const { SlashCommandBuilder } = require("discord.js");
const { getPlaylistSongs } = require("../../utilities/playlistUtils");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlistplay")
    .setDescription("Plays the songs from a specified playlist.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the playlist to play.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString("name");
    const userId = interaction.user.id;

    // Placeholder for retrieving songs from the playlist in your database
    const songs = await getPlaylistSongs(userId, name);

    if (!songs.length) {
      await interaction.reply(`Playlist '${name}' is empty or does not exist.`);
      return;
    }

    // Assuming you have a function to handle queueing songs
    // songs.forEach((song) => {
    //   queueSong(interaction, song);
    //   // You'll need to adjust this based on your actual implementation
    // });

    await interaction.reply(`Playing playlist '${name}'.`);
  },
};
