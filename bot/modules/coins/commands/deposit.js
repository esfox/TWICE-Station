const { Command } = require('discord-utils');
const { loadData, save } = require('data/saved');
const { Coins } = require('api/models');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'deposit';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  let { parameters: amount } = context;
  if(!amount)
    return context.reply('How much to deposit?');
  amount = Math.abs(parseInt(amount));

  const user = context.message.author.id;
  const userCoins = await Coins.ofUser(user)
  if(userCoins === undefined)
    return context.send("Whoops. Can't get your coins. Please try again.");

  if(userCoins < amount)
    return context.reply("❌  You don't have enough coins.");

  const subtractResult = await Coins.subtractFromUser(user, amount);
  if(subtractResult === undefined)
    return context.send("Whoops. Some error happened. Please try again.");

  const data = await loadData();
  data.bank += amount;
  await save(data);

  context.send(`💳 Deposited ${amount} TWICECOINS to the Community Bank.`,
    `Bank Balance: __**${data.bank}**__ TWICECOINS`);
}