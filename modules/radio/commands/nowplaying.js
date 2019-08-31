const { Command } = require('discord-utils');
const { songEmbed } = require('../functions');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'nowplaying';
    this.keyword = 'np';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const embed = songEmbed(context);
  if(!embed)
    return context.send('Nothing is playing.');

  context.chat(embed);
}