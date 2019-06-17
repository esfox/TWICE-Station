const { Command } = require('discord-utils');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'follows';
    this.action = action;
  }
}

/** @param {import('utils/TwiceStationContext')} context*/
async function action(context)
{
  /** @type {string[]} */
  const follows = await context.data.User.getFollows(context.message.author.id);
  if(!follows)
    return context.send('You have not followed any channels yet.');

  context.send('🔔  You are following...',
    follows.map(channel => `<#${channel}>`).join(' '));
}