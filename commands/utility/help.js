const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays a list of all available commands."),
  async execute(interaction) {
    const { commands } = interaction.client;

    const helpEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Help - List of Commands")
      .setDescription("Here are all the commands you can use:")
      .setTimestamp();

    commands.forEach((cmd) => {
      helpEmbed.addFields(
        `/${cmd.data.name}`,
        cmd.data.description || "No description available"
      );
    });

    await interaction.reply({ embeds: [helpEmbed] });
  },
};
