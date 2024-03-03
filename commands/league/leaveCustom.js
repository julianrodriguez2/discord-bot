const { SlashCommandBuilder } = require("@discordjs/builders");
const { activeSessions } = require("../../utilities/customGameUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leavecustom")
    .setDescription("Leave the custom game you're registered for."),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const discordUserId = interaction.user.id;

    const session = activeSessions.get(guildId);

    if (!session) {
      return interaction.reply(
        "There is no active custom game session to leave."
      );
    }

    const isRegistered = session.players.some(
      (player) => player.userId === discordUserId
    );

    if (!isRegistered) {
      return interaction.reply("You are not registered for any custom game.");
    }

    session.players = session.players.filter(
      (player) => player.userId !== discordUserId
    );

    await interaction.reply("You have successfully left the custom game.");

    if (session.players.length < 10) {
      console.log("Custom game has fewer than 10 players after a user left.");
    }
  },
};
