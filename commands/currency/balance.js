const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../../models/User.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Displays your current balance."),
  async execute(interaction) {
    const [user] = await User.findOrCreate({
      where: { userId: interaction.user.id },
      defaults: { balance: 0 },
    });
    await interaction.reply(
      `${interaction.user.username}, you have ${user.balance} coins.`
    );
  },
};
