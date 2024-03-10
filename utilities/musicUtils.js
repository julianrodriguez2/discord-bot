const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
  AudioPlayerStatus,
  getVoiceConnection,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const queue = new Map();

// Function to play song in the voice channel
async function playSong(guildId, song) {
  const serverQueue = queue.get(guildId);

  if (!song) {
    const connection = getVoiceConnection(guildId);
    if (connection) connection.destroy();
    queue.delete(guildId);
    return;
  }

  const stream = ytdl(song.url, { filter: "audioonly" });
  const resource = createAudioResource(stream);
  serverQueue.player.play(resource);

  serverQueue.player.on(AudioPlayerStatus.Idle, () => {
    serverQueue.songs.shift();
    playSong(guildId, serverQueue.songs[0]);
  });

  await serverQueue.textChannel.send(`Now playing: **${song.title}**`);
}

// Function to add a song to the queue and play if it's the first song
async function queueSong(interaction, song) {
  const serverQueue = queue.get(interaction.guild.id);

  if (serverQueue) {
    serverQueue.songs.push(song);
    return interaction.reply(`${song.title} has been added to the queue!`);
  }

  const queueContructor = {
    voiceChannel: interaction.member.voice.channel,
    textChannel: interaction.channel,
    connection: null,
    songs: [song],
    player: createAudioPlayer(),
    playing: true,
  };

  queue.set(interaction.guild.id, queueContructor);

  try {
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    queueContructor.connection = connection;
    connection.subscribe(queueContructor.player);

    playSong(interaction.guild.id, queueContructor.songs[0]);
  } catch (err) {
    queue.delete(interaction.guild.id);
    console.error(err);
    return interaction.reply(
      "There was an error connecting to the voice channel."
    );
  }
}

// Function to skip the current song
function skipSong(interaction) {
  const serverQueue = queue.get(interaction.guild.id);
  if (!serverQueue)
    return interaction.reply("There are no songs in the queue.");
  serverQueue.player.stop();
  interaction.reply("Song skipped!");
}

module.exports = {
  queue,
  playSong,
  queueSong,
  skipSong,
};
