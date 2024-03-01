const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { getCurrentChampionRotation } = require("../../utilities/riotApi");
const { getChampionNameById } = require("../../utilities/championMapper");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("champrotation")
    .setDescription("See current champion rotation."),
  async execute(interaction) {
    const championIds = await getCurrentChampionRotation();
    if (!championIds) {
      await interaction.reply("Failed to fetch the current champion rotation.");
      return;
    }

    const championNames = await Promise.all(
      championIds.map(async (id) => {
        return getChampionNameById(id);
      })
    );

    const validChampionNames = championNames.filter((name) => name);

    if (validChampionNames.length === 0) {
      await interaction.reply("No champions found in the current rotation.");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Current Champion Rotation")
      .setDescription(validChampionNames.join(", "))
      .setColor(0x0099ff);

    await interaction.reply({ embeds: [embed] });
  },
};
