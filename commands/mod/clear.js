const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Deletes a specified number of messages from a channel.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The number of messages to delete")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    if (amount < 1 || amount > 100) {
      return interaction.reply("You need to input a number between 1 and 100.");
    }

    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply(`Deleted ${amount} messages.`);
  },
};
