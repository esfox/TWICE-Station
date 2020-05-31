const { Command } = require('discord-utils');
const cbreset = require('../../candybongs/cbreset');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'cbreset';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  cbreset.do(context.bot);
}
