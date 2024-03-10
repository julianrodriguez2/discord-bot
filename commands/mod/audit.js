const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("audit")
    .setDescription("Shows audit log actions from the past 24 hours.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
    .setDMPermission(false),
  async execute(interaction) {
    const now = Date.now();
    const auditLogs = await interaction.guild.fetchAuditLogs({
      limit: 100,
    });

    // Filter the logs to the last 24 hours
    const recentEntries = auditLogs.entries.filter(
      (entry) => now - entry.createdTimestamp < 86400000
    );

    let replyMessage = "Audit Log Entries from the past 24 hours:\n";
    let counter = 0;
    recentEntries.forEach((entry) => {
      if (counter < 10) {
        const executor = entry.executor.username;
        const actionType = entry.action;
        const actionDate = entry.createdAt.toISOString();
        replyMessage += `${executor} performed ${actionType} on ${actionDate}\n`;
        counter++;
      }
    });

    if (counter === 0) {
      replyMessage = "No audit log entries found from the past 24 hours.";
    }

    if (replyMessage.length >= 2000) {
      replyMessage = replyMessage.substr(0, 1997) + "...";
    }

    await interaction.reply(replyMessage);
  },
};
