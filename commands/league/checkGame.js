// In your commands directory, e.g., commands/getMastery.js
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const {
  // getCurrentGameBySummonerId,
  getSummonerPUUID,
  getSummonerIdByPUUID,
  getCurrentGameBySummonerId,
  getSummonerLeagueInfo,
} = require("../../utilities/riotApi");

const {
  getChampionNameById,
  getChampionImage,
} = require("../../utilities/championMapper");

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

    try {
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
      const currentGame = await getCurrentGameBySummonerId(summonerID);
      const leagueInfo = await getSummonerLeagueInfo(summonerID);
      if (!currentGame) {
        return interaction.reply(
          "No current game found for the specified Riot account."
        );
      }

      const participant = currentGame.participants.find(
        (p) => p.summonerName === gameName
      );
      if (!participant) {
        return interaction.reply("Player not found in the current game.");
      }

      const championName = getChampionNameById(participant.championId);
      const championImage = getChampionImage(participant.championId);
      const gameMode = currentGame.gameMode;
      const currentLP = leagueInfo ? leagueInfo.lp : "N/A";

      const embed = new EmbedBuilder()
        .setTitle(`${gameName}'s Current Game`)
        .addFields(
          { name: "Username", value: gameName, inline: true },
          { name: "Champion", value: championName, inline: true },
          { name: "Game Mode", value: gameMode, inline: true },
          { name: "Current LP", value: currentLP.toString(), inline: true }
        )
        .setImage(championImage)
        .setColor("#0099ff")
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching current game:", error);
      return interaction.reply(
        "There was an error trying to fetch current game for the specified Riot account. Please try again later."
      );
    }
  },
};
