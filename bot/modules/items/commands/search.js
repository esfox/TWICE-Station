const command = 'search';

const { Command } = require('discord-utils');
const { randomElement, onCooldown } = require('utils/functions');
const { Items } = require('api/models');
const
{ 
  getRandomItem, 
  checkForCollections 
} = require('../item');

const 
{ 
  trash_messages, 
  emotes, 
  cooldowns: cooldown 
} = require('config/config');

const cooldowns = require('utils/cooldown');
cooldowns.add(command, cooldown.search);

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = command;
    this.aliases.push('s');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  if(await onCooldown(context, command))
    return;

  const item = getRandomItem();
  if(!item)
    return context.reply(randomElement(trash_messages));

  let title = `${item.name}! ${item.emote? item.emote : ''}`;
  if(item.value === 'legendary')
    title = `✨ ${title}${emotes.jeonggering}`;
  if(item.value === 'rare')
    title = `${title}⭐`;

  let embed = context.embed('🔎  You found...')
    .addField(title, `It's ${item.valueText}!`)
    .setFooter(`Item code: ${item.code}`);

  if(item.image)
    embed.setThumbnail(item.image);

  const userID = context.message.author.id;
  const itemAddResult = await Items.addToUser(userID, item.code);
  if(itemAddResult === undefined)
    return context.error("Whoops. Can't save your item to your bag. Please try again.");

  if(itemAddResult === false)
    return context.reply('❌  You OnceBag is full.');

  context.chat(embed, true);

  const items = await Items.ofUser(userID);
  const collections = await checkForCollections(userID, items);
  const collectionsCount = collections.length;
  if(collectionsCount === 0)
    return;

  const bonus = collections.reduce((sum, { bonus }) => sum + bonus, 0);
  const description = (collectionsCount !== 1?
    `${collections.reduce((text, { name }) => 
      `${text}• **${name}**\n`, '')}` : '')
    + `\nYou earn a bonus of **${bonus} TWICECOINS**! 💰`;
  title = (collectionsCount === 1?
    `You have completed the ${collections.shift().name} Collection! ` :
    `You have completed ${collectionsCount} collections! `)
    + emotes.jeonggering;
  
  embed = context.embed('🎊 CONGRATULATIONS! 🎊')
    .addField(title, description);
  context.chat(embed, true);
}
