const { Command } = require('discord-utils');
const { getMention } = require('../../../utils/functions');

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
function action(context)
{
  /** @type {import('discord.js').GuildMember} */
  const user = getMention(context, true);
  if(!user)
    return context.send('❌  No user mentioned.');

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

  // TODO: Get and show coins and candybongs

  context.chat(info);
}