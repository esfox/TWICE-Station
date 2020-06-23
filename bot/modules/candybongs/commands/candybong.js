const command = 'candybong';

const { Command } = require('discord-utils');
const config = require('config/config');
const { Candybongs } = require('api/models');

const { getMention, getTimeLeft } = require('utils/functions');
const cooldowns = require('utils/cooldown');
const { candybong: cooldown  } = config.cooldowns;
const getCooldown = `${command}-get`;
const giveCooldown = `${command}-give`;
cooldowns.add(getCooldown, cooldown.get, true);
cooldowns.add(giveCooldown, cooldown.give, true);

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = command;
    this.aliases.push('cb');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  let author = context.message.member;
  const mention = getMention(context, true) || author;
  if(mention.user.bot)
    return context.send('Bots cannot have Candy Bongs.');
  author = author.id;

  const isSelf = mention.id === author;
  const cooldown = await cooldowns.check(isSelf? getCooldown : giveCooldown, 
    context.message.author.id);
  if(cooldown)
  {
    return context.reply(
    isSelf?
      '🚚  Your Candy Bong is still being delivered!' :
      `❄ On cooldown, please wait ${getTimeLeft(cooldown)}.`,
    isSelf?
      `It will arrive in **${getTimeLeft(cooldown)}**` : undefined);
  }

  if(!isSelf)
  {
    const candybongs = await Candybongs.ofUser(author);
    if(candybongs === undefined)
      return context.send("Whoops. Couldn't get give a Candy Bong. Please try again.");

    if(candybongs === 0)
      return context.send("You don't have any Candy Bongs to give.");
    
    const giveResult = await Candybongs.subtractFromUser(author);
    if(giveResult === undefined)
      return context.send("Whoops. Couldn't get give a Candy Bong. Please try again.");
  }

  const getResult = await Candybongs.addToUser(isSelf? author : mention.id);
  if(getResult === undefined)
    return context.send("Whoops. Couldn't get give a Candy Bong. Please try again.");

  context.reply(isSelf?
    '🍭  You unboxed your Candy Bong!' :
    `🍭  You gave a Candy Bong to ${mention.displayName}!`);
}
