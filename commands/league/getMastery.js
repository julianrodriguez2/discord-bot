// In your commands directory, e.g., commands/getMastery.js
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  getChampionMastery,
  getSummonerPUUID,
} = require("../../utilities/riotApi");
const { getChampionNameById } = require("../../utilities/championMapper");
const RiotAccount = require("../../models/RiotAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getmastery")
    .setDescription("Retrieves League of Legends champion mastery.")
    .addStringOption((option) =>
      option
        .setName("gamename")
        .setDescription("Optional: The game name of the account to query.")
    )
    .addStringOption((option) =>
      option
        .setName("tagline")
        .setDescription("Optional: The tagline of the account to query.")
    ),
  async execute(interaction) {
    const gameNameInput = interaction.options.getString("gamename");
    const taglineInput = interaction.options.getString("tagline");

    let gameName, tagline, puuid;

    if (gameNameInput && taglineInput) {
      gameName = gameNameInput;
      tagline = taglineInput;
      puuid = await getSummonerPUUID(gameName, tagline);
    } else {
      const userAccount = await RiotAccount.findOne({
        where: { userId: interaction.user.id },
      });
      if (!userAccount) {
        return interaction.reply(
          "You do not have a registered account, and no account was specified."
        );
      }
      gameName = userAccount.gameName;
      tagline = userAccount.tagline;
      puuid = await getSummonerPUUID(gameName, tagline);
    }

    if (!puuid) {
      return interaction.reply(
        "The specified account could not be found or has not been registered."
      );
    }

    try {
      const masteryData = await getChampionMastery(puuid);
      if (!masteryData || masteryData.length === 0) {
        return interaction.reply("No champion mastery data found.");
      }

      const topChampionMastery = masteryData[0];
      const championName = getChampionNameById(topChampionMastery.championId);

      return interaction.reply(
        `Top champion mastery for ${gameName} (${tagline}): ${championName} with ${topChampionMastery.championPoints} points.`
      );
    } catch (error) {
      console.error("Error fetching champion mastery:", error);
      return interaction.reply(
        "There was an error trying to fetch champion mastery. Please try again later."
      );
    }
  },
};
