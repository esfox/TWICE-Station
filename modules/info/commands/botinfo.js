const { Command } = require('discord-utils');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'botinfo';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
function action(context)
{
  const { user: bot } = context.bot;
  const description = 'I play TWICE music, have currency (TWICECOINS),'
    + ' mini-games and more!\n\n'
    + 'If you need help, please do `;help`';

  const info = context.embed(bot.username, description)
    .setThumbnail(bot.displayAvatarURL)
    .addField('I was created on...', bot.createdAt)
    .addField('If you have any problems or concerns, mention the creator:', 
      `<@${context.config.developer.id}>`);

  context.chat(info);
}