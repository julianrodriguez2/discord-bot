// nowplaying.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { queue } = require("../../utilities/musicUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Displays the currently playing song."),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);

    if (!serverQueue || serverQueue.songs.length === 0) {
      await interaction.reply("There is no song currently playing.");
      return;
    }

    const song = serverQueue.songs[0];
    const embed = new EmbedBuilder()
      .setTitle("Now Playing")
      .setDescription(`[${song.title}](${song.url})`)
      .setColor(0x0099ff);

    await interaction.reply({ embeds: [embed] });
  },
};
