const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { queue } = require("../../utilities/musicUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current music queue."),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue || serverQueue.songs.length === 0) {
      await interaction.reply("There are no songs currently in the queue.");
      return;
    }

    const generateEmbed = (start) => {
      const current = serverQueue.songs.slice(start, start + 10);

      const embed = new EmbedBuilder()
        .setTitle("Music Queue")
        .setDescription(
          current
            .map((song, index) => `${start + index + 1}. ${song.title}`)
            .join("\n")
        )
        .setColor(0x0099ff)
        .setFooter({
          text: `Page ${start / 10 + 1} of ${Math.ceil(
            serverQueue.songs.length / 10
          )}`,
        });

      return embed;
    };

    const embedMessage = await interaction.reply({
      embeds: [generateEmbed(0)],
      fetchReply: true,
    });

    if (serverQueue.songs.length > 10) {
      await embedMessage.react("⬅️");
      await embedMessage.react("➡️");
    }
  },
};
