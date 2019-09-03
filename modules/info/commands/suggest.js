const { Command } = require('discord-utils');
const { suggest } = require('../notice');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'suggest';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  suggest(context);
}
