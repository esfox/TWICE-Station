const { Command } = require('discord-utils');
const { Follows } = require('api/models');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'follows';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  /** @type {string[]} */
  const follows = await Follows.ofUser(context.message.author.id);
  if(follows === undefined)
    return context.send("Whoops. Can't get your followed channels. Please try again.");

  if(!follows)
    return context.send('You are not following any channels.');

  context.send('🔔  You are following...',
    follows.map(channel => `<#${channel}>`).join(' '));
}
