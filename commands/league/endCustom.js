const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  activeSessions,
  performMatchmaking,
} = require("../../utilities/customGameUtils");
const LeagueAccount = require("../../models/LeagueAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("endcustom")
    .setDescription("Ends a custom game")
    .addStringOption((option) =>
      option
        .setName("team")
        .setDescription("The winning team (teamA or teamB)")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("rematch")
        .setDescription("Do you want to rematch with the same players?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const winningTeam = interaction.options.getString("team");
    const rematch = interaction.options.getBoolean("rematch");

    if (!activeSessions.has(guildId)) {
      return interaction.reply("There is no active game session.");
    }
    const session = activeSessions.get(guildId);

    const winningPlayers =
      winningTeam === "teamA" ? session.teamA : session.teamB;

    if (!winningPlayers) {
      return interaction.reply("Invalid team specified.");
    }

    try {
      for (const player of winningPlayers) {
        await LeagueAccount.increment("customGamesWon", {
          where: { userId: player.userId },
        });
      }

      activeSessions.delete(guildId);

      if (rematch) {
        performMatchmaking(session);
        await interaction.reply(
          `Team ${winningTeam} wins! Rematch initiated. New teams are being formed.`
        );
      } else {
        activeSessions.delete(guildId);
        await interaction.reply(
          `Custom game ended. Team ${winningTeam} wins! Session closed.`
        );
      }
    } catch (error) {
      console.error("Error ending custom game:", error);
      return interaction.reply(
        "An error occurred while trying to end the custom game. Please try again later."
      );
    }
  },
};
