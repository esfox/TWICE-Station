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
  let member = getMention(context, true);
  if(!member)
    member = context.message.member;

  const info = context.embed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL)
    .setThumbnail(member.displayAvatarURL)
    .addField('User ID', member.id);

  if(member.nickname)
    info.addField('Nickname', member.nickname, true);

  info
    .addField('Discord user since', member.user.createdAt)
    .addField(`Joined ${member.guild.name} on`, member.joinedAt);

  if(member.roles.size !== 0)
  {
    const roles = member.roles;
    roles.delete(member.guild.id);
    info.addField('Roles', roles.map(role => role.toString()).join(' '));
  }

  const coins = await User.getCoins(member.id);
  const candybongs = await User.getCandybongs(member.id);
  info.setFooter(`User has: 💰 ${coins.toLocaleString()} TWICECOINS`
    + ` | 🍭 ${candybongs} Candy Bongs`);
  
  context.chat(info);
}