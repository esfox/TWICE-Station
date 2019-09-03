const { Command } = require('discord-utils');
const player = require('../player');
const { play, notJoined } = require('../functions');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'connect';
    this.aliases.push('start');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  if(notJoined(context))
    return;

  const message = await context.send('📶  Connecting to voice channel...');
  const connected = await player.connect();
  if(!connected)
    return message.send('❌  Unable to connect to voice channel.');

  await message.edit(context.embed('✅  Connected.'));
  play(context.bot);
}