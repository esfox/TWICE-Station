const { Command } = require('discord-utils');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'serverinfo';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
function action(context)
{
  const 
  { 
    name,
    id,
    owner,
    createdAt,
    region,
    memberCount,
    iconURL
  } = context.guild;

  const info = context.embed(name)
    .setThumbnail(iconURL)
    .addField('Invite', context.config.server_invite)
    .addField('Owner', owner.toString())
    .addField('Created on', createdAt)
    .addField('Total Members', memberCount)
    .addField('Region', region)
    .setFooter(`Server ID: ${id}`);

  context.chat(info);
}