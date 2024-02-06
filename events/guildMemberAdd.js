const { Events } = require("discord.js");
const { welcomeChannelId } = require("../config.json");

module.exports = {
  name: Events.GuildMemberAdd,
  execute(member) {
    const channel = member.client.channels.cache.get(welcomeChannelId);

    if (!channel) {
      console.log(`Channel not found: ${welcomeChannelId}`);
      return;
    }

    const welcomeMessage = `Welcome to the server, ${member}!`;

    channel.send(welcomeMessage).catch(console.error);
  },
};
