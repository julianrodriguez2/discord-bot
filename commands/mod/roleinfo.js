const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roleinfo")
    .setDescription("Displays information about a role.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to get info about")
        .setRequired(true)
    ),
  async execute(interaction) {
    const role = interaction.options.getRole("role");
    await interaction.reply(
      `Role name: ${role.name}\nRole ID: ${role.id}\nMember count: ${role.members.size}`
    );
  },
};
