const { Command } = require('discord-utils');
const config = require('config/config');
const { User } = require('database');

const { getMention, getTimeLeft } = require('utils/functions');
const cooldowns = require('utils/cooldown');
const command = 'candybong';
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
    await User.minusCandybong(author);

  await User.addCandybong(isSelf? author : mention.id);
  context.reply(isSelf?
    '🍭  You unboxed your Candy Bong!' :
    `🍭  You gave a Candy Bong to ${mention.displayName}!`);
}