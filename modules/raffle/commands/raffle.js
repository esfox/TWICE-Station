const { Command } = require('discord-utils');
const raffle = require('../raffle');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'raffle';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  (await raffle(context)).join();
}
