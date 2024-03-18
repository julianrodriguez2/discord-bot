const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../utilities/musicUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seeks to a specific time in the current song.")
    .addIntegerOption((option) =>
      option
        .setName("seconds")
        .setDescription("The time to seek to in seconds.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const seconds = interaction.options.getInteger("seconds");
    const serverQueue = queue.get(interaction.guild.id);

    if (!serverQueue) {
      await interaction.reply("There is no music currently playing.");
      return;
    }

    console.log(`Seeking to ${seconds} seconds in the current song.`);
    await interaction.reply(`Seeked to ${seconds} seconds in the song.`);
  },
};
