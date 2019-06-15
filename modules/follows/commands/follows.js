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

/** @param {import('discord-utils').Context} context*/
function action(context)
{
  context.send('show follows');
}