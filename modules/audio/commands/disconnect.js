const { Command } = require('discord-utils');
const player = require('../player');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'disconnect';
    this.aliases.push('stop');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  player.disconnect();
  context.send('⏹  Disconnected from voice channel');
}