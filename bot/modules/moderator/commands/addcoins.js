const { Command } = require('discord-utils');
const { getMentionAndAmount } = require('utils/functions');
const { Coins } = require('api/models');

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
  if(!member || !amount)
    return;
    
  const addResult = await Coins.addToUser(member.id, amount);
  if(addResult === undefined)
    return context.send("Whoops. Can't add coins. Please try again.");

  context.send(`💵  ${member.displayName} has received ${amount} TWICECOINS.`);
}
