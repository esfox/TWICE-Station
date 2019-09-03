const { RichEmbed } = require('discord.js');
const player = require('./player');
const queue = require('./queue');
const { bot_channel, radio_channel, embed_color } = require('config/config');
const { randomElement, compare } = require('utils/functions');
const { albums, other } = require('data/music.json');

/** @type {[]} */
const tracks = Object.values(albums)
  .reduce((songs, { tracks, title, cover, color }) => songs.concat(tracks
    .map(track =>
    {
      track.album = title;
      track.thumbnail = cover;
      track.color = color;
      return track;
    })), [])
  .filter(({ title, link }, i, array) =>
    link && array.findIndex(item => item.title === title) === i);

other.forEach(track => tracks.push(track));

const randomTrack = () => randomElement(tracks);

const songEmbed = (track, title) =>
{
  track = track || queue.nowPlaying;
  if(!track)
    return;

  const embed = new RichEmbed()
    .setColor(embed_color)
    .setTitle(title || '🎶  Now Playing...')
    .addField(track.title, (track.album || track.info)
      + `${track.lyrics? `\n\n[See lyrics](${track.lyrics})` : ''}`)
    .setThumbnail(track.thumbnail);

  if(track.color)
    embed.setColor(track.color);

  return embed;
}

module.exports.songEmbed = songEmbed;

/** @param {import('discord.js').Client} bot */
const play = (bot, track) =>
{
  if(!track)
    track = randomTrack();

  player.play(track.link,
    () =>
    {
      queue.setNowPlaying(track);
      bot.channels.get(bot_channel).send(songEmbed());
    },
    () =>
    {
      const next = queue.next();
      if(next)
        return play(bot, next);
      
      play(bot);
    }, console.error);
}

module.exports.play = play;

module.exports.findSong = query => 
  tracks.find(({ title }) => compare(title, query));

/** @param {import('discord-utils').Context} context*/
module.exports.notJoined = context =>
{
  const userVoiceChannel = context.message.member.voiceChannelID;
  const isNotJoined = !userVoiceChannel ||
    userVoiceChannel !== radio_channel;

  if(isNotJoined)
    context.send('❌  You must be in'
      + ` ${context.guild.channels.get(radio_channel).name} voice channel`
      + ' to use this command.');

  return isNotJoined;
}
