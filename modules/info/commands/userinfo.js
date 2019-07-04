const { Command } = require('discord-utils');
const { getMention } = require('../../../utils/functions');
const { User } = require('database');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'userinfo';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  /** @type {import('discord.js').GuildMember} */
  let user = getMention(context, true);
  if(!user)
    user = context.message.member;

  const info = context.embed(`User info for: ${user.user.tag}`)
    .setThumbnail(user.displayAvatarURL)
    .addField('User ID', user.id);

  if(user.nickname)
    info.addField('Nickname', user.nickname, true);

  info
    .addField('Registered on', user.user.createdAt)
    .addField('Joined on', user.joinedAt);

  if(user.roles.size !== 0)
    info.addField('Roles', user.roles.map(role => role.toString()).join(' '));

  const coins = await User.getCoins(user.id);
  const candybongs = await User.getCandybongs(user.id);
  info.setFooter(`User has: 💰 ${coins.toLocaleString()} TWICECOINS`
    + ` | 🍭 ${candybongs} Candy Bongs`);
  
  context.chat(info);
}