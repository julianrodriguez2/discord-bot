// vote-skip.js
const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../utilities/musicUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voteskip")
    .setDescription("Starts a vote to skip the current song."),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);

    if (!serverQueue) {
      await interaction.reply("There is no song currently playing.");
      return;
    }

    // Initialize or increment a skip vote count
    serverQueue.skipVotes = (serverQueue.skipVotes || 0) + 1;

    const voiceChannelMembers =
      interaction.member.voice.channel.members.size - 1;
    const requiredVotes = Math.ceil(voiceChannelMembers / 2);

    if (serverQueue.skipVotes >= requiredVotes) {
      // Skip the song if enough votes are collected
      serverQueue.player.stop();
      queue.set(interaction.guild.id, serverQueue);
      await interaction.reply(
        "Vote to skip passed. Skipping to the next song..."
      );
    } else {
      await interaction.reply(
        `Vote to skip received. ${serverQueue.skipVotes}/${requiredVotes} required votes to skip.`
      );
    }
  },
};
