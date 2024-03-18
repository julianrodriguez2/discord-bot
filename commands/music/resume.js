const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../utilities/musicUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the paused music."),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);

    if (!serverQueue) {
      await interaction.reply("There is no music currently playing.");
      return;
    }

    if (serverQueue.player.state.status !== "paused") {
      await interaction.reply("The music is not paused.");
      return;
    }

    serverQueue.player.unpause();
    await interaction.reply("Music playback has been resumed.");
  },
};
