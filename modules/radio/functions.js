const player = require('./player');
const queue = require('./queue');
const { radio_channel } = require('config/config');
const { randomElement } = require('utils/functions');
const { albums, other } = require('data/music.json');
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

// const testTracks =
// [
//   {
//     title: "What Is Love",
//     link: "C:\\Users\\Acer\\Music\\Music\\K-Pop\\What Is Love.mp3",
//     lyrics: "https://colorcodedlyrics.com/2018/04/twice-what-is-love",
//   },
//   {
//     title: "What Is Love",
//     link: "C:\\Users\\Acer\\Music\\Music\\K-Pop\\Airplane.mp3",
//     info: "IZ*One's song"
//   },
//   {
//     title: "달라달라",
//     link: "C:\\Users\\Acer\\Music\\Music\\K-Pop\\달라달라.mp3",
//   },
// ];

const randomTrack = () => randomElement(tracks);

/** @param {import('discord-utils').Context} context*/
const nowPlaying = context =>
{
  const track = queue.nowPlaying;
  if(!track)
    return;

  const embed = context.embed('🎶  Now Playing...')
    .addField(track.title, track.album || track.info
      + `${track.lyrics? `\n\n[__See lyrics__](${track.lyrics})` : ''}`)
    .setThumbnail(track.thumbnail);

  if(track.color)
    embed.setColor(track.color);

  return embed;
}

/** @param {import('discord-utils').Context} context*/
const play = (context, track) =>
{
  if(!track)
    track = randomTrack();

  player.play(track.link,
    () =>
    {
      queue.setNowPlaying(track);
      context.chat(nowPlaying(context));
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
module.exports.nowPlaying = nowPlaying;

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
