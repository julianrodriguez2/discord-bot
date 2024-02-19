/* eslint-disable no-unused-vars */
// In your commands directory, e.g., commands/register.js
const { SlashCommandBuilder } = require("@discordjs/builders");
const RiotAccount = require("../../models/RiotAccount");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Registers your League of Legends PUUID with the bot.")
    .addStringOption((option) =>
      option
        .setName("gamename")
        .setDescription("Your League of Legends game name")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("tagline")
        .setDescription("Your League of Legends tagline (e.g., NA, EUW)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const gameName = interaction.options.getString("gamename");
    const tagline = interaction.options.getString("tagline");
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;

    try {
      const [user] = await User.findOrCreate({
        where: { userId: userId },
      });

      const [riotAccount, riotAccountCreated] = await RiotAccount.findOrCreate({
        where: { userId: userId, serverId: serverId },
        defaults: {
          userId: userId,
          gameName: gameName,
          tagline: tagline,
          serverId: serverId,
        },
      });

      if (!riotAccountCreated) {
        return interaction.reply(
          "This Riot account is already registered for this server."
        );
      }

      return interaction.reply(
        `Successfully registered ${gameName} (${tagline}) for this server.`
      );
    } catch (error) {
      console.error("Error registering Riot account:", error);
      return interaction.reply(
        "There was an error trying to register the Riot account. Please try again later."
      );
    }
  },
};
