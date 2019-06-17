const { Command } = require('discord-utils');
const { albums } = require('data/music.json');
const { search } = require('utils/functions');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'album';
    this.aliases.push('a');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
function action(context)
{
  const { parameters } = context;
  if(!parameters)
    return context.send('What album to show info of?');
  
  let [ ...album ] = parameters;
  album = album.join(' ').toLowerCase();

  album = search(Object.keys(albums), album);
  if(!album)
    return context.send('❌  Cannot find that album.');

  const { color, title, cover, tracks } = albums[album];
  const info = context.embed(title, tracks.map((track, i) =>
    `${i + 1}. ${track.title}`).join('\n'))
    .setColor(color)
    .setThumbnail(cover);

  context.chat(info);
}
