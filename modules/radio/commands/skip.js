const { Command } = require('discord-utils');
const player = require('../player');
const { notJoined } = require('../functions');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'skip';
    this.aliases.push('next');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  if(notJoined(context))
    return;

  player.skip();
  context.send('⏭  Skipped');
}
