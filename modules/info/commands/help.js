const { Command } = require('discord-utils');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'help';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
function action(context)
{
  const info = 'Check the __pinned messages__ in'
    + ` <#${context.config.bot_channel}> for a quick guide.\n`
    + 'Click this [link](https://github.com/esfox/_TWICE-Station/wiki/'
    + 'TWICE-Station-Help/) to see the full list of commands.'

  const { user: bot } = context.bot;
  const embed = context.embed()
    .setAuthor(bot.username, bot.displayAvatarURL)
    .setDescription(info);

  context.chat(embed);
}