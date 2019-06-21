const { Command } = require('discord-utils');
const { getMentionAndAmount } = require('utils/functions');
const { User } = require('models');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'addcoins';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const { member, amount } = getMentionAndAmount(context);
  await User.addCoins(member.id, amount);
  context.send(`💵  ${member.displayName} has received ${amount} TWICECOINS.`);
}