const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const {
  // getCurrentGameBySummonerId,
  getSummonerPUUID,
  getSummonerIdByPUUID,
  getCurrentGameBySummonerId,
  getRankedSummonerLeagueInfo,
} = require("../../utilities/riotApi");

const {
  getChampionNameById,
  getChampionImage,
} = require("../../utilities/championMapper");
const RiotAccount = require("../../models/RiotAccount");

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
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("tagline")
        .setDescription("The tagline of the registered account (e.g., NA, EUW)")
        .setRequired(false)
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
      puuid = userAccount.puuid;
    }

    if (!puuid) {
      return interaction.reply(
        "The specified account could not be found or has not been registered."
      );
    }

    try {
      const summonerID = await getSummonerIdByPUUID(puuid);
      const currentGame = await getCurrentGameBySummonerId(summonerID);
      const leagueInfo = await getRankedSummonerLeagueInfo(summonerID);
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
