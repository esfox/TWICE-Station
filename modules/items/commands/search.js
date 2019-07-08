const command = 'search';

const { Command } = require('discord-utils');
const { randomElement, onCooldown } = require('utils/functions');
const { getRandomItem, addItemToUser } = require('../item');
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

  const embed = context.embed('🔎  You found...')
    .addField(title, `It's ${item.valueText}!`)
    .setFooter(`Item code: ${item.code}`);

  if(item.image)
    embed.setThumbnail(item.image);

  await addItemToUser(context.message.author.id, item.code);
  context.chat(embed, true);
}