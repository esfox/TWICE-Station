const { Command } = require('discord-utils');
const { getMentionAndAmount } = require('utils/functions');
const { User } = require('database');

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
  const giver = context.message.member;
  const giverID = giver.id;
  let giverCoins = await User.getCoins(giverID);
  if(giverCoins <= 0)
    return context.send("❌ You don't have enough coins.");

  let { member: receiver, amount } = getMentionAndAmount(context);
  const receiverID = receiver.id;
  amount = Math.abs(amount);

  let receiverCoins = await User.getCoins(receiverID);
  giverCoins -= amount;
  receiverCoins += amount;

  giverCoins = await User.setCoins(giverID, giverCoins);
  receiverCoins = await User.setCoins(receiverID, receiverCoins);

  context.send(`✅  ${receiver.displayName} has received`
    + ` ${amount} TWICECOINS.`, `from ${receiver.displayName}`);
}