const { SlashCommandBuilder } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song from YouTube.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The YouTube URL of the song to play")
        .setRequired(true)
    ),
  async execute(interaction) {
    const url = interaction.options.getString("url");

    if (!ytdl.validateURL(url)) {
      await interaction.reply("Please provide a valid YouTube URL.");
      return;
    }

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply(
        "You need to be in a voice channel to play music!"
      );
      return;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const stream = ytdl(url, { filter: "audioonly" });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => connection.destroy());

    await interaction.reply(`Now playing: ${url}`);
  },
};
