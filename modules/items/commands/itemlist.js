const { Command } = require('discord-utils');
const items = require('data/items');
const albumCount = Object.values(require('data/music.json').albums).length;
const itemlist = '__**List of All Items**__\n\n'
  + items.reverse().reduce((text, { value, items }) =>
    text + `**${value[0].toUpperCase() + value.substr(1)}**\n`
      + '```ml\n'
      + items.reduce((itemsText, item) => itemsText + `• ${item.name} `
        + (item.ofMember? '(x9, 1 per member)' :
          item.ofAlbum? `(x${albumCount} 1 per album)` : '')
      + '\n', '')
      + '\n```\n', '');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'itemlist';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  context.chat(itemlist);
}