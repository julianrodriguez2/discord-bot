const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../utilities/musicUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Removes a specific song from the queue.")
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("The position of the song in the queue to remove")
        .setRequired(true)
    ),
  async execute(interaction) {
    const index = interaction.options.getInteger("index");
    const serverQueue = queue.get(interaction.guild.id);

    if (!serverQueue) {
      await interaction.reply("There is no music currently playing.");
      return;
    }

    if (index < 1 || index >= serverQueue.songs.length) {
      await interaction.reply("Invalid song position.");
      return;
    }

    const [removed] = serverQueue.songs.splice(index, 1);
    await interaction.reply(`Removed: ${removed.title}`);
  },
};
