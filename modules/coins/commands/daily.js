const { Command } = require('discord-utils');
const { getTimeLeft } = require('utils/functions');
const { daily: duration } = require('config/config').cooldowns;
const { User } = require('database');
const cooldowns = require('utils/cooldown');

const command = 'daily';
cooldowns.add(command, duration, true);

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = command;
    this.aliases.push('d');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const cooldown = await cooldowns.check(command, context.message.author.id);
  if(cooldown)
    return context.send('⌛  You already got your daily TWICECOINS',
      `Please wait **${getTimeLeft(cooldown)}**.`);

  const rng = Math.floor((Math.random() * 100) + 1);
  const [ min, max ] = 
    rng <= 5? [ 601, 700 ] : 
    rng <= 20? [ 401, 600 ] : [ 200, 400 ];
    
  const daily = Math.floor(Math.random() * (max - min)) + min;
  await User.addCoins(context.message.author.id, daily);
  context.send(`💰  You received ${daily} TWICECOINS`);
}
