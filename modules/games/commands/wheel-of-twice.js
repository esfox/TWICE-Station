const { Command } = require('discord-utils');
const config = require('config/config');
const { emotes, rewards } = config;

const members = require('data/members');
const { User } = require('database');

const { sleep, randomElement, onCooldown } = require('utils/functions');
const cooldowns = require('utils/cooldown');
const command = 'wheel';
cooldowns.add(command, config.cooldowns.wheel);

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
    `${choseText}\nSpinning... ${emotes.wheelSpin}`);
  const message = await context.chat(embed, true);
  await sleep(4);

  const chosenMember = randomElement(members);
  const won = member.code === chosenMember.code;
  if(won)
    await User.addCoins(user.id, rewards.wheel)

  const description = `${choseText}`
    + `The wheel stopped at **${chosenMember.name}**!\n\n`
    + (won? 
      `YOU WIN __**${rewards.wheel}**__ **TWICE**COINS! 🎉` : 
      'You lose. ❌');
  embed.setDescription(description);
  await message.edit(user, embed);
}