const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../utilities/musicUtils");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffles the current music queue."),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);

    if (!serverQueue || serverQueue.songs.length <= 1) {
      await interaction.reply(
        "There are not enough songs in the queue to shuffle."
      );
      return;
    }

    for (let i = serverQueue.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [serverQueue.songs[i], serverQueue.songs[j]] = [
        serverQueue.songs[j],
        serverQueue.songs[i],
      ];
    }

    await interaction.reply("The queue has been shuffled.");
  },
};
