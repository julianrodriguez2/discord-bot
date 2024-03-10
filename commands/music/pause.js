const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../utilities/musicUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song."),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);

    if (!serverQueue) {
      await interaction.reply("There is no music currently playing.");
      return;
    }

    if (serverQueue.player.state.status === "paused") {
      await interaction.reply("The music is already paused.");
      return;
    }

    serverQueue.player.pause();
    await interaction.reply("Music has been paused.");
  },
};
