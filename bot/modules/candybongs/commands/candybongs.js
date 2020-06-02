const { Command } = require('discord-utils');
const { User } = require('database');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'candybongs';
    this.aliases.push('cbs');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const candybongs = await User.getCandybongs(context.message.author.id);
  if(candybongs === 0)
    return context.reply("You don't have Candy Bongs.");
  context.reply(`🍭  You have ${candybongs} ${candybongs > 1?
    'Candy Bongs' : 'Candy Bong'}`);
}