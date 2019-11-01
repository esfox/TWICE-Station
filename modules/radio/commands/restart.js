const { Command } = require('discord-utils');
const { sleep } = require('utils/functions');
const { play } = require('../functions');
const player = require('../player');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'restart';
    this.aliases.push('r');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  player.disconnect();
  await sleep(1);

  const connected = await player.connect();
  if(!connected)
    return message.send('❌  Unable to connect to voice channel.');

  context.send('✅  Reconnected.');
  play(context.bot);
}
