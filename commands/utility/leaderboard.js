const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Displays the currency leaderboard."),
  async execute(interaction) {
    const topUsers = await User.findAll({
      order: [["balance", "DESC"]],
      limit: 10,
    });

    const leaderboardEmbed = new EmbedBuilder()
      .setTitle("Currency Leaderboard")
      .setDescription("Top 10 users by balance")
      .setColor("#0099ff");

    const guild = interaction.guild;

    for (const user of topUsers) {
      try {
        const member = await guild.members.fetch(user.userId);
        const displayName = member.nickname
          ? member.nickname
          : member.user.username;

        leaderboardEmbed.addFields({
          name: `User: ${displayName}`,
          value: `Balance: ${user.balance} coins`,
          inline: false,
        });
      } catch (error) {
        console.error(`Could not fetch member with ID: ${user.userId}`, error);
        leaderboardEmbed.addFields({
          name: `User ID: ${user.userId}`,
          value: `Balance: ${user.balance} coins (User not found)`,
          inline: false,
        });
      }
    }

    await interaction.reply({ embeds: [leaderboardEmbed] });
  },
};
