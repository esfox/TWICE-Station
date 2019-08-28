const { Command } = require('discord-utils');
const { User } = require('database');
const { loadData, save } = require('data/saved');

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
  const userCoins = await User.getCoins(user);
  if(!userCoins || userCoins < amount)
    return context.reply("❌  You don't have enough coins.");

  await User.setCoins(user, userCoins - amount);

  const data = await loadData();
  data.bank += amount;
  await save(data);

  context.send(`💳 Deposited ${amount} TWICECOINS to the Community Bank.`,
    `Bank Balance: __**${data.bank}**__ TWICECOINS`);
}