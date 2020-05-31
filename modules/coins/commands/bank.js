const { Command } = require('discord-utils');
const { loadData } = require('data/saved');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'bank';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const { bank } = await loadData();
  context.send('🏦  Community Bank', `**${bank}** TWICECOINS`);
}