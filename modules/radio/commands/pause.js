const { Command } = require('discord-utils');
const player = require('../player');
const { notJoined } = require('../functions');

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
  if(notJoined(context))
    return;
      
  player.pause();
  context.send('⏸  Paused');
}