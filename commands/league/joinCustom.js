const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  activeSessions,
  performMatchmaking,
} = require("../../utilities/customGameUtils");
const RiotAccount = require("../../models/RiotAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joincustom")
    .setDescription("Join a custom game")
    .addStringOption((option) =>
      option
        .setName("role1")
        .setDescription("Your Primary Role")
        .setRequired(true)
        .addChoices(
          { name: "Top", value: "top" },
          { name: "Jungle", value: "jungle" },
          { name: "Mid", value: "mid" },
          { name: "Bot", value: "bot" },
          { name: "Support", value: "support" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("role2")
        .setDescription("Your Secondary Role")
        .setRequired(true)
        .addChoices(
          { name: "Top", value: "top" },
          { name: "Jungle", value: "jungle" },
          { name: "Mid", value: "mid" },
          { name: "Bot", value: "bot" },
          { name: "Support", value: "support" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("role3")
        .setDescription("Optional: Your Third Role")
        .setRequired(false)
        .addChoices(
          { name: "Top", value: "top" },
          { name: "Jungle", value: "jungle" },
          { name: "Mid", value: "mid" },
          { name: "Bot", value: "bot" },
          { name: "Support", value: "support" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("role4")
        .setDescription("Optional: Your Fourth Role")
        .setRequired(false)
        .addChoices(
          { name: "Top", value: "top" },
          { name: "Jungle", value: "jungle" },
          { name: "Mid", value: "mid" },
          { name: "Bot", value: "bot" },
          { name: "Support", value: "support" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("role5")
        .setDescription("Optional: Your Fifth Role")
        .setRequired(false)
        .addChoices(
          { name: "Top", value: "top" },
          { name: "Jungle", value: "jungle" },
          { name: "Mid", value: "mid" },
          { name: "Bot", value: "bot" },
          { name: "Support", value: "support" }
        )
    ),
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

      if (session.players.find((player) => player.userId === discordUserId)) {
        return interaction.reply("You are already registered for the game.");
      }

      const rolePreferences = [
        interaction.options.getString("role1"),
        interaction.options.getString("role2"),
        interaction.options.getString("role3"),
        interaction.options.getString("role4"),
        interaction.options.getString("role5"),
      ].filter(Boolean);

      session.players.push({
        userId: discordUserId,
        summonerId: riotAccount.summonerId,
        rolePreferences,
      });
      await interaction.reply(
        "You have been successfully registered for the custom game."
      );

      if (session.players.length === 10) {
        performMatchmaking(session, interaction);
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
