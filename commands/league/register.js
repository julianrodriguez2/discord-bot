/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require("@discordjs/builders");
const RiotAccount = require("../../models/RiotAccount");
const LeagueAccount = require("../../models/LeagueAccount");

const User = require("../../models/User");
const {
  getSummonerPUUID,
  getSummonerIdByPUUID,
  getRankedSummonerLeagueInfo,
} = require("../../utilities/riotApi");

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
        .setDescription(
          "Your League of Legends tagline (DONT INCLUDE THE HASHTAG) Ex. NA1"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const gameName = interaction.options.getString("gamename");
    const tagline = interaction.options.getString("tagline");
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;

    try {
      const puuid = await getSummonerPUUID(gameName, tagline);
      if (!puuid) {
        return interaction.reply(
          "The specified account could not be found. Please check the game name and tagline."
        );
      }

      const summonerId = await getSummonerIdByPUUID(puuid);

      const rankedInfo = (await getRankedSummonerLeagueInfo(summonerId)) || {
        tier: "Unranked",
        rank: null,
        lp: 0,
        wins: 0,
        losses: 0,
        winstreak: false,
      };

      const [user] = await User.findOrCreate({
        where: { userId: userId },
      });

      const [riotAccount, riotAccountCreated] = await RiotAccount.findOrCreate({
        where: { userId, serverId },
        defaults: {
          userId,
          serverId,
          gameName,
          tagline,
          puuid,
          summonerId,
          summonerName: gameName,
        },
      });

      if (!riotAccountCreated) {
        return interaction.reply(
          "This Riot account is already registered for this server."
        );
      }

      const [leagueAccount, leagueAccountCreated] =
        await LeagueAccount.findOrCreate({
          where: { userId: userId },
          defaults: {
            userId: userId,
            lp: rankedInfo.lp,
            wins: rankedInfo.wins,
            losses: rankedInfo.losses,
            rank: rankedInfo.rank,
            tier: rankedInfo.tier,
            hotStreak: rankedInfo.winstreak,
          },
        });

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
