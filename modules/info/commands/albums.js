const { Command } = require('discord-utils');
const PagedEmbed = require('../../../utils/paged-embed');
const music = require('../../../data/music.json');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'albums';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
function action(context)
{
  /** @type {Array} */
  const albums = Object.values(music.albums);
  const { korean, japanese } = albums.reduce((albums, album) => 
  {
    albums[!album.isJapanese? 'korean' : 'japanese'].push(album);
    return albums;
  },
  {
    korean: [],
    japanese: []
  });

  const pages = 
  [
    `**Korean**\n\n${list(korean)}`,
    `**Japanese**\n\n${list(japanese)}`
  ];

  new PagedEmbed().send(context, '💿  TWICE Albums', pages,
    { thumbnail: 'https://i.imgur.com/hhfIJUF.gif' });
}

const list = albums => albums
  .map((album, i) => `${i + 1}. ${album.title}`)
  .join('\n');