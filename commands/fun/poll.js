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
    // Statically define options
    .addStringOption((option) =>
      option.setName("option1").setDescription("Option 1 for the poll.")
    )
    .addStringOption((option) =>
      option.setName("option2").setDescription("Option 2 for the poll.")
    )
    .addStringOption((option) =>
      option.setName("option3").setDescription("Option 3 for the poll.")
    )
    .addStringOption((option) =>
      option.setName("option4").setDescription("Option 4 for the poll.")
    )
    .addStringOption((option) =>
      option.setName("option5").setDescription("Option 5 for the poll.")
    )
    .addStringOption((option) =>
      option.setName("option6").setDescription("Option 6 for the poll.")
    )
    .addStringOption((option) =>
      option.setName("option7").setDescription("Option 7 for the poll.")
    )
    .addStringOption((option) =>
      option.setName("option8").setDescription("Option 8 for the poll.")
    )
    .addStringOption((option) =>
      option.setName("option9").setDescription("Option 9 for the poll.")
    ),
  async execute(interaction) {
    const question = interaction.options.getString("question");
    let options = [];

    for (let i = 1; i <= 9; i++) {
      const option = interaction.options.getString(`option${i}`);
      if (option) options.push(option.trim());
    }

    if (options.length === 0) {
      options = ["Yes", "No"];
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
