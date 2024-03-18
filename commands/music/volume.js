const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../utilities/musicUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Adjusts the playback volume.")
    .addNumberOption((option) =>
      option
        .setName("level")
        .setDescription("Volume level (1-100)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const volumeLevel = interaction.options.getNumber("level");
    const serverQueue = queue.get(interaction.guild.id);

    if (!serverQueue) {
      await interaction.reply("There is no music currently playing.");
      return;
    }

    console.log(`Adjusting volume to: ${volumeLevel}%`);

    await interaction.reply(`Volume has been adjusted to ${volumeLevel}%.`);
  },
};
