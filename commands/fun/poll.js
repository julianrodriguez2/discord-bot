const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Creates a poll with up to 9 options.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question for the poll.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("The options for the poll separated by commas.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString("question");
    const options = interaction.options
      .getString("options")
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt !== "");

    if (options.length > 9) {
      return interaction.reply("You can only add up to 9 options for a poll.");
    }

    const emojiList = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
    const pollEmbed = new EmbedBuilder()
      .setTitle(question)
      .setDescription(
        options.map((option, i) => `${emojiList[i]} ${option}`).join("\n")
      )
      .setColor(0x57f287);

    const message = await interaction.reply({
      embeds: [pollEmbed],
      fetchReply: true,
    });
    for (let i = 0; i < options.length; i++) {
      await message.react(emojiList[i]);
    }
  },
};
