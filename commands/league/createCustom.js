// In your commands directory, e.g., commands/getMastery.js
const { SlashCommandBuilder } = require("@discordjs/builders");
const { activeSessions } = require("../../utilities/customGameUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createcustom")
    .setDescription("Creates a custom game"),
  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (activeSessions.has(guildId)) {
      return interaction.reply("There is already an active game session.");
    }

    const session = {
      players: [],
      status: "waiting",
      teamA: [],
      teamB: [],
      serverId: guildId,
    };

    activeSessions.set(guildId, session);

    interaction.reply(
      "Custom game session started. Players can now register for it using /joincustom."
    );
  },
};
