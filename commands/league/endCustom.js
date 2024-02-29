const { SlashCommandBuilder } = require("@discordjs/builders");
const { activeSessions } = require("../../utilities/customGameUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("endcustom")
    .setDescription("Ends a custom game"),
  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (!activeSessions.has(guildId)) {
      return interaction.reply("There is no active game session.");
    }
    activeSessions.delete(guildId);

    interaction.reply("Custom game session has ended!");
  },
};
