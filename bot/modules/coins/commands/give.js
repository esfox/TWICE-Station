const { Command } = require('discord-utils');
const { getMentionAndAmount } = require('utils/functions');
const { Coins } = require('api/models');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'give';
    this.aliases.push('pay');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  let { member: receiver, amount } = getMentionAndAmount(context);
  if(!receiver || !amount)
    return;

  const giver = context.message.member;
  const giverID = giver.id;
  const receiverID = receiver.id;

  if(receiverID === giverID)
    return context.send("❌  You can't give to yourself. 🤔");

  const giveResult = await Coins.transfer(giverID, receiverID, amount);
  if(giveResult === undefined)
    return context.send("Whoops. Can't transfer your coins. Please try again.");
    
  if(giveResult === 0)
    return context.send("❌ You don't have enough coins.");

  context.send(`✅  ${receiver.displayName} has received`
    + ` ${amount} TWICECOINS.`, `from ${giver.displayName}`);
}
