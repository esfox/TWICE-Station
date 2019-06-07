const { Command } = require('discord-utils');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'ping';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
function action(context)
{
  context.send(`${~~(context.bot.ping )} ms`);
}