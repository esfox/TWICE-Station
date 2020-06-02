const { Command } = require('discord-utils');
const { report } = require('../notice');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'report';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  report(context);
}
