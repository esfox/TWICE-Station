const { Command } = require('discord-utils');
const collections = require('data/collections');
const { User } = require('database');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'collections';
    this.aliases.push('cols');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  let userCollections = await User.getCollections(context.message.author.id);
  if(!userCollections)
    return context.send('❌  You have not completed any collection yet.');
  
  userCollections = userCollections
    .map(collectionCode =>
      collections.find(({ code }) => collectionCode === code).name)
    .reduce((text, collection) => text + `• ${collection}\n`, '');
    
  context.send('✅  Completed Collections', userCollections);
}
