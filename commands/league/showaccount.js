// In your commands directory, e.g., commands/showAccount.js
const { SlashCommandBuilder } = require("@discordjs/builders");
const RiotAccount = require("../../models/RiotAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("showaccount")
    .setDescription(
      "Shows the League of Legends account registered with your Discord account."
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;

    try {
      // Attempt to retrieve the Riot account associated with this Discord user in the server
      const riotAccount = await RiotAccount.findOne({
        where: { serverId: serverId, userId: userId },
      });

      if (!riotAccount) {
        return interaction.reply(
          "No League of Legends account has been registered with your Discord account in this server."
        );
      }

      // If an account is found, reply with the details
      return interaction.reply(
        `League of Legends account registered: **${riotAccount.gameName}**#${riotAccount.tagline}`
      );
    } catch (error) {
      console.error("Error fetching registered account:", error);
      return interaction.reply(
        "There was an error trying to fetch the registered account. Please try again later."
      );
    }
  },
};
