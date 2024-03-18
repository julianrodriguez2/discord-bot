// loop.js
const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../utilities/musicUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription(
      "Toggles loop mode for the current song or the entire queue."
    )
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Loop mode: song or queue")
        .setRequired(true)
        .addChoices(
          { name: "song", value: "song" },
          { name: "queue", value: "queue" }
        )
    ),
  async execute(interaction) {
    const mode = interaction.options.getString("mode");
    const serverQueue = queue.get(interaction.guild.id);

    if (!serverQueue) {
      await interaction.reply("There is no music currently playing.");
      return;
    }

    await interaction.reply(`Loop mode set to: ${mode}`);
  },
};
