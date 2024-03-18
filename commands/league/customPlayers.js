const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { activeSessions } = require("../../utilities/customGameUtils");
const LeagueAccount = require("../../models/LeagueAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("customplayers")
    .setDescription("Shows who is currently signed up for the custom game"),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const session = activeSessions.get(guildId);

    if (!session || session.players.length === 0) {
      return interaction.reply(
        "There are no players registered for a custom game currently."
      );
    }
    const playerInfos = await Promise.all(
      session.players.map(async (player) => {
        try {
          const leagueAccount = await LeagueAccount.findOne({
            where: { userId: player.userId },
          });
          if (!leagueAccount) return "Unknown User";

          const user = await interaction.client.users.fetch(player.userId);
          const username = user.username;
          return `${username} - ${leagueAccount.tier} ${leagueAccount.rank} (${leagueAccount.lp} LP)`;
        } catch (error) {
          console.error("Error fetching player info:", error);
          return "Unknown User";
        }
      })
    );

    // Constructing the embed message
    const embed = new EmbedBuilder()
      .setTitle("Registered Players for Custom Game")
      .setDescription(playerInfos.join("\n") || "No players registered.")
      .addFields({
        name: "Total Registered",
        value: `${session.players.length}`,
        inline: true,
      })
      .setColor("#0099ff")
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
