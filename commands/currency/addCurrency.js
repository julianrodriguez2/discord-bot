const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../../models/User.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addcurrency")
    .setDescription("Adds currency to your account for testing.")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of currency to add")
        .setRequired(true)
    ),
  async execute(interaction) {
    const amountToAdd = interaction.options.getNumber("amount");

    if (amountToAdd <= 0) {
      return interaction.reply("Please enter a positive number.");
    }

    const [user, created] = await User.findOrCreate({
      where: { userId: interaction.user.id },
      defaults: { balance: amountToAdd },
    });

    if (!created) {
      user.balance += amountToAdd;
      await user.save();
    }

    await interaction.reply(
      `Added ${amountToAdd} coins to your account. You now have ${user.balance} coins.`
    );
  },
};
