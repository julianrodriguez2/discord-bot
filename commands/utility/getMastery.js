// In your commands directory, e.g., commands/getMastery.js
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  getChampionMastery,
  getSummonerPUUID,
} = require("../../utilities/riotApi");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getmastery")
    .setDescription(
      "Retrieves League of Legends champion mastery for a registered account."
    )
    .addStringOption((option) =>
      option
        .setName("gamename")
        .setDescription(
          "The League of Legends game name of the registered account"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("tagline")
        .setDescription("The tagline of the registered account (e.g., NA, EUW)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const gameName = interaction.options.getString("gamename");
    const tagline = interaction.options.getString("tagline");

    try {
      // Attempt to retrieve the PUUID for the specified Riot account
      const puuid = await getSummonerPUUID(gameName, tagline);
      if (!puuid) {
        return interaction.reply(
          "The specified Riot account has not been registered or could not be found."
        );
      }

      // Fetch champion mastery data using the PUUID
      const masteryData = await getChampionMastery(puuid);
      if (!masteryData || masteryData.length === 0) {
        return interaction.reply(
          "No champion mastery data found for the specified Riot account."
        );
      }

      // Example response, consider formatting and limiting the output
      const topChampionMastery = masteryData[0];
      return interaction.reply(
        `Top champion mastery for ${gameName} (${tagline}): Champion ID ${topChampionMastery.championId} with ${topChampionMastery.championPoints} points.`
      );
    } catch (error) {
      console.error("Error fetching champion mastery:", error);
      return interaction.reply(
        "There was an error trying to fetch champion mastery for the specified Riot account. Please try again later."
      );
    }
  },
};
