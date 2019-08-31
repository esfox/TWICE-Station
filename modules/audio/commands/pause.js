const { Command } = require('discord-utils');
const player = require('../player');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'pause';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  player.pause();
  context.send('⏸  Paused');
}