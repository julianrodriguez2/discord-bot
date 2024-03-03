const { SlashCommandBuilder } = require("@discordjs/builders");
const { activeSessions } = require("../../utilities/customGameUtils");
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
    ),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const winningTeam = interaction.options.getString("team");

    if (!activeSessions.has(guildId)) {
      return interaction.reply("There is no active game session.");
    }
    const session = activeSessions.get(guildId);

    const winningPlayers = session.teams[winningTeam];

    if (!winningPlayers) {
      return interaction.reply("Invalid team specified.");
    }

    try {
      // Update the customGamesWon field for each winning player
      for (const { summonerId } of winningPlayers) {
        await LeagueAccount.increment("customGamesWon", {
          where: { summonerId, serverId: guildId },
        });
      }

      // Optionally, reset the session or perform other cleanup
      activeSessions.delete(guildId);

      interaction.reply(`Custom game ended. Team ${winningTeam} wins!`);
    } catch (error) {
      console.error("Error ending custom game:", error);
      return interaction.reply(
        "An error occurred while trying to end the custom game. Please try again later."
      );
    }
  },
};
