const command = 'wheel';

const { Command } = require('discord-utils');
const { emotes, rewards, cooldowns: cooldown } = require('config/config');

const members = require('data/members');
const { Coins } = require('api/models');

const { sleep, randomElement, onCooldown } = require('utils/functions');
const cooldowns = require('utils/cooldown');
cooldowns.add(command, cooldown.wheel);

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = command;
    this.aliases.push('w');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const user = context.message.author;
  let [ member ] = context.parameters || [];
  if(!member)
    return context.send('Which member do you choose?');

  member = member.toLowerCase();
  member = members.find(({ name, code }) => 
    name.toLowerCase() === member || code === member);
  if(!member)
    return context.send('❌  That is not a TWICE member.');

  if(await onCooldown(context, command))
    return;

  const choseText = `You chose **${member.name}**.\n`;
  const embed = context.embed('Wheel of TWICE', 
    `${choseText}\nSpinning... ${emotes.wheel_spin}`);
  const message = await context.chat(embed, true);
  await sleep(4);

  const chosenMember = randomElement(members);
  const won = member.code === chosenMember.code;
  if(won)
  {
    const rewardResult = await Coins.addToUser(user.id, rewards.wheel);
    if(rewardResult === undefined)
      return context.error("Whoops. Can't add your reward.");
  }

  const description = `${choseText}`
    + `The wheel stopped at **${chosenMember.name}**!\n\n`
    + (won? 
      `YOU WIN __**${rewards.wheel}**__ **TWICE**COINS! 🎉` : 
      'You lose. ❌');
  embed.setDescription(description);
  await message.edit(user, embed);
}