// In your commands directory, e.g., commands/register.js
const { SlashCommandBuilder } = require("@discordjs/builders");
const RiotAccount = require("../../models/RiotAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("registerpuuid")
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
    const serverId = interaction.guild.id;

    try {
      // Check if the user is already registered
      const [created] = await RiotAccount.findOrCreate({
        where: { gameName: gameName, tagline: tagline, serverId: serverId },
        defaults: { gameName: gameName, tagline: tagline, serverId: serverId },
      });
      if (!created) {
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
