const { SlashCommandBuilder } = require("discord.js");
const { skipSong } = require("../../utilities/musicUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song."),
  async execute(interaction) {
    skipSong(interaction);
  },
};
