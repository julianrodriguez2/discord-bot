// In your commands directory, e.g., commands/unregister.js
const { SlashCommandBuilder } = require("@discordjs/builders");
const RiotAccount = require("../../models/RiotAccount");
const LeagueAccount = require("../../models/LeagueAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unregister")
    .setDescription(
      "Unregisters your League of Legends account from your Discord ID."
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;

    try {
      const riotAccount = await RiotAccount.findOne({
        where: { userId: userId, serverId: serverId },
      });
      if (!riotAccount) {
        return interaction.reply(
          "You do not have a registered League of Legends account."
        );
      }

      await RiotAccount.destroy({
        where: { userId: userId, serverId: serverId },
      });
      await LeagueAccount.destroy({ where: { userId: userId } });

      await interaction.reply(
        "Your League of Legends account has been successfully unregistered."
      );
    } catch (error) {
      console.error("Error unregistering League account:", error);
      return interaction.reply(
        "An error occurred while trying to unregister your account. Please try again later."
      );
    }
  },
};
