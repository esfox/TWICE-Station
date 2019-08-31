const player = require('./player');
const queue = require('./queue');
const { randomElement } = require('utils/functions');

const { albums, other } = require('data/music.json');
const tracks = Object.values(albums)
  .reduce((songs, { title, tracks }) => songs.concat(tracks
    .map(track =>
    {
      track.album = title;
      return track;
    })), [])
  .filter(({ title, link }, i, array) =>
    link && array.findIndex(item => item.title === title) === i);

other.forEach(track => tracks.push(track));

// console.log(tracks);

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

// TODO: Show title of playing song
const randomTrack = () => randomElement(tracks).link;
const play = (context, track) =>
{
  player.play(track || randomTrack(),
    () => context.send('Playing'),
    () =>
    {
      const next = queue.next();
      if(next)
        return play(context, next);

      play(context, randomTrack());
    },
    error => context.send('❌  An error occured', error.message));
}

module.exports = play;
