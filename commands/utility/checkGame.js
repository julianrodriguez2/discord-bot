// In your commands directory, e.g., commands/getMastery.js
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  // getCurrentGameBySummonerId,
  getSummonerPUUID,
  getSummonerIdByPUUID,
} = require("../../utilities/riotApi");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("checkgame")
    .setDescription("Retrieves if an account is currently in a game")
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

    // try {
    // Attempt to retrieve the PUUID for the specified Riot account
    const puuid = await getSummonerPUUID(gameName, tagline);
    if (!puuid) {
      return interaction.reply(
        "The specified Riot account has not been registered or could not be found."
      );
    }

    // Fetch champion mastery data using the PUUID
    const summonerID = await getSummonerIdByPUUID(puuid);
    console.log(summonerID);
    /* const ingame = await getCurrentGameBySummonerId(summonerID);
      if (!masteryData || masteryData.length === 0) {
        return interaction.reply(
          "No champion mastery data found for the specified Riot account."
        );
      }

      return interaction.reply(
        `Top champion mastery for ${gameName} (${tagline}): ${championName} with ${topChampionMastery.championPoints} points.`
      );
    } catch (error) {
      console.error("Error fetching champion mastery:", error);
      return interaction.reply(
        "There was an error trying to fetch champion mastery for the specified Riot account. Please try again later."
      );
    } */
  },
};
