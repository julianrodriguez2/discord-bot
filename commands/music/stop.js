const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../utilities/musicUtils");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the music and clears the queue."),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);

    if (!serverQueue) {
      await interaction.reply("There is no music currently playing.");
      return;
    }

    serverQueue.songs = [];
    serverQueue.player.stop();
    getVoiceConnection(interaction.guild.id)?.destroy();

    queue.delete(interaction.guild.id);
    await interaction.reply(
      "Music playback has been stopped and the queue has been cleared."
    );
  },
};
