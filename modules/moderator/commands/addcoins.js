const { Command } = require('discord-utils');
const { getMention } = require('utils/functions');
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
  let parameters = context.parameters;
  const user = getMention(context, true); 
  if(!user || !parameters)
    return context.send('Add coins to who?');

  if(user.bot)
    return context.send("You can't add coins to bots.");

  if(parameters.length === 1)
    return context.send('How many coins to add?');
  parameters.splice(parameters.findIndex(word => word.includes(user.id)), 1);

  let amount = parameters.shift();
  if(isNaN(amount))
    return context.send("That's not a valid amount of coins.");
  amount = parseInt(amount);

  await User.addCoins(user.id, amount);
  context.send(`💵  ${user.displayName} has received ${amount} TWICECOINS.`);
}