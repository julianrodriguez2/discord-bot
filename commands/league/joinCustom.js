const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  activeSessions,
  performMatchmaking,
} = require("../../utilities/customGameUtils");
const RiotAccount = require("../../models/RiotAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joincustom")
    .setDescription("Join a custom game"),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const session = activeSessions.get(guildId);
    const discordUserId = interaction.user.id;

    try {
      const riotAccount = await RiotAccount.findOne({
        where: { userId: discordUserId, serverId: guildId },
      });

      if (!riotAccount) {
        return interaction.reply(
          "You must register a Riot account with your Discord account before joining a custom game."
        );
      }

      if (!session || session.status !== "waiting") {
        return interaction.reply(
          "There is no active game session waiting for players."
        );
      }

      if (session.players.includes(interaction.user.id)) {
        return interaction.reply("You are already registered for the game.");
      }
      session.players.push({
        userId: discordUserId,
        summonerId: riotAccount.summonerId,
      });
      await interaction.reply(
        "You have been successfully registered for the custom game."
      );

      if (session.players.length === 10) {
        performMatchmaking(session);
        await interaction.followUp(
          "Matchmaking complete. Teams have been formed."
        );
      }
    } catch (error) {
      console.error("Error registering for custom game:", error);
      return interaction.reply(
        "An error occurred while trying to register for the custom game. Please try again later."
      );
    }
  },
};
