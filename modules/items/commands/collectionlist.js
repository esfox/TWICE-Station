const { Command } = require('discord-utils');
const collections = require('data/collections');
const collectionlist = collections.reduce((text, collection) =>
  !collection.description? text :
    text + `**${collection.name.replace('Nayeon', 'Member')}`
      + ` Collection - ${collection.bonus}**`
      + '\n' + collection.description + '\n\n', '');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'collectionlist';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  context.send('🛍  Collections', collectionlist);
}