const { Command } = require('discord-utils');
const { nowPlaying } = require('../functions');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'nowplaying';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const embed = nowPlaying(context);
  if(!embed)
    return context.send('Nothing is playing.');

  context.chat(embed);
}