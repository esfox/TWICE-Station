const player = require('./player');
const queue = require('./queue');
const { radio_channel } = require('config/config');
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

/** @param {import('discord-utils').Context} context*/
const songEmbed = (context, track, title) =>
{
  track = track || queue.nowPlaying;
  if(!track)
    return;

  const embed = context.embed(title || '🎶  Now Playing...')
    .addField(track.title, (track.album || track.info)
      + `${track.lyrics? `\n\n[__See lyrics__](${track.lyrics})` : ''}`)
    .setThumbnail(track.thumbnail);

  if(track.color)
    embed.setColor(track.color);

  return embed;
}

module.exports.nowPlaying = songEmbed;

/** @param {import('discord-utils').Context} context*/
const play = (context, track) =>
{
  if(!track)
    track = randomTrack();

  player.play(track.link,
    () =>
    {
      queue.setNowPlaying(track);
      context.chat(songEmbed(context));
    },
    () =>
    {
      const next = queue.next();
      if(next)
        return play(context, next);

      play(context, randomTrack());
    },
    error => context.send('❌  An error occured', error.message));
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
