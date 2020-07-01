const { Command } = require('discord-utils');
const { eras } = require('config/config');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'eras';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
function action(context)
{
  const eraList = eras.map(era => `• ${era}`);
  const embed = context.embed(
    'Currently available eras in the era game',
    eraList,
  ).setFooter('Some eras are to be added later on.');
  
  context.chat(embed);
}
