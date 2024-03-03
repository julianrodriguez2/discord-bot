/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const LeagueAccount = require("../../models/LeagueAccount");
const RiotAccount = require("../../models/RiotAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaguestats")
    .setDescription("Check a player's stats")
    .addStringOption((option) =>
      option
        .setName("summonername")
        .setDescription("The summoner name of the account you want to view.")
        .setRequired(false)
    ),
  async execute(interaction) {
    const userId = interaction.user.id;

    const riotAccount = await RiotAccount.findOne({
      where: { userId: userId },
    });

    if (!riotAccount) {
      return interaction.reply("You do not have a registered account.");
    }

    const leagueAccount = await LeagueAccount.findOne({
      where: { userId: userId },
    });

    if (!leagueAccount) {
      return interaction.reply(
        "League stats not found. Please register your League account."
      );
    }

    const statsEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`${riotAccount.gameName}'s League Stats`)
      .addFields(
        { name: "Tier", value: leagueAccount.tier, inline: true },
        { name: "Rank", value: leagueAccount.rank, inline: true },
        { name: "LP", value: leagueAccount.lp.toString(), inline: true },
        { name: "Wins", value: leagueAccount.wins.toString(), inline: true },
        {
          name: "Losses",
          value: leagueAccount.losses.toString(),
          inline: true,
        },
        {
          name: "Hot Streak",
          value: leagueAccount.hotStreak ? "Yes" : "No",
          inline: true,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [statsEmbed] });
  },
};
